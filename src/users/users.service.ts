import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { FirestoreCollection, UserData } from '@tastiest-io/tastiest-utils';
import { FirebaseService } from 'src/firebase/firebase.service';

@Injectable()
export class UsersService {
  /**
   * @ignore
   */
  constructor(private readonly firebaseApp: FirebaseService) {}

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
