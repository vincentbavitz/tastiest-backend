import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  CmsApi,
  FirestoreCollection,
  generateConfirmationCode,
  generateUserFacingId,
  Promo,
  UserRole,
} from '@tastiest-io/tastiest-utils';
import { AuthenticatedUser } from 'src/auth/auth.model';
import { FirebaseService } from 'src/firebase/firebase.service';
import { PrismaService } from 'src/prisma/prisma.service';

type CreateOrderOptionals = {
  promoCode?: string;
  userAgent?: string;
  isTest?: boolean;
};

@Injectable()
export class OrdersService {
  /**
   * @ignore
   */
  constructor(
    // private usersService: UsersService,
    private firebaseApp: FirebaseService,
    private configService: ConfigService,
    private prisma: PrismaService, // @InjectRepository(OrderEntity) // private ordersRepository: Repository<OrderEntity>,
  ) {}

  /**
   * Order is created only after the user signs in from the checkout page.
   * This ensures we have a valid user ID.
   */
  async createOrder(
    experienceProductId: string,
    uid: string,
    heads: number,
    bookedForTimestamp: number,
    { promoCode, userAgent, isTest = true }: CreateOrderOptionals,
  ) {
    // Sync deals and promos from Contentful with Webhooks so we can grab it from Postgres in 2ms
    const cms = new CmsApi(
      this.configService.get('CONTENTFUL_SPACE_ID'),
      this.configService.get('CONTENTFUL_ACCESS_TOKEN'),
    );

    const experiencePost = await cms.getPostByDealId(experienceProductId);

    if (!experiencePost) {
      throw new NotFoundException('Experience does not exist');
    }

    // Is userId valid and is user online?
    // Is promoCode valid? If so, calculate Promo and final price
    // const promo: Promo = await cms.getPromo(orderRequest.promoCode);
    // const promoIsValid = validatePromo(deal, orderRequest?.userId, promo);
    // if (promo?.validTo < Date.now()) {
    // Out of date
    // }

    // Validate deal and slug, validate that deal is still available
    //

    // Gross price
    const subtotal = experiencePost.deal.pricePerHeadGBP * heads;

    const priceAfterPromo = this.calculatePromoPrice(
      subtotal,
      'promo' as any as Promo,
    );

    const { total: final, fees } = this.calculatePaymentFees(priceAfterPromo);

    // Validate number of heads
    const order = await this.prisma.order.create({
      data: {
        user_id: uid,
        restaurant_id: experiencePost.restaurant.id,
        user_facing_id: generateUserFacingId(),
        heads: Math.floor(heads),
        price: JSON.stringify({
          subtotal,
          fees,
          final,
          currency: 'GBP',
        }),
        experience: JSON.stringify(experiencePost.deal),
        booked_for: new Date(bookedForTimestamp),
        from_slug: experiencePost.slug,
        is_user_following: false,
        is_test: isTest,
      },
    });

    const booking = await this.prisma.booking.create({
      data: {
        booked_for: new Date(bookedForTimestamp),
        confirmation_code: generateConfirmationCode(),
        restaurant_id: experiencePost.restaurant.id,
        order_id: order.id,
        user_id: uid,
      },
    });

    const restaurantSnapshot = await this.firebaseApp
      .firestore()
      .collection(FirestoreCollection.RESTAURANTS)
      .doc(experiencePost.restaurant.id)
      .get();

    const restaurant = restaurantSnapshot.data();

    await this.firebaseApp
      .firestore()
      .collection(FirestoreCollection.BOOKINGS)
      .add({
        confirmationCode: '0033',
        orderId: '190844b5-ae91-481d-a438-d85f8233d1aa',
        userId: uid,
        restaurant,
        hasArrived: false,
      });

    return order;
  }

  async getOrder(token: string, requestUser: AuthenticatedUser) {
    const order = await this.prisma.order.findUnique({
      where: { token },
      include: { restaurant: true },
    });

    if (!order) {
      throw new NotFoundException();
    }

    // Only admins and verified users can access the order.
    if (
      !requestUser.roles.includes(UserRole.ADMIN) &&
      order.user_id !== requestUser.uid
    ) {
      throw new UnauthorizedException(`This order doesn't belong to you.`);
    }

    return order;
  }

  /**
   * DELETE ME
   * Calculate price after applying promocode.
   */
  private calculatePromoPrice(price: number, promo: Promo) {
    if (!promo || !promo.discount?.value) {
      return price;
    }

    const isPercentage = promo?.discount?.unit === '%';

    if (isPercentage) {
      const discountGbp =
        price * (1 - Math.min(promo.discount.value, 100) / 100);
      return discountGbp;
    }

    return Math.max(0, price - promo?.discount?.value ?? 0);
  }

  /**
   * Calculate the payment processing fees to pass them onto the payer.
   * Fees taken from https://stripe.com/gb/pricing under non-European cards.
   *
   * We take the higher-fee structure because we can't predict in advance the card
   * being used when calculating the fees.
   *
   * We also take an extra 10p above the maximum card fee from Stripe (20 + 10 = 30p) to ensure that
   * internal transfers to Connect Accounts always succeeds (for when restaurant takes 100%).
   *
   * Assumes that all values are in GBP and that the given price parameter is
   * the price after promos, discounts and etc.
   */
  private calculatePaymentFees(price: number) {
    // 2.9 % + 0.30
    const PAYMENT_FEE_PERCENTAGE = 0.029;
    const PAYMENT_FEE_FLAT_RATE = 0.3;

    const fees = price * PAYMENT_FEE_PERCENTAGE + PAYMENT_FEE_FLAT_RATE;

    return {
      total: Number((price + fees).toFixed(2)),
      fees: Number(fees.toFixed(2)),
    };
  }
}
