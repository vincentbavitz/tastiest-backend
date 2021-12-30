import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  FirestoreCollection,
  RestaurantSupportRequest,
  SupportMessage,
  SupportMessageDirection,
  UserRole,
  UserSupportRequest,
} from '@tastiest-io/tastiest-utils';
import { isEqual } from 'lodash';
import { AuthenticatedUser } from 'src/auth/auth.model';
import { FirebaseService } from 'src/firebase/firebase.service';
import UpdateUserTicketDto from './dto/update-user-ticket.dto';

type SupportRequestCategory = 'user' | 'restaurant';

@Injectable()
export class SupportService {
  /**
   * @ignore
   */
  constructor(private readonly firebaseApp: FirebaseService) {}

  async getTicket(
    id: string,
    type: SupportRequestCategory,
    user: AuthenticatedUser,
  ) {
    const collection =
      type === 'user'
        ? FirestoreCollection.SUPPORT_USERS
        : FirestoreCollection.SUPPORT_RESTAURANTS;

    const ticketSnapshot = await this.firebaseApp.db(collection).doc(id).get();

    // Does the ticket exist?
    if (!ticketSnapshot.exists) {
      throw new NotFoundException(`Ticket with the given ID doesn't exist.`);
    }

    const ticket = ticketSnapshot.data() as
      | UserSupportRequest
      | RestaurantSupportRequest;

    // Ensure the request is coming from the owner of the ticket or an admin.
    if (!this.validateTicketOwnership(user, ticket)) {
      throw new ForbiddenException();
    }

    return ticket;
  }

  async updateTicket(data: UpdateUserTicketDto) {
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

  async replyToTicket(
    id: string,
    type: SupportRequestCategory,
    user: AuthenticatedUser,
    message: string,
    name: string,
  ) {
    const ticket = await this.getTicket(id, type, user);

    // Does this belong to the requester?
    if (!this.validateTicketOwnership(user, ticket)) {
      throw new ForbiddenException();
    }

    // Set direction.
    // prettier-ignore
    const direction: SupportMessageDirection = user.roles.includes(UserRole.ADMIN)
      ? SupportMessageDirection[`SUPPORT_TO_${type.toUpperCase()}`] 
      : SupportMessageDirection[`${type.toUpperCase()}_TO_SUPPORT`];

    const reply: SupportMessage = {
      name,
      message,
      direction,
      timestamp: Date.now(),
      recipientHasOpened: false,
      hasOpened: false,
    };

    const collection =
      type === 'user'
        ? FirestoreCollection.SUPPORT_USERS
        : FirestoreCollection.SUPPORT_RESTAURANTS;

    // Updated file
    const updated = { ...ticket };

    // Mark all previous messages as read.
    updated.conversation = ticket.conversation.map((message) => ({
      ...message,
      recipientHasOpened: true,
    }));

    // Add reply to conversation
    updated.conversation = [...ticket.conversation, reply];
    updated.updatedAt = Date.now();

    this.firebaseApp.db(collection).doc(id).set(updated, { merge: true });
  }

  closeTicket() {
    return null;
  }

  /**
   * Validate that the request is coming from the owner of the ticket or an admin.
   */
  private validateTicketOwnership(
    user: AuthenticatedUser,
    ticket: UserSupportRequest | RestaurantSupportRequest,
  ) {
    if (user.roles.includes(UserRole.ADMIN)) {
      return true;
    }

    const uid = (ticket as any).userId ?? (ticket as any).restaurantId;
    return uid === user.uid;
  }
}
