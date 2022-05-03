import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotAcceptableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Media, OrderPrice } from '@tastiest-io/tastiest-horus';
import { transformPriceForStripe } from '@tastiest-io/tastiest-utils';
import parsePhoneNumber from 'libphonenumber-js';
import { DateTime } from 'luxon';
import { firstValueFrom } from 'rxjs';
import { AuthenticatedUser } from 'src/auth/auth.model';
import { BookingsService } from 'src/bookings/bookings.service';
import {
  OrdersService,
  OrderWithUserAndRestaurant,
} from 'src/orders/orders.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { TrackingService } from 'src/tracking/tracking.service';
import Stripe from 'stripe';
import PayDto from './dto/pay.dto';

const ORDER_EXPIRY_MS = 60 * 60 * 1000;

/**
 * The list for SMS consented users in Klaviyo
 * @url https://www.klaviyo.com/list/RVkX6T/sms-consent
 */
const KLAVIYO_SMS_LIST_ID = 'RVkX6T';

@Injectable()
export class PaymentsService {
  private stripe: Stripe;

  /**
   * @ignore
   */
  constructor(
    private configService: ConfigService,
    private ordersService: OrdersService,
    private bookingsService: BookingsService,
    private trackingService: TrackingService,
    private prisma: PrismaService,
    private http: HttpService,
  ) {
    const STRIPE_SECRET_KEY = this.configService.get('STRIPE_SECRET_KEY');
    this.stripe = new Stripe(STRIPE_SECRET_KEY, {
      apiVersion: '2020-08-27',
    });
  }

  async pay(params: PayDto, requestUser: AuthenticatedUser) {
    const {
      token,
      payment_method: paymentMethodId,
      given_first_name: givenFirstName,
      given_last_name: givenLastName,
      mobile,
      birthday,
      postcode,
      user_agent: userAgent,
    } = params;

    // Get the order.
    const order = await this.ordersService.getOrder(token, requestUser);

    // Ensure payment method is valid
    const paymentMethod = await this.validatePaymentMethod(
      order,
      paymentMethodId,
    );

    // Is the order expired or paid?
    const isExpired = order.created_at.getTime() + ORDER_EXPIRY_MS < Date.now();
    if (order.paid_at || isExpired) {
      this.trackingService.track('Payment Error', {
        who: { userId: order.user_id },
        properties: {
          token,
          ...order,
          error: 'Order already paid or is expired',
        },
        context: { userAgent },
      });
    }

    // Get the follow-status of the user to the restaurant.
    const userFollowRelation = await this.prisma.followRelation.findFirst({
      where: { user_id: order.user_id, restaurant_id: order.restaurant_id },
    });

    const isUserFollowing = Boolean(userFollowRelation);

    // Confirm payment in Stripe
    // If this didn't succeed, an error is thrown and the function ends here.
    const { tastiestPortion, restaurantPortion } =
      await this.confirmStripePayment(order, paymentMethodId, isUserFollowing);

    // Update order information with payment info.
    await this.prisma.order.update({
      where: { id: order.id },
      data: {
        paid_at: new Date(),
        is_user_following: isUserFollowing,
        tastiest_portion: tastiestPortion,
        restaurant_portion: restaurantPortion,
        payment_card: {
          last4: paymentMethod.card.last4,
          brand: paymentMethod.card.brand,
        },
      },
    });

    // Parse user's phone number into E.164 Intl. format
    const mobileE164 = parsePhoneNumber(mobile, 'GB');

    console.log(
      'payments.service ➡️ order.user.settings_has_consented_sms:',
      order.user.settings_has_consented_sms,
    );

    // Consent to SMS if they haven't already
    let hasConsentedToSms = order.user.settings_has_consented_sms;
    if (!hasConsentedToSms) {
      const endpoint = `https://a.klaviyo.com/api/v2/list/${KLAVIYO_SMS_LIST_ID}/subscribe`;

      firstValueFrom(
        this.http.post(endpoint, {
          api_key: this.configService.get('KLAVIYO_SECRET_KEY'),
          profiles: [
            {
              email: order.user.email,
              $consent: ['sms'],
              phone_number: mobileE164.formatInternational(),
              sms_consent: true,
            },
          ],
        }),
      )
        .then(() => {
          hasConsentedToSms = true;
        })
        .catch((error) => {
          // FIX ME - Internal error reporting service
          console.log('payments.service ➡️ error:', error);
        });
    }

    // Track order completed
    await this.trackOrderCompletedEvent(
      order,
      givenFirstName,
      givenLastName,
      mobile,
      postcode,
      birthday,
      tastiestPortion,
      restaurantPortion,
      userAgent,
    );

    // Create a new corresponding booking
    const booking = await this.bookingsService.createBooking(order);

    // Update user information
    await this.prisma.user.update({
      where: { id: order.user_id },
      data: {
        first_name: givenFirstName,
        last_name: givenLastName,
        birthday: new Date(birthday),
        // FIX ME - We shouldn't assume that the user's postcode is the
        // same as their card's postcode.
        location_postcode: postcode,
        mobile: mobileE164.formatInternational(),
        settings_has_consented_sms: hasConsentedToSms,
      },
    });

    return booking;
  }

  /** Coming directly from Stripe. */
  async onPaymentSuccessWebhook(body: any, headers: any) {
    const orderId = body.data?.object?.metadata?.order_id;

    // A nicer way of doing things; typed event.
    // const event = this.stripe.webhooks.constructEvent(
    //   JSON.stringify(body),
    //   JSON.stringify(headers),
    //   'whsec_Q5Yqo73q6ycV2KsHoEnw1brCCc5q4p4w',
    // );

    // Development mode doesn't shoot off these webhooks.
    if (body.livemode === 'false') {
      return 'success; dev mode';
    }

    // Get the order
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { restaurant: true, user: true, booking: true },
    });

    console.log('payments.service ➡️ order:', order);

    // FIX ME -> Report internal error should be done from
    // tastiest-backend not tastiest-utils.
    if (!order) {
      this.trackingService.track('Stripe Payment Webhook Failed', {
        who: { anonymousId: 'INTERNAL_ERROR' },
        properties: {
          webhook: 'onPaymentSuccessWebhook',
          reason: 'Order not found. Was it deleted?',
          orderId,
        },
      });
    }

    this.trackingService.track('Payment Success', {
      who: { userId: order.user_id },
      properties: {
        ...order,
        booked_for_human_date: DateTime.fromJSDate(
          new Date(order.booked_for),
        ).toFormat('DDD'),
        paid_at_human_date: DateTime.fromJSDate(
          new Date(order.paid_at),
        ).toFormat('DDD'),
      },
    });

    // Send out email to restaurant that a new booking has been made.
    if ((!order.is_test && order.restaurant.settings_notify_bookings) ?? true) {
      this.trackingService.track('New Booking For Restaurant', {
        who: { userId: order.restaurant_id },
        properties: {
          ...order,
        },
      });
    }

    return 'success';
  }

  /** Pay through Stripe directly with an auto-confirming payment intent. */
  private async confirmStripePayment(
    order: OrderWithUserAndRestaurant,
    paymentMethodId: string,
    isUserFollowing: boolean,
  ) {
    // Get the portion of restaurant and Tastiest
    const restaurantPc = isUserFollowing
      ? order.restaurant.financial_cut_followers
      : order.restaurant.financial_cut_default;

    // prettier-ignore
    const restaurantPortion = (order.price as OrderPrice).subtotal * restaurantPc;

    // prettier-ignore
    const tastiestPortion = (order.price as OrderPrice).final - restaurantPortion;

    let paymentIntent: Stripe.PaymentIntent;

    try {
      paymentIntent = await this.stripe.paymentIntents.create({
        amount: transformPriceForStripe((order.price as OrderPrice).final),
        currency: 'gbp',
        customer: order.user.stripe_customer_id,
        payment_method: paymentMethodId,
        off_session: true,
        confirm: true,

        // Automatically transfer to the restaurant's Connected Account
        transfer_data: {
          amount: transformPriceForStripe(restaurantPortion),
          destination: Boolean(this.configService.get('IS_DEV'))
            ? this.configService.get('STRIPE_TEST_CONNECTED_ACCOUNT_ID')
            : order.restaurant.financial_connect_account_id,
        },
        // Used to manage Stripe Webhooks like `onPaymentSuccessWebhook`
        metadata: {
          order_id: order.id,
        },
      });
    } catch (error) {
      this.trackingService.track('Internal Payment Failure', {
        who: { anonymousId: 'INTERNAL_ERROR' },
        properties: { error },
      });

      // Card declined.
      throw new BadRequestException('Card declined');
    }

    // When 3D Secure is performed, we need to reconfirm the payment
    // after authentication has been performed.
    // Reference: https://stripe.com/docs/payments/accept-a-payment-synchronously#web-confirm-payment
    if (paymentIntent.status === 'requires_confirmation') {
      console.log('payments.service ➡️ test:', test);
      await this.stripe.paymentIntents.confirm(paymentIntent.id);
    }

    // NOTE FIX ME -> This should send an internal error
    if (paymentIntent.status !== 'succeeded') {
      const _error = 'Payment Failure - Unable to confirm payment';

      await this.trackingService.track('Payment Failure', {
        who: { userId: order.user_id },
        properties: {
          token: order.token,
          firstName: order.user.first_name,
          ...order,
          error: _error,
        },
      });

      throw new BadRequestException('Stripe payment failed');
    }

    return { restaurantPortion, tastiestPortion };
  }

  /**
   * Track using Segment's Payment Success schema
   * Don't send test orders to Pixel.
   * https://segment.com/docs/connections/spec/ecommerce/v2/#order-completed
   */
  private async trackOrderCompletedEvent(
    order: OrderWithUserAndRestaurant,
    givenFirstName: string,
    givenLastName: string,
    mobile: string,
    postcode: string,
    birthday: string,
    tastiestPortion: number,
    restaurantPortion: number,
    userAgent?: string,
  ) {
    const traits = {
      firstName: givenFirstName,
      lastName: givenLastName,
      email: order.user.email,
      phone: mobile.replace(/[\s]/g, '-'),
      birthday: JSON.stringify(birthday),
      postalCode: postcode,
      address: {
        city: 'London',
      },
    };

    // Identify user with the new information given
    await this.trackingService.identify({ userId: order.user_id }, traits);

    if (!order.is_test) {
      await this.trackingService.track('Order Completed', {
        who: { userId: order.user_id },
        context: {
          userAgent,
          page: {
            url: `https://tastiest.io/checkout/${order.token}`,
          },
        },
        integrations: {
          All: false,
          'Facebook Pixel': true,
          'Facebook Conversions API': true,
          'Google Analytics': true,
        },
        properties: {
          checkout_id: order.token,
          order_id: order.id,
          affiliation: '',
          total: (order.price as OrderPrice).final,
          subtotal: (order.price as OrderPrice).subtotal,
          revenue: tastiestPortion,
          shipping: 0,
          tax: 0,
          discount: 0,
          coupon: order.discount_code,
          currency: (order.price as OrderPrice).currency,
          products: [
            {
              product_id: order.product_id,
              sku: order.product_id,
              name: order.product_name,
              price: order.product_price,
              quantity: order.heads,
              category: '',
              image_url: (order.product_image as Media).url,
            },
          ],
          traits,

          // Internal measurements
          tastiestPortion,
          restaurantPortion,

          // For Pixel
          action_source: 'website',
        },
      });
    }
  }

  private async validatePaymentMethod(
    order: OrderWithUserAndRestaurant,
    paymentMethodId: string,
  ) {
    // Ensure it's a valid payment method that exists in Stripe.
    let paymentMethod: Stripe.PaymentMethod;

    try {
      paymentMethod = await this.stripe.paymentMethods.retrieve(
        paymentMethodId,
      );
    } catch (error) {
      // If this is throwing, are you trying to access LIVE order from DEV or vice-versa?
      throw new NotAcceptableException('Payment method does not exist.');
    }

    // User trying to use someone else's payment method?
    // We don't use paymentMethod.customer because this might not be set yet.
    if (order.user.email !== paymentMethod.billing_details.email) {
      throw new ForbiddenException();
    }

    return paymentMethod;
  }
}
