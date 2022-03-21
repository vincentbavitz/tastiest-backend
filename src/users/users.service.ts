import { Injectable, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { FollowRelation, User } from '@prisma/client';
import { FirestoreCollection, UserRole } from '@tastiest-io/tastiest-utils';
import { UserRecord } from 'firebase-admin/lib/auth/user-record';
import * as lodash from 'lodash';
import { DateTime } from 'luxon';
import { AccountService } from 'src/admin/account/account.service';
import { AuthenticatedUser } from 'src/auth/auth.model';
import RegisterDto from 'src/auth/dto/register.dto';
import { FirebaseService } from 'src/firebase/firebase.service';
import { PrismaService } from 'src/prisma/prisma.service';
import UpdateUserDto from './dto/update-user.dto';
import { UserCreatedEvent } from './events/user-created.event';

type CreateUserPrimaryParams = {
  email: string;
  password: string;
  firstName: string;
  isTestAccount: boolean;
};

type SetRestaurantFollowingNotifications = {
  notifyNewMenu: boolean;
  notifyGeneralInfo: boolean;
  notifyLastMinuteTables: boolean;
  notifyLimitedTimeDishes: boolean;
  notifySpecialExperiences: boolean;
};

@Injectable()
export class UsersService {
  /**
   * @ignore
   */
  constructor(
    private readonly firebaseApp: FirebaseService,
    private readonly accountService: AccountService,
    private readonly eventEmitter: EventEmitter2,
    private readonly prisma: PrismaService,
  ) {}

  // FIX ME. TEMPORARY. SYNC FROM FIRESTORE
  async syncFromFirestore(uid: string) {
    const userDataSnapshot = await this.firebaseApp
      .db(FirestoreCollection.USERS)
      .doc(uid)
      .get();

    const userData = userDataSnapshot.data() as any;

    let userRecord: UserRecord;
    try {
      userRecord = await this.firebaseApp.getAuth().getUser(uid);
    } catch {
      userRecord = null;
    }

    const userBirthdayDateTime = userData.details?.birthday
      ? DateTime.fromObject({
          year: Number(userData.details.birthday.year),
          month: Number(userData.details.birthday.month),
          day: Number(userData.details.birthday.day),
        })
      : null;

    const updatedUser: Omit<User, 'created_at' | 'last_active'> = {
      id: uid,
      email: userData.details.email,
      first_name: userData.details.firstName,
      last_name: userData.details?.lastName,
      is_test_account: Boolean(userRecord?.customClaims['isTestAccount']),
      mobile: userData.details.mobile ?? null,
      birthday: userBirthdayDateTime?.isValid
        ? userBirthdayDateTime.toJSDate()
        : undefined,
      location_lon: userData.details?.address?.lon,
      location_lat: userData.details?.address?.lat,
      location_address: userData.details?.address?.address,
      location_display: userData.details?.address?.displayLocation,
      location_postcode: userData.details?.postalCode,
      stripe_customer_id: userData.paymentDetails?.stripeCustomerId,
      stripe_setup_secret: userData.paymentDetails?.stripeSetupSecret,
    };

    const user = await this.prisma.user.findUnique({ where: { id: uid } });

    if (user) {
      return this.prisma.user.update({
        where: { id: user.id },
        data: updatedUser,
      });
    }

    return this.prisma.user.create({
      data: updatedUser,
    });
  }

  async createUser(
    {
      email,
      password,
      firstName,
      isTestAccount = false,
      anonymousId,
      userAgent,
    }: RegisterDto,
    user?: AuthenticatedUser,
  ) {
    // First, we create an account with Firebase Auth.
    const userRecord = await this.accountService.createAccount(
      {
        email,
        password,
        firstName,
        isTestAccount,
        role: UserRole.EATER,
      },
      user,
    );

    // Then we grab a JWT token for the account.
    const token = await this.firebaseApp
      .getAuth()
      .createCustomToken(userRecord.uid);

    // Now we create the user in Postgres
    await this.prisma.user.create({
      data: {
        id: userRecord.uid,
        email,
        first_name: firstName,
        is_test_account: isTestAccount,
      },
    });

    // Event handles Stripe user creation and etc.
    this.eventEmitter.emit(
      'user.created',
      new UserCreatedEvent(
        userRecord,
        isTestAccount,
        anonymousId,
        userAgent,
        firstName,
      ),
    );

    // Now we return the token so the new user can sign in
    return { token };
  }

  async getUser(
    uid: string,
    relations: Array<'orders' | 'bookings' | 'following'> = [],
  ) {
    const userEntity = await this.prisma.user.findUnique({
      where: { id: uid },
      include: {
        orders: relations.some((r) => r === 'orders'),
        bookings: relations.some((r) => r === 'bookings'),
        following: relations.some((r) => r === 'following'),
      },
    });

    if (!userEntity) {
      throw new NotFoundException('User not found');
    }

    return userEntity;
  }

  async getUsers() {
    const users = await this.prisma.user.findMany({
      orderBy: { created_at: 'desc' },
    });

    if (users?.length) {
      return users;
    }

    return [];
  }

  async updateUser(uid: string, update: Omit<UpdateUserDto, 'uid'>) {
    console.log('users.service ➡️ update:', update);

    const user = await this.getUser(uid);

    // Update data with any undefined key-value pairs removed.
    const updateData = lodash.omitBy<
      Omit<
        User,
        'id' | 'email' | 'is_test_account' | 'created_at' | 'last_active'
      >
    >(
      {
        first_name: update.firstName,
        last_name: update.lastName,
        mobile: update.mobile,
        birthday: update.birthday,
        location_lon: update.location?.lon,
        location_lat: update.location?.lat,
        location_address: update.location?.address,
        location_display: update.location?.display,
        location_postcode: update.location?.postcode,
        stripe_customer_id: update.financial?.stripeCustomerId,
        stripe_setup_secret: update.financial?.stripeSetupSecret,
      },
      lodash.isUndefined,
    );

    console.log('users.service ➡️ updateData:', updateData);

    const updatedUser: User = {
      ...user,
      ...updateData,
    };

    console.log('users.service ➡️ updatedUser:', updatedUser);

    return this.prisma.user.update({ where: { id: uid }, data: updatedUser });
  }

  /**
   * INCOMPLETE!
   * Think about events for Segment and TEST every possibility.
   */
  async followRestaurant(
    restaurantId: string,
    authenticatedUser: AuthenticatedUser,
    {
      notifyNewMenu,
      notifyGeneralInfo,
      notifyLastMinuteTables,
      notifyLimitedTimeDishes,
      notifySpecialExperiences,
    }: SetRestaurantFollowingNotifications | undefined,
  ) {
    // Get this specific relation if it exists
    // We can't do a simple upsert because restaurant_id and
    // user_id aren't uniquely specifying parameters.
    const followRelation = await this.prisma.followRelation.findFirst({
      where: { restaurant_id: restaurantId, user_id: authenticatedUser.uid },
    });

    const newRelationData: Omit<FollowRelation, 'id'> = {
      user_id: authenticatedUser.uid,
      restaurant_id: restaurantId,
      followed_at: new Date(),
      notify_new_menu: notifyNewMenu,
      notify_general_info: notifyGeneralInfo,
      notify_last_minute_tables: notifyLastMinuteTables,
      notify_limited_time_dishes: notifyLimitedTimeDishes,
      notify_special_experiences: notifySpecialExperiences,
    };

    if (followRelation) {
      return this.prisma.followRelation.update({
        where: { id: followRelation.id },
        data: newRelationData,
      });
    }

    return this.prisma.followRelation.create({
      data: newRelationData,
    });
  }
}
