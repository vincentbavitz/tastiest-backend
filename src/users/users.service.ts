import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import {
  FirestoreCollection,
  UserData,
  UserRole,
} from '@tastiest-io/tastiest-utils';
import { AccountService } from 'src/admin/account/account.service';
import { AuthenticatedUser } from 'src/auth/auth.model';
import { FirebaseService } from 'src/firebase/firebase.service';

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
  ) {}

  async createUser(
    { email, password, firstName, isTestAccount }: CreateUserPrimaryParams,
    user: AuthenticatedUser,
  ) {
    const account = await this.accountService.createAccount(
      {
        email,
        password,
        firstName,
        isTestAccount,
        role: UserRole.EATER,
      },
      user,
    );

    console.log('users.service ➡️ account:', account);
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
