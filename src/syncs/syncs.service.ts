import { Injectable } from '@nestjs/common';
import { FirestoreCollection } from '@tastiest-io/tastiest-utils';
import { db } from 'src/firestore/firestore.module';
import { SegmentWebhookBody } from './sync.model';

@Injectable()
export class SyncsService {
  syncSegmentEvent(body: SegmentWebhookBody) {
    // Send the event to Firestore.
    db(FirestoreCollection.EVENTS).add({
      type: body.type,
      ...body,
    });

    return { body };
  }
}
