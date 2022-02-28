import { CuisineSymbol, RestaurantRealtime } from '@tastiest-io/tastiest-utils';
import { BookingEntity } from 'src/bookings/entities/booking.entity';
import Contact from 'src/entities/contact';
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
import Location from '../../entities/location';
import RestaurantFinancial from './restaurant-financial';
import RestaurantMetrics from './restaurant-metrics';
import { RestaurantProfileEntity } from './restaurant-profile.entity';
import RestaurantSettings from './restaurant-settings';

@Entity('restaurant')
export class RestaurantEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  /** From Firebase Auth */
  @Column({ type: 'varchar' })
  uid: string;

  @Column('varchar')
  name: string;

  @Column('varchar')
  city: string;

  @Column('varchar')
  cuisine: CuisineSymbol;

  @Column(() => Location, { prefix: 'location_' })
  location: Location;

  @Column(() => Contact, { prefix: 'contact_' })
  contact: Contact;

  // This is the name as it appears in the URL. Eg. `numa` in tastiest.io/london/numa
  @Column('varchar', { name: 'uri_name' })
  uriName: string;

  @Column('varchar', { name: 'booking_system', nullable: true })
  bookingSystem: string;

  @Column(() => RestaurantFinancial, { prefix: 'financial_' })
  financial: RestaurantFinancial;

  @Column(() => RestaurantMetrics, { prefix: 'metrics_' })
  metrics: RestaurantMetrics;

  @Column(() => RestaurantSettings, { prefix: 'settings_' })
  settings: RestaurantSettings;

  @Column('simple-json', { nullable: true, default: null })
  realtime: RestaurantRealtime;

  @OneToOne(() => RestaurantProfileEntity, { eager: false, cascade: true })
  @JoinColumn()
  profile: RestaurantProfileEntity;

  @OneToMany(
    () => BookingEntity,
    (booking: BookingEntity) => booking.restaurant,
    { eager: false, cascade: true },
  )
  bookings: BookingEntity[];

  @OneToMany(
    () => FollowerEntity,
    (follower: FollowerEntity) => follower.restaurant,
    { eager: false, cascade: true },
  )
  followers: FollowerEntity[];

  /**
   * Setting up a restaurant takes many steps;
   * basic info, banking information, etc.
   * This parameter tells you whether or not the reastaurant
   * is fully setup and ready for production.
   */
  @Column('boolean', { name: 'is_setup_complete', default: false })
  isSetupComplete: boolean;

  @Column('boolean', { name: 'is_archived', default: false })
  isArchived: boolean;

  @Column('boolean', { name: 'is_demo', default: false })
  isDemo: boolean;

  @Column('boolean', { name: 'has_accepted_terms', default: false })
  hasAcceptedTerms: boolean;
}
