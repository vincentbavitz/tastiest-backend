import { Column } from 'typeorm';

/**
 * Note! We do not include .entity.ts on this file because it is
 * used only as a nested property.
 * We don't want TypeORM to make its own table for this entity.
 */
export default class RestaurantRealtime {
  /** An array of ISO Date strings */
  @Column('simple-array', { default: [] })
  availableBookingSlots: string[];

  @Column('timestamp with time zone', { nullable: true })
  lastBookingSlotsSync: Date;
}
