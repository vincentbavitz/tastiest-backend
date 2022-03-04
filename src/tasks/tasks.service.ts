import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import {
  FirestoreCollection,
  RestaurantData,
  UserData,
} from '@tastiest-io/tastiest-utils';
import { FirebaseService } from 'src/firebase/firebase.service';
import { RestaurantsService } from 'src/restaurants/restaurants.service';
import { UsersService } from 'src/users/users.service';

type UserDataWithId = {
  id: string;
} & UserData;

@Injectable()
export class TasksService {
  private schedulerRegistry: SchedulerRegistry;
  private readonly logger = new Logger(TasksService.name);

  /**
   * @ignore
   */
  constructor(
    private firebaseApp: FirebaseService,
    private usersService: UsersService,
    private restaurantsService: RestaurantsService,
  ) {}

  @Cron(CronExpression.EVERY_30_SECONDS)
  async updateRestaurants() {
    this.logger.log('sdf');
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async syncUsers() {
    const firebaseUsersSnapshot = await this.firebaseApp
      .db(FirestoreCollection.USERS)
      .limit(1000)
      .get();

    const firebaseUsers: UserDataWithId[] = [];

    firebaseUsersSnapshot.forEach((doc) =>
      firebaseUsers.push({ id: doc.id, ...doc.data() } as UserDataWithId),
    );

    firebaseUsers.forEach(async (user) => {
      console.log('Syncing user:', user.details.firstName);
      await this.usersService.syncFromFirestore(user.id);
    });
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async syncRestaurants() {
    const firebaseRestaurantsSnapshot = await this.firebaseApp
      .db(FirestoreCollection.RESTAURANTS)
      .limit(1000)
      .get();

    const firebaseRestaurants: RestaurantData[] = [];

    firebaseRestaurantsSnapshot.forEach((doc) =>
      firebaseRestaurants.push(doc.data() as RestaurantData),
    );

    firebaseRestaurants.forEach(async (restaurant) => {
      console.log('Syncing restaurant:', restaurant.details.name);
      await this.restaurantsService.syncFromFirestore(restaurant.details.id);
    });
  }
}
