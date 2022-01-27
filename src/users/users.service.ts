import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FirestoreCollection,
  UserData,
  UserRole,
} from '@tastiest-io/tastiest-utils';
import { AccountService } from 'src/admin/account/account.service';
import { AuthenticatedUser } from 'src/auth/auth.model';
import { UserEntity } from 'src/entities/user.entity';
import { FirebaseService } from 'src/firebase/firebase.service';
import { Repository } from 'typeorm';
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

  async getUser(uid: string) {
    try {
      const userSnapshot = await this.firebaseApp
        .db(FirestoreCollection.USERS)
        .doc(uid)
        .get();

      const user = userSnapshot.data() as UserData;

      if (!user) {
        throw new NotFoundException('User not found.');
      }

      return user;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async getUserProfiles(limit = 100, skip = 0) {
    try {
      const query = await this.firebaseApp.db(FirestoreCollection.USERS);
      const usersSnapshot = await query.limit(limit).offset(skip).get();

      const users: (UserData & { id: string })[] = [];
      usersSnapshot.forEach((doc) =>
        users.push({ id: doc.id, ...(doc.data() as UserData) }),
      );

      if (!users?.length) {
        return [];
      }

      return users;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
