import { WeekOpenTimes, WeekQuietTimes } from '@tastiest-io/tastiest-utils';
import { Column } from 'typeorm';

/**
 * Note! We do not include .entity.ts on this file because it is
 * used only as a nested property.
 * We don't want TypeORM to make its own table for this entity.
 */
export default class RestaurantMetrics {
  @Column('simple-json', { name: 'quiet_times', nullable: true })
  quietTimes: WeekQuietTimes;

  @Column('simple-json', { name: 'open_times', nullable: true })
  openTimes: WeekOpenTimes;

  /**
   * in minutes
   * We use this to be able to predict when a table
   * is open or over-booked
   */
  @Column('numeric', { name: 'seating_duration', nullable: true })
  seatingDuration: number;
}
