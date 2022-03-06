import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ExperiencePost,
  ExperienceProduct,
  Restaurant,
  RestaurantProfile,
} from '@prisma/client';
import { CmsApi, FirestoreCollection } from '@tastiest-io/tastiest-utils';
import { EntryCollection } from 'contentful';
import { FirebaseService } from 'src/firebase/firebase.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { SegmentWebhookBody } from './sync.model';

@Injectable()
export class SyncsService {
  private cms: CmsApi;

  /**
   * @ignore
   */
  constructor(
    private readonly firebaseApp: FirebaseService,
    private readonly configService: ConfigService,
    private prisma: PrismaService,
  ) {
    this.cms = new CmsApi(
      this.configService.get('CONTENTFUL_SPACE_ID'),
      this.configService.get('CONTENTFUL_ACCESS_TOKEN'),
      'production',
      this.configService.get('CONTENTFUL_ADMIN_TOKEN'),
    );
  }

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
    this.authorizeContentfulWebhook(body, headerSecretKey);

    // We're syncing a singular restaurant, not its embedded entries or assets.
    if (body.sys?.contentType?.sys?.id === 'restaurant') {
      // prettier-ignore
      const restaurantId: string = body.fields?.id?.['en-US'] ?? body.fields?.id;
      await this.nestedSyncParticularRestaurant(restaurantId);
      return { synced: [restaurantId] };
    }

    // If one of the nested properties changes, get its associated restaurant(s) and sync.
    const linkedEntries = await this.contentfulFetchLinkedEntries(
      body.sys.type,
      body.sys.id,
    );

    // Get the restaurantId for each linked item and sync them.
    const restaurantIds = linkedEntries?.items
      ?.filter((item) => item.sys.contentType.sys.id === 'restaurant')
      ?.map((item) => item.fields.id);

    await Promise.all(restaurantIds?.map(this.nestedSyncParticularRestaurant));

    return { synced: restaurantIds };
  }

  /**
   * This syncs both all experience posts and all experience products
   */
  async syncExperienceFromContentful(body: any, headerSecretKey: string) {
    this.authorizeContentfulWebhook(body, headerSecretKey);

    // We're syncing a singular experience post, not its embedded entries or assets.
    if (body.sys?.contentType?.sys?.id === 'post') {
      const slug: string = body.fields?.slug?.['en-US'] ?? body.fields?.slug;
      await this.nestedSyncParticularExperience(slug);
      return { synced: [slug] };
    }

    // If one of the nested properties changes, get its associated entries and sync.
    const linkedEntries = await this.contentfulFetchLinkedEntries(
      body.sys.type,
      body.sys.id,
    );

    // Get the postSlug for each linked item and sync them.
    const slugs = linkedEntries?.items
      ?.filter((item) => item.sys.contentType.sys.id === 'post')
      ?.map((item) => item.fields.id);

    await Promise.all(slugs?.map(this.nestedSyncParticularExperience));

    return { synced: slugs };
  }

  syncPromoCodeFromContentful(body: any) {
    null;
  }

  /**
   * We have a nested function so we can call when a restaurant syncs directly,
   * or when an embedded asset or entry that links to a restaurant changes;
   * thus we may be syncing one or more restaurants per call.
   */
  private async nestedSyncParticularRestaurant(restaurantId: string) {
    // We get the restaurant manually because the POST data doesn't
    // include all nested fields.
    const restaurant = await this.cms.getRestaurantById(restaurantId);

    const profile: Omit<RestaurantProfile, 'id'> = {
      restaurant_id: restaurantId,
      description: restaurant.description as any,
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

    return restaurantId;
  }

  /**
   * We have a nested function so we can call when an experience syncs or
   * its nested entries, assets or `product` syncs, all of them will be synced
   * correctly with our database.
   */
  private async nestedSyncParticularExperience(slug: string) {
    const post = await this.cms.getPostBySlug(slug);

    const updatedExperiencePost: ExperiencePost = {
      id: post.id,
      title: post.title,
      date: new Date(post.date),
      body: post.body as any,
      city: post.city,
      cuisine: post.cuisine,
      description: post.description,
      display_location: post.displayLocation,
      plate_image: post.plate,
      menu_image: post.menuImage ?? undefined,
      auxiliary_image: post.auxiliaryImage ?? undefined,
      see_restaurant_button: post.seeRestaurantButton,
      meta: post.meta as any,
      tags: post.tags,
      product_id: post.product.id,
      restaurant_id: post.product.restaurant.id,
      slug,
    };

    const updatedExperienceProduct: ExperienceProduct = {
      id: post.product.id,
      name: post.product.name,
      image: post.product.image,
      allowed_heads: post.product.allowedHeads,
      price: post.product.pricePerHeadGBP,
      restaurant_id: post.product.restaurant.id,
    };

    // Sync the corresponding ExperienceProduct
    // We sync this first so that product_id is valid
    // for new rows in the database.
    await this.prisma.experienceProduct.upsert({
      where: { id: post.product.id },
      update: updatedExperienceProduct,
      create: updatedExperienceProduct,
    });

    await this.prisma.experiencePost.upsert({
      where: { id: post.id },
      update: updatedExperiencePost,
      create: updatedExperiencePost,
    });

    return slug;
  }

  /**
   * Fetches all the linked children or parents of any given entry or asset.
   * Assumed to be used with top-level entries such that the entry ID is
   * body.sys.id from the Contentful webhook.
   */
  private async contentfulFetchLinkedEntries(
    bodySysType: string,
    bodySysId: string,
  ) {
    // We get the linked parents of the asset.
    let linkedEntries: EntryCollection<any>;

    if (bodySysType === 'Entry') {
      linkedEntries = await this.cms.client.getEntries({
        links_to_entry: bodySysId,
      });
    } else if (bodySysType === 'Asset') {
      linkedEntries = await this.cms.client.getEntries({
        links_to_asset: bodySysId,
      });
    } else {
      throw new BadRequestException('Entity or asset is invalid.');
    }

    return linkedEntries;
  }

  private authorizeContentfulWebhook(body: any, headerSecretKey: string) {
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

    return entityId;
  }
}
