import { FirestoreCollection } from '@tastiest-io/tastiest-utils';
import * as admin from 'firebase-admin';

export const db = (collection: FirestoreCollection) =>
  admin.firestore().collection(collection);
