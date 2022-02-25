import { BookingEntity } from 'src/bookings/entities/booking.entity';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { FollowerEntity } from '../../entities/follower.entity';
import RestaurantDetails from './restaurant-details';
import RestaurantFinancial from './restaurant-financial';
import RestaurantMetrics from './restaurant-metrics';
import { RestaurantProfileEntity } from './restaurant-profile.entity';
import RestaurantRealtime from './restaurant-realtime';
import RestaurantSettings from './restaurant-settings';

@Entity('restaurant')
export class RestaurantEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  /** From Firebase Auth */
  @Column({ type: 'varchar', readonly: true })
  uid: string;

  @Column(() => RestaurantDetails)
  details: RestaurantDetails;

  @Column(() => RestaurantFinancial)
  financial: RestaurantFinancial;

  @Column(() => RestaurantMetrics)
  metrics: RestaurantMetrics;

  @Column(() => RestaurantSettings)
  settings: RestaurantSettings;

  @Column(() => RestaurantRealtime)
  realtime: RestaurantRealtime;

  @OneToOne(() => RestaurantProfileEntity, { eager: false })
  @JoinColumn()
  profile: RestaurantProfileEntity;

  @OneToMany(
    () => BookingEntity,
    (booking: BookingEntity) => booking.restaurant,
  )
  bookings: BookingEntity[];

  @OneToMany(
    () => FollowerEntity,
    (follower: FollowerEntity) => follower.restaurant,
  )
  followers: FollowerEntity[];

  /**
   * Setting up a restaurant takes many steps;
   * basic info, banking information, etc.
   * This parameter tells you whether or not the reastaurant
   * is fully setup and ready for production.
   */
  @Column('boolean', { default: false })
  isSetupComplete: boolean;

  @Column('boolean', { default: false })
  isArchived: boolean;

  @Column('boolean', { default: false })
  isDemo: boolean;

  @Column('boolean', { default: false })
  hasAcceptedTerms: boolean;
}
