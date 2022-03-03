import { Injectable, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { FollowRelation, User } from '@prisma/client';
import {
  FirestoreCollection,
  UserData,
  UserRole,
} from '@tastiest-io/tastiest-utils';
import { UserRecord } from 'firebase-admin/lib/auth/user-record';
import lodash from 'lodash';
import { DateTime } from 'luxon';
import { AccountService } from 'src/admin/account/account.service';
import { AuthenticatedUser } from 'src/auth/auth.model';
import RegisterDto from 'src/auth/dto/register.dto';
import { FirebaseService } from 'src/firebase/firebase.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserEntity } from 'src/users/entities/user.entity';
import { DeepPartial } from 'typeorm';
import { v4 as uuid } from 'uuid';
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
    private readonly prisma: PrismaService, // @InjectRepository(UserEntity) // private usersRepository: Repository<UserEntity>, // @InjectRepository(FollowerEntity) // private followersRepository: Repository<FollowerEntity>,
  ) {}

  // FIX ME. TEMPORARY. SYNC FROM FIRESTORE
  async syncFromFirestore(uid: string) {
    const userDataSnapshot = await this.firebaseApp
      .db(FirestoreCollection.USERS)
      .doc(uid)
      .get();

    const userData = userDataSnapshot.data() as UserData;

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

    const updatedUserEntity: DeepPartial<UserEntity> = {
      uid: uid,
      email: userData.details.email,
      firstName: userData.details.firstName,
      lastName: userData.details?.lastName ?? null,
      isTestAccount: Boolean(userRecord?.customClaims['isTestAccount']),
      mobile: userData.details.mobile ?? null,
      metrics: userData.metrics,
      birthday: userBirthdayDateTime?.isValid
        ? userBirthdayDateTime.toJSDate()
        : null,
      preferences: userData.preferences ?? null,
      financial: { ...userData.paymentDetails },
      location: {
        ...userData.details.address,
        postcode: userData.details?.postalCode
          ?.replace(/[\s-]/gm, '')
          .toUpperCase(),
      },
    };

    // Exists?
    const user = await this.usersRepository.findOne({ where: { uid } });

    if (user) {
      console.log('Saved user as', {
        id: user.id,
        ...user,
        ...updatedUserEntity,
      });

      return this.usersRepository.save({
        id: user.id,
        ...user,
        ...updatedUserEntity,
        uid: '44',
      });
    }

    const newUserFromFirestore = this.usersRepository.create({
      id: uuid(),
      ...updatedUserEntity,
    });

    console.log('Created user as', newUserFromFirestore);

    return this.usersRepository.save(newUserFromFirestore);
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
    this.prisma.user.create({
      data: {
        id: userRecord.uid,
        email,
        first_name: firstName,
        isTestAccount,
        metrics: {
          totalBookings: 0,
          totalSpent: { GBP: 0 },
          recentSearches: [],
          restaurantsVisited: [],
          restaurantsFollowed: [],
        },
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
        | 'id'
        | 'email'
        | 'is_test_account'
        | 'metrics'
        | 'preferences'
        | 'created_at'
        | 'last_active'
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
