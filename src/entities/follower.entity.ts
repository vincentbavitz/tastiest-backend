import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
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

  @ManyToOne(() => UserEntity, (user: UserEntity) => user.following, {
    eager: true,
  })
  @JoinColumn()
  user: UserEntity;

  @ManyToOne(
    () => RestaurantEntity,
    (restaurant: RestaurantEntity) => restaurant.followers,
    { eager: true },
  )
  @JoinColumn()
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
