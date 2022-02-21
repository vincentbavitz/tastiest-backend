import { Column } from 'typeorm';

/**
 * Note! We do not include .entity.ts on this file because it is
 * used only as a nested property.
 * We don't want TypeORM to make its own table for this entity.
 */
export default class RestaurantSettings {
  @Column('boolean')
  shouldNotifyNewBookings: boolean;

  /** If realtime data isn't available, should we fall-back to
   *  all-open times as being available, or not?
   *
   *  The consequence is that if you do not fall-back and your
   *  booking-system sync fails for some reason, no-one will
   *  be able to book.
   */
  @Column('boolean')
  shouldFallbackToOpenTimes: boolean;
}
