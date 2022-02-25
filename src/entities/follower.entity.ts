import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RestaurantEntity } from '../restaurants/entities/restaurant.entity';
import { UserEntity } from '../users/entities/user.entity';

// enum

// [FollowerNotificationType.LIMITED_TIME_DISHES]: true,
//         [FollowerNotificationType.SPECIAL_EXPERIENCES]: true,
//         [FollowerNotificationType.LAST_MINUTE_TABLES]: true,
//         [FollowerNotificationType.GENERAL_INFO]: true,
//         [FollowerNotificationType.NEW_MENU]: true,

@Entity('follower')
export class FollowerEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => UserEntity, {
    eager: true,
  })
  user: UserEntity;

  @ManyToOne(
    () => RestaurantEntity,
    (restaurant: RestaurantEntity) => restaurant.followers,
  )
  restaurant: RestaurantEntity;

  @Column('timestamp with time zone')
  followedAt: Date;

  @Column('boolean', { default: true })
  notifyNewMenu: boolean;

  @Column('boolean', { default: true })
  notifyGeneralInfo: boolean;

  @Column('boolean', { default: true })
  notifyLastMinuteTables: boolean;

  @Column('boolean', { default: true })
  notifyLimitedTimeDishes: boolean;

  @Column('boolean', { default: true })
  notifySpecialExperiences: boolean;
}
