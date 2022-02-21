import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CmsApi,
  generateUserFacingId,
  Promo,
  UserRole,
} from '@tastiest-io/tastiest-utils';
import { AuthenticatedUser } from 'src/auth/auth.model';
import { OrderEntity } from 'src/orders/entities/order.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { DeepPartial, Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';

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
    private usersService: UsersService,
    private configService: ConfigService,
    @InjectRepository(OrderEntity)
    private ordersRepository: Repository<OrderEntity>,
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
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

    const token = uuid();
    const priceAfterPromo = this.calculatePromoPrice(
      subtotal,
      'promo' as any as Promo,
    );

    const { total: final, fees } = this.calculatePaymentFees(priceAfterPromo);

    const user: DeepPartial<UserEntity> = await this.usersService.getUser(uid);
    // const restaurant = deal.restaurant.id ? await this.

    this.ordersRepository;

    // Validate number of heads
    const order = this.ordersRepository.create({
      token,
      user,
      experience: experiencePost.deal,
      userFacingOrderId: generateUserFacingId(),
      heads: Math.floor(heads),
      price: {
        subtotal,
        fees,
        final,
        currency: 'GBP',
      },
      fromSlug: experiencePost.slug,
      createdAt: new Date(),
      bookedFor: new Date(bookedForTimestamp),
      isUserFollowing: false,
      isTest,
    });

    // Add to user's orders (automatically syncs to orders table)
    user.orders = [...(user.orders ?? []), order];
    await this.usersRepository.save(user);

    return order;
  }

  async getOrder(token: string, requestUser: AuthenticatedUser) {
    const order = await this.ordersRepository.findOne({ where: { token } });

    if (!order) {
      throw new NotFoundException();
    }

    // Only admins and verified users can access the order.
    if (
      !requestUser.roles.includes(UserRole.ADMIN) &&
      order.user.id !== requestUser.uid
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
