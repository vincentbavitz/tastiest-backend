import Stripe from 'stripe';
import { Column } from 'typeorm';

/**
 * Note! We do not include .entity.ts on this file because it is
 * used only as a nested property.
 * We don't want TypeORM to make its own table for this entity.
 */
export default class RestaurantFinancial {
  @Column('simple-json')
  stripeConnectAccount: Stripe.Account;

  /** As a decimal percentage */
  @Column('numeric', { default: 0.95 })
  restaurantCutFollowers: number;

  /** As a decimal percentage */
  @Column('numeric', { default: 0.9 })
  restaurantCutDefault: number;
}
