import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  dlog,
  FirestoreCollection,
  RestaurantData,
} from '@tastiest-io/tastiest-utils';
import { AuthenticatedUser } from 'src/auth/auth.model';
import EmailSchedulingService from 'src/email/schedule/email-schedule.service';
import { RestaurantEntity } from 'src/entities/restaurant.entity';
import RestaurateurApplicationEntity from 'src/entities/restaurateur-application.entity';
import { FirebaseService } from 'src/firebase/firebase.service';
import { TrackingService } from 'src/tracking/tracking.service';
import { DeepPartial, Repository } from 'typeorm';
import ApplyDto from './dto/apply.dto';
import NotifyDto from './dto/notify.dto';

// const MS_IN_ONE_MINUTE = 60 * 1000;

@Injectable()
export class RestaurantsService {
  /**
   * @ignore
   */
  constructor(
    private readonly emailSchedulingService: EmailSchedulingService,
    private readonly firebaseApp: FirebaseService,
    private readonly trackingService: TrackingService,
    @InjectRepository(RestaurantEntity)
    private restaurantsRepository: Repository<RestaurantEntity>,
    @InjectRepository(RestaurateurApplicationEntity)
    private applicationsRepository: Repository<RestaurateurApplicationEntity>,
  ) {}

  // FIX ME. TEMPORARY. SYNC FROM FIRESTORE
  async syncFromFirestore(restaurantId: string) {
    const restaurantDataSnapshot = await this.firebaseApp
      .db(FirestoreCollection.RESTAURANTS)
      .doc(restaurantId)
      .get();

    const restaurantData = restaurantDataSnapshot.data() as RestaurantData;

    // Exists?
    const restaurantUser = await this.restaurantsRepository.findOne({
      where: { id: restaurantId },
    });

    const updatedRestaurantEntity: DeepPartial<RestaurantEntity> = {
      id: uid,
      email: restaurantData.details.email,
      firstName: restaurantData.details.firstName,
      lastName: restaurantData.details?.lastName ?? null,
      isTestAccount: Boolean(userRecord?.customClaims['isTestAccount']),
      mobile: userData.details.mobile ?? null,
      metrics: userData.metrics,
      birthday: userBirthdayDateTime?.isValid
        ? userBirthdayDateTime.toJSDate()
        : null,
      preferences: userData.preferences ?? null,
      financial: { ...userData.paymentDetails },
      location: {
        ...userData.details.address,
        postcode: userData.details?.postalCode
          ?.replace(/[\s-]/gm, '')
          .toUpperCase(),
      },
    };

    if (restaurantUser) {
      return this.restaurantsRepository.save({
        ...restaurantUser,
        ...updatedRestaurantEntity,
      });
    }

    const newRestaurantUserFromFirestore = this.restaurantsRepository.create(
      updatedRestaurantEntity,
    );

    return this.restaurantsRepository.save(newRestaurantUserFromFirestore);
  }

  async syncFromContentful(restaurantId: string);

  async scheduleFollowersEmail(data: NotifyDto) {
    const { token, restaurantId, templateId, subject, scheduleFor } = data;

    // Ensure the timing is valid
    // if (isBefore(scheduleFor, Date.now() + 5 * MS_IN_ONE_MINUTE)) {
    //   throw new BadRequestException(
    //     'Please schedule for at least 5 minutes in the future.',
    //   );
    // }

    // Receipients are all the restaurant's followers with notifications turned on.
    const restaurantDataApi =
      this.firebaseApp.getRestaurantDataApi(restaurantId);

    const restaurantData = await restaurantDataApi.getRestaurantData();
    const recipients = restaurantData.metrics.followers
      .filter((follower) => follower.notifications)
      .map((follower) => follower.email);

    dlog('restaurants.service ➡️ recipients:', recipients);

    // Get template and replace content's placeholders with real values.
    // Eg {{ firstName }} --> Daniel
    // TODO: Work out how to send a separate email to each follower with different content.
    const template = restaurantData.email?.templates?.[templateId] ?? null;
    if (!template) {
      throw new NotFoundException('Could not find template.');
    }

    if (!template.isApproved) {
      throw new BadRequestException('Template is not approved.');
    }

    const content = template.html;

    return this.emailSchedulingService.scheduleEmail({
      recipients,
      subject,
      content,
      date: new Date(scheduleFor).toUTCString(),
    });
  }

  async applyAsRestaurateur(
    applicationData: ApplyDto,
    user: AuthenticatedUser,
  ) {
    const applicationEntity = this.applicationsRepository.create({
      ...applicationData,
    });

    await this.trackingService.track(
      'New Restaurateur Application',
      {
        userId: user?.uid,
      },
      applicationEntity,
    );

    const application = await this.applicationsRepository.save(
      applicationEntity,
    );

    return { ...application, id: undefined };
  }
}
