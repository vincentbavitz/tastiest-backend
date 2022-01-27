import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  PreconditionFailedException,
} from '@nestjs/common';
import { FirebaseAuthError, UserRole } from '@tastiest-io/tastiest-utils';
import { UserRecord } from 'firebase-admin/lib/auth/user-record';
import { AuthenticatedUser } from 'src/auth/auth.model';
import { FirebaseService } from 'src/firebase/firebase.service';

type CreateAccountPrimaryParams = {
  email: string;
  password: string;
  role: UserRole;
  firstName: string;
  isTestAccount: boolean;
};

@Injectable()
export class AccountService {
  /**
   * @ignore
   */
  constructor(private readonly firebaseApp: FirebaseService) {}

  async createAccount(
    {
      email,
      password,
      firstName,
      role,
      isTestAccount = false,
    }: CreateAccountPrimaryParams,
    user?: AuthenticatedUser,
  ) {
    // Only allow admins to set arbitrary roles
    if (!user?.roles?.includes(UserRole.ADMIN) && role !== UserRole.EATER) {
      throw new ForbiddenException(
        'You are not allowed to create an this type of account',
      );
    }

    try {
      const userRecord = await this.firebaseApp.getAuth().createUser({
        email,
        password,
        emailVerified: false,
        displayName: firstName,
        disabled: false,
      });

      await this.firebaseApp.getAuth().setCustomUserClaims(userRecord.uid, {
        [role]: true,
        isTestAccount,
      });

      return userRecord;
    } catch (error) {
      const code = error.code as FirebaseAuthError;

      if (Object.values(FirebaseAuthError).includes(code)) {
        throw new PreconditionFailedException(code);
      }

      throw new PreconditionFailedException(FirebaseAuthError.OTHER);
    }
  }

  /**
   *
   * @param limit How many users to return. Maxiumum of 1000.
   * @param pageToken Use for pagination. See https://firebase.google.com/docs/auth/admin/manage-users#bulk_retrieve_user_data
   * @returns An array of user records from Firebase, as well as the `nextPageToken`.
   *
   * Each batch of results contains a list of users and the next page token used to list the next batch of users. When all the users have already been listed, no pageToken is returned.
   *
   * Note that if you specify a role with a given limit, the resulting users array will contain only the filtered results and therefore may not match the limit provided, even if there are more results in this role.
   * In this case, you may request the next page.
   *
   * Returns Firebase user records.
   */
  async getAccounts(role?: UserRole, limit?: number, pageToken?: string) {
    try {
      const usersResponse = await this.firebaseApp
        .getAuth()
        .listUsers(limit ?? 1000, pageToken);

      // No specific role given, list all users.
      if (!role) {
        return {
          users: usersResponse.users,
          nextPageToken: usersResponse.pageToken,
        };
      }

      const users = usersResponse.users.filter(
        (user) => user.customClaims?.[role.toLowerCase()] === true,
      );

      return { users, nextPageToken: usersResponse.pageToken };
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async getAccount(uid: string) {
    let userRecord: UserRecord;

    try {
      userRecord = await this.firebaseApp.getAuth().getUser(uid);
    } catch {
      throw new NotFoundException(
        'No user with this corresponding user ID exists.',
      );
    }

    return userRecord;
  }

  async setAccountRole(uid: string, role: UserRole) {
    return this.firebaseApp.getAuth().setCustomUserClaims(uid, {
      eater: role === UserRole.EATER,
      admin: role === UserRole.ADMIN,
      restaurant: role === UserRole.RESTAURANT,
    });
  }
}
