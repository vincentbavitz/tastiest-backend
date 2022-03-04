import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Restaurant, RestaurantProfile } from '@prisma/client';
import {
  CmsApi,
  FirestoreCollection,
  RestaurantData,
  RestaurantRealtime,
} from '@tastiest-io/tastiest-utils';
import EmailSchedulingService from 'src/email/schedule/email-schedule.service';
import { FirebaseService } from 'src/firebase/firebase.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { TrackingService } from 'src/tracking/tracking.service';
import { UsersService } from 'src/users/users.service';
import RestaurantDetails from './entities/restaurant-details';
import RestaurantFinancial from './entities/restaurant-financial';
import RestaurantMetrics from './entities/restaurant-metrics';
import RestaurantSettings from './entities/restaurant-settings';

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
    private prisma: PrismaService,
  ) {}

  // FIX ME. TEMPORARY. SYNC FROM FIRESTORE
  async syncFromFirestore(restaurantId: string) {
    const restaurantDataSnapshot = await this.firebaseApp
      .db(FirestoreCollection.RESTAURANTS)
      .doc(restaurantId)
      .get();

    const restaurantData = restaurantDataSnapshot.data() as RestaurantData;

    const cms = new CmsApi(
      this.configService.get('CONTENTFUL_SPACE_ID'),
      this.configService.get('CONTENTFUL_ACCESS_TOKEN'),
    );

    const restaurantContentful = await cms.getRestaurantById(restaurantId);

    const details: RestaurantDetails = {
      name: restaurantData.details.name ?? '',
      city: restaurantData.details.city,
      cuisine: restaurantData.details.cuisine,
      uriName: restaurantData.details.uriName,
      bookingSystem: restaurantData.details?.bookingSystem,
      location: {
        lat: restaurantData.details.location?.lat,
        lon: restaurantData.details.location?.lon,
        address: restaurantData.details.location?.address,
        display: restaurantData.details.location?.displayLocation,
        postcode: undefined,
      },
      contact: {
        firstName: restaurantData.details.contact?.firstName ?? '',
        lastName: restaurantData.details.contact?.lastName ?? '',
        email: restaurantData.details.contact?.email ?? '',
        phoneNumber: restaurantData.details.contact?.mobile ?? '',
      },
    };

    // prettier-ignore
    const settings: RestaurantSettings = {
      fallbackOpenTimes: restaurantData.settings?.shouldFallbackToOpenTimes ?? true,
      notifyBookings: restaurantData.settings?.shouldNotifyNewBookings ?? true,
    };

    // prettier-ignore
    const financial: RestaurantFinancial = {
      stripeConnectAccount: restaurantData.financial?.stripeConnectedAccount ?? undefined,
      cutFollowers: restaurantData.financial?.commission?.followersRestaurantCut ?? undefined,
      cutDefault: restaurantData.financial?.commission?.defaultRestaurantCut ?? undefined,
    };

    const profile: Omit<RestaurantProfile, 'id'> = {
      description: restaurantData.profile.description as any,
      profile_picture: restaurantData.profile.profilePicture as any,
      public_phone_number: restaurantData.profile.publicPhoneNumber,
      display_photograph: restaurantData.profile.displayPhotograph,
      hero_illustration: restaurantData.profile.heroIllustration,
      backdrop_still_frame: restaurantData.profile.backdropStillFrame,
      backdrop_video: restaurantData.profile.backdropVideo,
      website: restaurantData.profile.website,
      meta: restaurantData.profile.meta as any,
      restaurant_id: restaurantId,
    };

    const metrics: RestaurantMetrics = {
      openTimes: restaurantData.metrics.openTimes,
      quietTimes: restaurantData.metrics.quietTimes,
      seatingDuration: restaurantData.metrics.seatingDuration,
    };

    const realtime: RestaurantRealtime = {
      availableBookingSlots: restaurantData.realtime?.availableBookingSlots,
      lastBookingSlotsSync: restaurantData.realtime?.lastBookingSlotsSync
        ? new Date(restaurantData.realtime.lastBookingSlotsSync)
        : null,
    };

    const updatedRestaurant: Restaurant = {
      id: restaurantId,
      name: details.name,
      city: details.city,
      cuisine: details.cuisine,
      uri_name: details.uriName,
      location_lat: details.location?.lat,
      location_lon: details.location?.lon,
      location_address: details.location?.address,
      location_postcode: details.location?.postcode,
      location_display: details.location?.display,
      contact_first_name: details.contact?.firstName,
      contact_last_name: details.contact?.lastName,
      contact_email: details.contact?.email,
      contact_phone_number: details.contact?.phoneNumber,
      realtime_available_booking_slots: realtime.availableBookingSlots,
      realtime_last_slots_sync: realtime.lastBookingSlotsSync,
      booking_system: details.bookingSystem,
      has_accepted_terms: restaurantData.legal?.hasAcceptedTerms ?? false,
      financial_connect_account: financial.stripeConnectAccount as any,
      financial_cut_followers: financial.cutFollowers,
      financial_cut_default: financial.cutDefault,
      metrics_quiet_times: metrics.quietTimes,
      metrics_open_times: metrics.openTimes,
      metrics_seating_duration: metrics.seatingDuration,
      settings_notify_bookings: settings.notifyBookings,
      settings_fallback_open_times: settings.fallbackOpenTimes,
      is_demo: restaurantContentful?.isDemo,
      is_archived: false,
      is_setup_complete: true,
    };

    await this.prisma.restaurant.upsert({
      where: { id: restaurantId },
      update: updatedRestaurant,
      create: updatedRestaurant,
    });

    // Create their corresponding profile
    await this.prisma.restaurantProfile.upsert({
      where: { restaurant_id: restaurantId },
      update: profile,
      create: profile,
    });
  }

  async syncFromContentful(restaurantId: string) {
    null;
  }

  async createRestaurant(restaurantId: string) {
    null;
  }

  // async scheduleFollowersEmail(data: NotifyDto) {
  //   const { token, restaurantId, templateId, subject, scheduleFor } = data;

  //   // Ensure the timing is valid
  //   // if (isBefore(scheduleFor, Date.now() + 5 * MS_IN_ONE_MINUTE)) {
  //   //   throw new BadRequestException(
  //   //     'Please schedule for at least 5 minutes in the future.',
  //   //   );
  //   // }

  //   // Receipients are all the restaurant's followers with notifications turned on.
  //   const restaurantDataApi =
  //     this.firebaseApp.getRestaurantDataApi(restaurantId);

  //   const restaurantData = await restaurantDataApi.getRestaurantData();
  //   const recipients = restaurantData.metrics.followers
  //     .filter((follower) => follower.notifications)
  //     .map((follower) => follower.email);

  //   dlog('restaurants.service ➡️ recipients:', recipients);

  //   // Get template and replace content's placeholders with real values.
  //   // Eg {{ firstName }} --> Daniel
  //   // TODO: Work out how to send a separate email to each follower with different content.
  //   const template = restaurantData.email?.templates?.[templateId] ?? null;
  //   if (!template) {
  //     throw new NotFoundException('Could not find template.');
  //   }

  //   if (!template.isApproved) {
  //     throw new BadRequestException('Template is not approved.');
  //   }

  //   const content = template.html;

  //   return this.emailSchedulingService.scheduleEmail({
  //     recipients,
  //     subject,
  //     content,
  //     date: new Date(scheduleFor).toUTCString(),
  //   });
  // }

  // async applyAsRestaurateur(
  //   applicationData: ApplyDto,
  //   user: AuthenticatedUser,
  // ) {
  //   const applicationEntity = this.applicationsRepository.create({
  //     ...applicationData,
  //   });

  //   await this.trackingService.track(
  //     'New Restaurateur Application',
  //     {
  //       userId: user?.uid,
  //     },
  //     applicationEntity,
  //   );

  //   const application = await this.applicationsRepository.save(
  //     applicationEntity,
  //   );

  //   return { ...application, id: undefined };
  // }
}
