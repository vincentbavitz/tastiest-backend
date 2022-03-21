import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Promo, UserRole } from '@tastiest-io/tastiest-utils';
import { AuthenticatedUser } from 'src/auth/auth.model';
import { PrismaService } from 'src/prisma/prisma.service';
import { OrderCreatedEvent } from './events/order-created.event';

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
    private eventEmitter: EventEmitter2,
    private prisma: PrismaService,
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
    console.log('orders.service ➡️ experienceProductId:', experienceProductId);

    // Grab post from our DB.
    // Note that our DB syncs posts from Contentful automatically.
    const experiencePost = await this.prisma.experiencePost.findUnique({
      where: { product_id: experienceProductId },
      include: { product: true, restaurant: true },
    });

    console.log('orders.service ➡️ experiencePost:', experiencePost);

    if (!experiencePost) {
      throw new NotFoundException('Experience does not exist');
    }

    // Is userId valid and is user online?
    // Is promoCode valid? If so, calculate Promo and final price

    // const promo: Promo = await cms.getPromo(orderRequest.promoCode);
    // const promoIsValid = validatePromo(product, orderRequest?.userId, promo);
    // if (promo?.validTo < Date.now()) {
    // Out of date
    // }

    // Validate product and slug, validate that product is still available

    // Gross price
    const subtotal = experiencePost.product.price * heads;

    const priceAfterPromo = this.calculatePromoPrice(
      subtotal,
      'promo' as any as Promo,
    );

    const { total: final, fees } = this.calculatePaymentFees(priceAfterPromo);

    // Validate number of heads
    // Creating with relations are done as such:
    // https://www.prisma.io/docs/concepts/components/prisma-client/relation-queries#connect-an-existing-record
    const order = await this.prisma.order.create({
      data: {
        user: { connect: { id: uid } },
        restaurant: { connect: { id: experiencePost.restaurant.id } },
        product: { connect: { id: experienceProductId } },
        user_facing_id: this.generateUserFacingId(),
        heads: Math.floor(heads),
        price: {
          subtotal,
          fees,
          final,
          currency: 'GBP',
        },
        booked_for: new Date(bookedForTimestamp),
        from_slug: experiencePost.slug,
        is_user_following: false,
        is_test: isTest,
      },
    });

    // Event handles Stripe user creation and etc.
    this.eventEmitter.emit(
      'order.created',
      new OrderCreatedEvent(order, userAgent),
    );

    return this.prisma.order.findUnique({
      where: { token: order.token },
      include: { restaurant: true },
    });
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

  /**
   * Generate user facing IDs.
   * For orders, bookings, products, etc.
   */
  private generateUserFacingId(length = 9): string {
    return Array(length)
      .fill(undefined)
      .map((_) => String(Math.floor(Math.random() * 10)))
      .join('');
  }
}
