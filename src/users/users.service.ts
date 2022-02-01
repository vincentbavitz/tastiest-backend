import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
import { UserEntity } from 'src/entities/user.entity';
import { FirebaseService } from 'src/firebase/firebase.service';
import { DeepPartial, Repository } from 'typeorm';
import UpdateUserDto from './dto/update-user.dto';
import { UserCreatedEvent } from './events/user-created.event';

type CreateUserPrimaryParams = {
  email: string;
  password: string;
  firstName: string;
  isTestAccount: boolean;
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
    const user = await this.usersRepository.findOne({ where: { uid } });

    const userBirthdayDateTime = userData.details?.birthday
      ? DateTime.fromObject({
          year: Number(userData.details.birthday.year),
          month: Number(userData.details.birthday.month),
          day: Number(userData.details.birthday.day),
        })
      : null;

    const updatedUserEntity: DeepPartial<UserEntity> = {
      uid,
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

    console.log(
      'users.service ➡️ updatedUserEntity:',
      updatedUserEntity.birthday,
    );

    if (user) {
      return this.usersRepository.save({
        ...user,
        ...updatedUserEntity,
      });
    }

    const newUserFromFirestore = this.usersRepository.create(updatedUserEntity);

    console.log(
      '74 users.service ➡️ newUserFromFirestore:',
      newUserFromFirestore.firstName,
    );

    return this.usersRepository.save(newUserFromFirestore);
  }

  async createUser(
    {
      email,
      password,
      firstName,
      isTestAccount = false,
    }: CreateUserPrimaryParams,
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
      uid: userRecord.uid,
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
      lastActive: new Date().toISOString(),
    });

    await this.usersRepository.save(entity);

    // Event handles Stripe user creation and etc.
    this.eventEmitter.emit(
      'user.created',
      new UserCreatedEvent(userRecord, isTestAccount),
    );

    // Now we return the token so the new user can sign in
    return { token };
  }

  async getUser(uid: string, user: AuthenticatedUser) {
    const isAdmin = user.roles.includes(UserRole.ADMIN);
    if (!isAdmin && uid !== user.uid) {
      throw new ForbiddenException();
    }

    const userEntity = await this.usersRepository.findOne({ where: { uid } });

    // Hide ID and financial from non-admins.
    if (userEntity) {
      return {
        ...userEntity,
        id: isAdmin ? userEntity.id : undefined,
        financial: isAdmin ? userEntity.financial : undefined,
      };
    }

    throw new NotFoundException('User not found');
  }

  async updateUser(update: UpdateUserDto, requestUser: AuthenticatedUser) {
    const isAdmin = requestUser.roles.includes(UserRole.ADMIN);
    if (!isAdmin && update.uid !== requestUser.uid) {
      throw new ForbiddenException();
    }

    console.log('users.service ➡️ update:', update);

    const user = await this.getUser(update.uid, requestUser);

    const updatedUser = {
      ...user,
      ...update,

      // Ensure you properly destructure all nested objects.
      location: {
        ...user.location,
        ...update.location,
      },

      // Only Admins may modify these properties
      financial: isAdmin ? update.financial : user.financial,
    };

    return this.usersRepository.save(updatedUser);
  }

  async getUsers() {
    const users = await this.usersRepository.find();

    if (users?.length) {
      return users;
    }

    return [];
  }
}
