import { Injectable } from '@nestjs/common';
import { FirebaseService } from 'src/firebase/firebase.service';

type CreateOrderOptionals = {
  userId?: string;
  anonymousId?: string;
  promoCode?: string;
  userAgent?: string;
};

@Injectable()
export class OrdersService {
  /**
   * @ignore
   */
  constructor(private readonly firebaseApp: FirebaseService) {}

  async createOrder(
    dealId: string,
    heads: number,
    fromSlug: string,
    bookedForTimestamp: number,
    { userId, anonymousId, promoCode, userAgent }: CreateOrderOptionals,
  ) {
    return null;
  }
}
