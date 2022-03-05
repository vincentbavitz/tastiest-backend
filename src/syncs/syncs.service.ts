import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Restaurant, RestaurantProfile } from '@prisma/client';
import { CmsApi, FirestoreCollection } from '@tastiest-io/tastiest-utils';
import { EntryCollection } from 'contentful';
import { FirebaseService } from 'src/firebase/firebase.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { SegmentWebhookBody } from './sync.model';

@Injectable()
export class SyncsService {
  /**
   * @ignore
   */
  constructor(
    private readonly firebaseApp: FirebaseService,
    private readonly configService: ConfigService,
    private prisma: PrismaService,
  ) {}

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

  /**
   * This function expects a webhook from the SyncsController coming from Contentful.
   * We use any Contentful update on a restaurant to sync with our database.
   */
  async syncRestaurantFromContentful(body: any, headerSecretKey: string) {
    // Authenticate with Contentful's POST secret key.
    // prettier-ignore
    if (headerSecretKey !== this.configService.get('CONTENTFUL_WEBHOOK_SECRET')) {
      throw new UnauthorizedException();
    }

    const environmentIsProduction =
      body.sys?.environment?.sys?.id === 'master' ||
      body.sys?.environment?.sys?.id === 'production';

    if (!environmentIsProduction) {
      throw new BadRequestException(
        'Only syncing the production environment is supported',
      );
    }

    const entityId = body.sys?.id;

    if (!entityId) {
      throw new BadRequestException('Invalid entity ID');
    }

    // Currently (as of 15/04/2021), Contentful Webhooks don't give us linked
    // assets in the response, so we must use these values to lookup the value
    // from their regular API before sending it off to Firestore.
    const cms = new CmsApi(
      this.configService.get('CONTENTFUL_SPACE_ID'),
      this.configService.get('CONTENTFUL_ACCESS_TOKEN'),
      'production',
      this.configService.get('CONTENTFUL_ADMIN_TOKEN'),
    );

    // List of synced restaurants
    const synced = [];

    // We have a nested function so we can call when a restaurant syncs directly,
    // or when an embedded asset or entry that links to a restaurant changes;
    // thus we may be syncing one or more restaurants per call.
    async function nestedSyncParticularRestaurant(
      restaurantId: string,
      prisma: PrismaService,
    ) {
      // We get the restaurant manually because the POST data doesn't
      // include all nested fields.
      const entries = await cms.client.getEntries({
        content_type: 'restaurant',
        'fields.id[in]': restaurantId,
        limit: 1,
        include: 10,
      });

      if (entries?.items.length === 0) {
        throw new BadRequestException(
          `No restaurant found with ID ${restaurantId}`,
        );
      }

      const restaurant = cms.convertRestaurant(entries.items[0]);

      const profile: Omit<RestaurantProfile, 'id'> = {
        restaurant_id: restaurantId,
        description: body.fields?.description?.['en-US'] as any,
        profile_picture: restaurant.profilePicture,
        public_phone_number: restaurant.publicPhoneNumber,
        display_photograph: restaurant.displayPhotograph,
        hero_illustration: restaurant.heroIllustration,
        backdrop_still_frame: restaurant.backdropStillFrame,
        backdrop_video: restaurant.backdropVideo,
        website: restaurant.website,
        meta: restaurant.meta as any,
      };

      const updatedRestaurant: Omit<
        Restaurant,
        | 'realtime_available_booking_slots'
        | 'realtime_last_slots_sync'
        | 'has_accepted_terms'
        | 'financial_connect_account'
        | 'financial_cut_default'
        | 'financial_cut_followers'
        | 'metrics_quiet_times'
        | 'metrics_open_times'
        | 'metrics_seating_duration'
        | 'settings_notify_bookings'
        | 'settings_fallback_open_times'
        | 'is_setup_complete'
      > = {
        id: restaurantId,
        name: restaurant.name,
        city: restaurant.city,
        cuisine: restaurant.cuisine,
        uri_name: restaurant.uriName,
        location_lat: restaurant.location?.lat,
        location_lon: restaurant.location?.lon,
        location_address: restaurant.location?.address,
        location_display: restaurant.location?.displayLocation,
        location_postcode: undefined,
        contact_first_name: restaurant.contact?.firstName,
        contact_last_name: restaurant.contact?.lastName,
        contact_email: restaurant.contact?.email,
        contact_phone_number: restaurant.contact?.mobile,
        booking_system: restaurant.bookingSystem,
        is_demo: restaurant.isDemo,
        is_archived: false,
      };

      await prisma.restaurant.upsert({
        where: { id: restaurantId },
        update: updatedRestaurant,
        create: updatedRestaurant,
      });

      // Create their corresponding profile
      await prisma.restaurantProfile.upsert({
        where: { restaurant_id: restaurantId },
        update: profile,
        create: profile,
      });

      synced.push(`${restaurantId}: ${restaurant.name}`);
    }

    // We're syncing a singular restaurant, not its embedded entries or assets.
    if (body.sys?.contentType?.sys?.id === 'restaurant') {
      const restaurantId = body.fields?.id?.['en-US'] ?? body.fields?.id;
      await nestedSyncParticularRestaurant(restaurantId, this.prisma);
      return synced;
    }

    // We must be syncing an asset or entity that has changed.
    // Make sure that this asset or entity links to one or more restaurants.
    // TDLR; if one of the nested properties changes, get its associated restaurant and sync.

    // We get the linked parents of the asset.
    let linkedEntries: EntryCollection<any>;
    if (body.sys.type === 'Entry') {
      linkedEntries = await cms.client.getEntries({
        links_to_entry: body.sys.id,
      });
    } else if (body.sys.type === 'Asset') {
      linkedEntries = await cms.client.getEntries({
        links_to_asset: body.sys.id,
      });
    } else {
      throw new BadRequestException('Entity or asset is invalid.');
    }

    // Get the restaurantId for each linked item and sync them.
    const restaurantIds = linkedEntries?.items
      ?.filter((item) => item.sys.contentType.sys.id === 'restaurant')
      ?.map((item) => item.fields.id);

    await Promise.all(
      restaurantIds?.map((id) =>
        nestedSyncParticularRestaurant(id, this.prisma),
      ),
    );

    return synced;
  }

  // // Currently (as of 15/04/2021), Contentful Webhooks don't give us linked
  // // assets in the response, so we must use these values to lookup the value
  // // from their regular API before sending it off to Firestore.
  // const cms = new CmsApi(
  //   this.configService.get('CONTENTFUL_SPACE_ID'),
  //   this.configService.get('CONTENTFUL_ACCESS_TOKEN'),
  //   'production',
  // );

  syncExperienceProductFromContentful(body: any) {
    null;
  }

  syncPromoCodeFromContentful(body: any) {
    null;
  }
}
