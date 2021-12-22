import { Injectable } from '@nestjs/common';
import {
  FirestoreCollection,
  UserSupportRequest,
} from '@tastiest-io/tastiest-utils';
import { isEqual } from 'lodash';
import { FirebaseService } from 'src/firebase/firebase.service';
import UpdateRestaurantTicketDto from './dto/update-restaurant-ticket.dto';
import UpdateUserTicketDto from './dto/update-user-ticket.dto';

@Injectable()
export class SupportService {
  constructor(private readonly firebaseApp: FirebaseService) {}

  async updateUserTicket(data: UpdateUserTicketDto) {
    const ref = this.firebaseApp
      .db(FirestoreCollection.SUPPORT_USERS)
      .doc(data.ticketId);

    const originalSnapshot = await ref.get();
    const original = originalSnapshot.data() as UserSupportRequest;

    // Updated file
    const updated = { ...original };

    if (data.priority !== undefined) updated.priority = data.priority;
    if (data.resolved !== undefined) updated.resolved = data.resolved;
    if (data.type !== undefined) updated.type = data.type;

    // Have we actually changed anything?
    // If not, just return.
    if (isEqual(original, updated)) {
      console.log('Nothing changed');
      return { message: 'critical' };
    }

    // Save new to Firestore
    const ticket: UserSupportRequest = {
      ...original,
      ...updated,
      updatedAt: Date.now(),
    };

    await ref.set(ticket, { merge: true });
  }

  updateRestaurantTicket(data: UpdateRestaurantTicketDto) {
    return null;
  }

  replyToTicket() {
    return null;
  }
}
