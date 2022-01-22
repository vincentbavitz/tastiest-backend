import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrderEntity } from './order.entity';
import { RestaurantEntity } from './restaurant.entity';
import { UserEntity } from './user.entity';

@Entity('booking')
export class BookingEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar')
  userFacingBookingId: string;

  @OneToOne(() => OrderEntity)
  @JoinColumn()
  order: OrderEntity;

  @OneToOne(() => UserEntity)
  @JoinColumn()
  user: UserEntity;

  @OneToOne(() => RestaurantEntity)
  @JoinColumn()
  restaurant: RestaurantEntity;

  @Column('timestamp')
  bookedFor: number;

  @Column('varchar')
  confirmationCode: string;

  @Column('boolean')
  isConfirmationCodeVerified: boolean;

  @Column('boolean')
  hasArrived: boolean;

  @Column('boolean')
  hasCancelled: boolean;

  @Column('timestamp')
  cancelledAt: number;

  @Column('boolean')
  isSyncedWithBookingSystem: boolean;

  @Column('boolean')
  isTest: boolean;
}
