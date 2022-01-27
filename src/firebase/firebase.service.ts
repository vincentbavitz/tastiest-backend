import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  FirestoreCollection,
  RestaurantDataApi,
  UserDataApi,
} from '@tastiest-io/tastiest-utils';
import * as firebase from 'firebase-admin';

@Injectable()
export class FirebaseService {
  private firebaseApp: firebase.app.App;

  /**
   * @ignore
   */
  constructor(private configService: ConfigService) {
    this.firebaseApp = firebase.initializeApp({
      credential: firebase.credential.cert({
        projectId: configService.get<string>('FIREBASE_PROJECT_ID'),
        clientEmail: configService.get<string>('FIREBASE_CLIENT_EMAIL'),
        privateKey: configService
          .get<string>('FIREBASE_PRIVATE_KEY')
          .replace(/\\n/g, '\n'),
      }),
      databaseURL: configService.get<string>('FIREBASE_DATABASE_URL'),
    });
  }

  getAuth = (): firebase.auth.Auth => {
    return this.firebaseApp.auth();
  };

  db = (collection: FirestoreCollection) => {
    return this.firestore().collection(collection);
  };

  firestore = (): firebase.firestore.Firestore => {
    return this.firebaseApp.firestore();
  };

  getRestaurantDataApi = (restaurantId: string) => {
    return new RestaurantDataApi(firebase, restaurantId);
  };

  getUserDataApi = (userId: string) => {
    return new UserDataApi(firebase, userId);
  };
}
