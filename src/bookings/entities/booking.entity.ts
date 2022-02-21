import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrderEntity } from '../../orders/entities/order.entity';
import { RestaurantEntity } from '../../restaurants/entities/restaurant.entity';
import { UserEntity } from '../../users/entities/user.entity';

@Entity('booking')
export class BookingEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar')
  userFacingBookingId: string;

  @OneToOne(() => OrderEntity)
  @JoinColumn()
  order: OrderEntity;

  @ManyToOne(() => UserEntity, (user: UserEntity) => user.bookings, {
    eager: true,
  })
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
