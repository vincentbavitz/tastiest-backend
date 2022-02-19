import { Injectable, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FirestoreCollection,
  UserData,
  UserRole,
} from '@tastiest-io/tastiest-utils';
import { UserRecord } from 'firebase-admin/lib/auth/user-record';
import { DateTime } from 'luxon';
import { AccountService } from 'src/admin/account/account.service';
import { AuthenticatedUser } from 'src/auth/auth.model';
import RegisterDto from 'src/auth/dto/register.dto';
import { FollowerEntity } from 'src/entities/follower.entity';
import { FirebaseService } from 'src/firebase/firebase.service';
import { RestaurantEntity } from 'src/restaurants/restaurant.entity';
import { UserEntity } from 'src/users/user.entity';
import { DeepPartial, Repository } from 'typeorm';
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
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    @InjectRepository(FollowerEntity)
    private followersRepository: Repository<FollowerEntity>,
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

    // Exists?
    const user = await this.usersRepository.findOne({ where: { id: uid } });

    const userBirthdayDateTime = userData.details?.birthday
      ? DateTime.fromObject({
          year: Number(userData.details.birthday.year),
          month: Number(userData.details.birthday.month),
          day: Number(userData.details.birthday.day),
        })
      : null;

    const updatedUserEntity: DeepPartial<UserEntity> = {
      id: uid,
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

    if (user) {
      return this.usersRepository.save({
        ...user,
        ...updatedUserEntity,
      });
    }

    const newUserFromFirestore = this.usersRepository.create(updatedUserEntity);

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
    const entity = this.usersRepository.create({
      id: userRecord.uid,
      email,
      firstName,
      isTestAccount,
      metrics: {
        totalBookings: 0,
        totalSpent: { GBP: 0 },
        recentSearches: [],
        restaurantsVisited: [],
        restaurantsFollowed: [],
      },
      lastActive: new Date(),
      createdAt: new Date(),
    });

    await this.usersRepository.save(entity);

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

  async getUser(uid: string, relations: Array<'orders' | 'bookings'> = []) {
    const userEntity = await this.usersRepository.findOne({
      where: { id: uid },
      relations,
    });

    // Hide ID and financial from non-admins.
    if (!userEntity) {
      throw new NotFoundException('User not found');
    }

    return userEntity;
  }

  async getUsers() {
    const users = await this.usersRepository.find();

    if (users?.length) {
      return users;
    }

    return [];
  }

  async updateUser(update: UpdateUserDto) {
    console.log('users.service ➡️ update:', update);

    const user = await this.getUser(update.uid);

    const updatedUser = {
      ...user,
      ...update,

      // Ensure you properly destructure all nested objects.
      location: {
        ...user.location,
        ...update.location,
      },

      financial: {
        ...user.financial,
        ...update.financial,
      },
    };

    console.log('users.service ➡️ updatedUser:', updatedUser);

    return this.usersRepository.save(updatedUser);
  }

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
    const user = await this.getUser(authenticatedUser.uid);
    // const restaurant = await this.restaurantsService.

    this.followersRepository.create({
      user,
      restaurant: '' as never as RestaurantEntity,
      followedAt: new Date(),
      notifyNewMenu: false,
      notifyGeneralInfo: false,
      notifyLastMinuteTables: false,
      notifyLimitedTimeDishes: false,
      notifySpecialExperiences: false,
    });

    return null;
  }
}
