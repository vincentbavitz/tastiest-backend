import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WeekOpenTimes } from '@tastiest-io/tastiest-horus';
import {
  transformPriceFromStripe,
  UserRole,
} from '@tastiest-io/tastiest-utils';
import { AuthenticatedUser } from 'src/auth/auth.model';
import { PrismaService } from 'src/prisma/prisma.service';
import { TrackingService } from 'src/tracking/tracking.service';
import Stripe from 'stripe';

// const MS_IN_ONE_MINUTE = 60 * 1000;

@Injectable()
export class RestaurantsService {
  private stripe: Stripe;

  /**
   * @ignore
   */
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
    private trackingService: TrackingService,
  ) {
    const STRIPE_SECRET_KEY = this.configService.get('STRIPE_SECRET_KEY');
    this.stripe = new Stripe(STRIPE_SECRET_KEY, {
      apiVersion: '2020-08-27',
    });
  }

  async createRestaurant(restaurantId: string) {
    null;
  }

  async getRestaurant(restaurantId: string) {
    if (!restaurantId || !restaurantId?.length) {
      throw new NotAcceptableException('No restaurant ID given');
    }

    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id: restaurantId },
      include: { profile: true },
    });

    if (!restaurant) {
      throw new NotFoundException('Restaurant not found.');
    }

    return restaurant;
  }

  async getOpenTimes(restaurantId: string) {
    if (!restaurantId || !restaurantId?.length) {
      throw new NotAcceptableException('No restaurant ID given');
    }

    const openTimesData = await this.prisma.restaurant.findUnique({
      where: { id: restaurantId },
      select: { metrics_seating_duration: true, metrics_open_times: true },
    });

    return {
      open_times: openTimesData.metrics_open_times as WeekOpenTimes,
      seating_duration: openTimesData.metrics_seating_duration,
    };
  }

  async setOpenTimes(
    restaurantId: string,
    openTimes: WeekOpenTimes,
    user: AuthenticatedUser,
  ) {
    this.validateRestaurantOwnership(user, restaurantId);

    // Does this restaurant exist? (Will throw error if not)
    await this.getRestaurant(restaurantId);

    await this.prisma.restaurant.update({
      where: { id: restaurantId },
      data: { metrics_open_times: openTimes },
    });

    return 'su3ccess';
  }

  /**
   * Stripe Webhook: Restaurant Connected Acconut created or updated.
   */
  async updateConnectAccount(body: any) {
    const restaurantId = body.data?.object?.metadata?.restaurant_id;
    const connectId = body.data?.object?.id;

    // Get the restaurant
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id: restaurantId },
    });

    // FIX ME -> Report internal error should be done from
    // tastiest-backend not tastiest-utils.
    if (!restaurant || !connectId) {
      this.trackingService.track('Stripe Connect Webhook Failed', {
        who: { anonymousId: 'INTERNAL_ERROR' },
        properties: { webhook: 'onPaymentSuccessWebhook', restaurantId },
      });
    }

    // Update connect-account ID.
    await this.prisma.restaurant.update({
      where: { id: restaurantId },
      data: {
        financial_connect_account_id: connectId,
      },
    });

    return 'success';
  }

  /**
   * Gets restaurant's Stripe Connect Account balances.
   * Ordinarily, the parameter for `restaurant_id` comes from the Bearer token
   * Otherwise it's an administrator from a respective admin route.
   */
  async getBalances(restaurantId: string) {
    const { financial_connect_account_id: stripeAccount } =
      await this.prisma.restaurant.findUnique({
        where: { id: restaurantId },
        select: { financial_connect_account_id: true },
      });

    if (!stripeAccount) {
      throw new NotFoundException('Restaurant connect account not found');
    }

    let total = 0;
    let pending = 0;
    let available = 0;
    let balance: Stripe.Balance = null;

    const payouts = await this.stripe.payouts.list({
      stripeAccount: stripeAccount,
    });

    total = transformPriceFromStripe(
      payouts.data
        .filter((a) => a.currency === 'gbp')
        .reduce((a, b) => a + b?.amount ?? 0, 0),
    );

    try {
      balance = await this.stripe.balance.retrieve({
        stripeAccount,
      });
    } catch (error) {
      throw new InternalServerErrorException('Error fetching account balances');
    }

    pending = transformPriceFromStripe(
      balance?.pending
        .filter((a) => a.currency === 'gbp')
        .reduce((a, b) => a + b?.amount ?? 0, 0),
    );

    available = transformPriceFromStripe(
      balance?.available
        .filter((a) => a.currency === 'gbp')
        .reduce((a, b) => a + b?.amount ?? 0, 0),
    );

    return { total, pending, available };
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

  /**
   * Throws an error if the request is not coming from an Admin or the user
   * who owns the restaurant.
   */
  private validateRestaurantOwnership(
    user: AuthenticatedUser,
    restaurantId: string,
  ) {
    if (user.roles.includes(UserRole.ADMIN)) {
      return;
    }

    if (user.uid !== restaurantId) {
      throw new ForbiddenException();
    }
  }
}
