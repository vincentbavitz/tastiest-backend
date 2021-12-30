import { Injectable } from '@nestjs/common';
import { FirebaseService } from 'src/firebase/firebase.service';

// const MS_IN_ONE_MINUTE = 60 * 1000;

@Injectable()
export class AdminService {
  /**
   * @ignore
   */
  constructor(private readonly firebaseApp: FirebaseService) {}

  async getUsers() {
    return ['vince', 'dan'];
  }

  async getUser(uid: string) {
    return 'bob the cat';
  }
}
//   const limit = Number(request?.query?.limit ?? 100);

//   try {
//     const query = await db(FirestoreCollection.USERS);

//     const usersSnapshot = await query
//       // .orderBy('paidAt', 'desc')
//       // .startAt(startAt)
//       .limit(limit)
//       .get();

//     const users: UserRecord[] = [];
//     usersSnapshot.forEach(doc =>
//       users.push({ id: doc.id, ...doc.data() } as UserRecord),
//     );

//     if (!users?.length) {
//       response.json([]);
//       return;
//     }

//     response.json(users);
//   } catch (error) {
//     response.status(400).statusMessage = `Error: ${error}`;
//     response.end();
//     return;
//   }
