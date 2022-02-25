import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CmsApi,
  dlog,
  FirestoreCollection,
  RestaurantData,
} from '@tastiest-io/tastiest-utils';
import { AuthenticatedUser } from 'src/auth/auth.model';
import EmailSchedulingService from 'src/email/schedule/email-schedule.service';
import { FollowerEntity } from 'src/entities/follower.entity';
import { FirebaseService } from 'src/firebase/firebase.service';
import { RestaurantEntity } from 'src/restaurants/entities/restaurant.entity';
import { TrackingService } from 'src/tracking/tracking.service';
import { UsersService } from 'src/users/users.service';
import { DeepPartial, Repository } from 'typeorm';
import ApplyDto from './dto/apply.dto';
import NotifyDto from './dto/notify.dto';
import RestaurantDetails from './entities/restaurant-details';
import RestaurantFinancial from './entities/restaurant-financial';
import RestaurantMetrics from './entities/restaurant-metrics';
import { RestaurantProfileEntity } from './entities/restaurant-profile.entity';
import RestaurantRealtime from './entities/restaurant-realtime';
import RestaurantSettings from './entities/restaurant-settings';
import RestaurateurApplicationEntity from './entities/restaurateur-application.entity';

// const MS_IN_ONE_MINUTE = 60 * 1000;

@Injectable()
export class RestaurantsService {
  /**
   * @ignore
   */
  constructor(
    private readonly userService: UsersService,
    private readonly firebaseApp: FirebaseService,
    private readonly configService: ConfigService,
    private readonly trackingService: TrackingService,
    private readonly emailSchedulingService: EmailSchedulingService,
    @InjectRepository(RestaurantEntity)
    private restaurantsRepository: Repository<RestaurantEntity>,
    @InjectRepository(RestaurantProfileEntity)
    private restaurantProfilesRepository: Repository<RestaurantProfileEntity>,
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

    console.log('restaurants.service ➡️ restaurantData:', restaurantData);

    // Exists?
    const existingRestaurant = await this.restaurantsRepository.findOne({
      where: { uid: restaurantId },
    });

    const cms = new CmsApi(
      this.configService.get('CONTENTFUL_SPACE_ID'),
      this.configService.get('CONTENTFUL_ACCESS_TOKEN'),
    );

    const restaurantContentful = await cms.getRestaurantById(restaurantId);

    const details: RestaurantDetails = {
      name: restaurantData.details.name,
      city: restaurantData.details.city,
      cuisine: restaurantData.details.cuisine,
      uriName: restaurantData.details.uriName,
      bookingSystem: restaurantData.details?.bookingSystem,
      location: {
        lat: restaurantData.details.location?.lat,
        lon: restaurantData.details.location?.lon,
        address: restaurantData.details.location?.address,
        display: restaurantData.details.location?.displayLocation,
        postcode: null,
      },
      contact: {
        firstName: restaurantData.details.contact?.firstName ?? '',
        lastName: restaurantData.details.contact?.lastName ?? '',
        email: restaurantData.details.contact?.email ?? '',
        phoneNumber: restaurantData.details.contact?.mobile ?? '',
      },
    };

    const metrics: RestaurantMetrics = {
      openTimes: restaurantData.metrics.openTimes,
      quietTimes: restaurantData.metrics.quietTimes,
      seatingDuration: restaurantData.metrics.seatingDuration,
    };

    const settings: RestaurantSettings = {
      shouldFallbackToOpenTimes: true,
      shouldNotifyNewBookings: true,
      ...restaurantData.settings,
    };

    // prettier-ignore
    const financial: RestaurantFinancial = {
      stripeConnectAccount: restaurantData.financial?.stripeConnectedAccount,
      restaurantCutFollowers: restaurantData.financial?.commission.followersRestaurantCut,
      restaurantCutDefault: restaurantData.financial?.commission.defaultRestaurantCut,
    };

    const realtime: RestaurantRealtime = {
      availableBookingSlots: restaurantData.realtime?.availableBookingSlots,
      lastBookingSlotsSync: new Date(
        restaurantData.realtime?.lastBookingSlotsSync,
      ),
    };

    const profile = this.restaurantProfilesRepository.create({
      description: restaurantData.profile.description,
      profilePicture: restaurantData.profile.profilePicture,
      publicPhoneNumber: restaurantData.profile.publicPhoneNumber,
      heroIllustration: restaurantData.profile.heroIllustration,
      backdropStillFrame: restaurantData.profile.backdropStillFrame,
      backdropVideo: restaurantData.profile.backdropVideo,
      website: restaurantData.profile.website,
      meta: restaurantData.profile.meta,
    });

    // Keep this empty because we're transitioning away from this anyway.
    const followers: FollowerEntity[] = [];

    const updatedRestaurantEntity: DeepPartial<RestaurantEntity> = {
      uid: restaurantId,
      details,
      profile,
      metrics,
      settings,
      financial,
      realtime,
      followers,
      isArchived: false,
      isDemo: restaurantContentful.isDemo ?? false,
      hasAcceptedTerms: restaurantData.legal.hasAcceptedTerms,
    };

    if (existingRestaurant) {
      return this.restaurantsRepository.save({
        ...existingRestaurant,
        ...updatedRestaurantEntity,
      });
    }

    try {
      const newRestaurantUserFromFirestore = this.restaurantsRepository.create(
        updatedRestaurantEntity,
      );

      return this.restaurantsRepository.save(newRestaurantUserFromFirestore);
    } catch (error) {
      console.log('Could not create restaurant:', error);
    }
  }

  async syncFromContentful(restaurantId: string) {
    null;
  }

  async createRestaurant(restaurantId: string) {
    null;
  }

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
