import { Injectable } from '@nestjs/common';
import { FirestoreCollection } from '@tastiest-io/tastiest-utils';
import { FirebaseService } from 'src/firebase/firebase.service';
import { SegmentWebhookBody } from './sync.model';

@Injectable()
export class SyncsService {
  /**
   * @ignore
   */
  constructor(private readonly firebaseApp: FirebaseService) {}

  syncSegmentEvent(body: SegmentWebhookBody) {
    const documentId = body.userId ?? body.anonymousId;
    const timestamp = new Date(body.timestamp).getTime();

    // Is it an existing user?
    const userExists = Boolean(body.userId);
    if (userExists && body.type === 'group') {
      // If the user exists and it's an identify event, try merging the profiles.
      null;
    }

    // Send the event to Firestore.
    // Keyed by timestamp for quick lookups.
    this.firebaseApp
      .db(FirestoreCollection.EVENTS)
      .doc(documentId)
      .set(
        {
          [timestamp]: {
            ...body,
            type: body.type,
            timestamp,
          },
        },
        { merge: true },
      );

    return { body };
  }
}
