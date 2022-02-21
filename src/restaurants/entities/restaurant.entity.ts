import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryColumn,
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
  /** From Firebase Auth */
  @PrimaryColumn({ type: 'varchar', readonly: true })
  id: string;

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
    () => FollowerEntity,
    (follower: FollowerEntity) => follower.restaurant,
  )
  followers: FollowerEntity[];

  @Column('boolean', { default: false })
  isArchived: boolean;

  @Column('boolean', { default: false })
  isDemo: boolean;

  @Column('boolean', { default: false })
  hasAcceptedTerms: boolean;
}
