import Stripe from 'stripe';
import { Column } from 'typeorm';

/**
 * Note! We do not include .entity.ts on this file because it is
 * used only as a nested property.
 * We don't want TypeORM to make its own table for this entity.
 */
export default class RestaurantFinancial {
  @Column('simple-json', {
    name: 'connect_account',
    nullable: true,
    default: null,
  })
  stripeConnectAccount: Stripe.Account;

  /**
   * The restaurant's cut as a decimal percentage.
   * Eg. 0.95 means the restaurant gets a 95% for each
   * order, given the customer is a follower of theirs.
   */
  @Column('numeric', {
    name: 'cut_followers',
    nullable: true,
    default: 0.95,
  })
  cutFollowers: number;

  /**
   * The restaurant's cut as a decimal percentage.
   * Eg. 0.90 means the restaurant gets a 90% for each
   * order, where the customer is not a follower of theirs.
   */
  @Column('numeric', { name: 'cut_default', nullable: true, default: 0.9 })
  cutDefault: number;
}
