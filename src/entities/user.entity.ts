import {
  PaymentDetails,
  UserMetrics,
  UserPreferences,
} from '@tastiest-io/tastiest-utils';
import { BaseEntity, Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { BookingEntity } from './booking.entity';
import Location from './location';
import { OrderEntity } from './order.entity';

@Entity('user')
export class UserEntity extends BaseEntity {
  /** From Firebase Auth */
  @PrimaryColumn({ type: 'varchar', readonly: true })
  id: string;

  @Column({ type: 'varchar', unique: true })
  email: string;

  @Column('varchar')
  firstName: string;

  @Column('varchar', { nullable: true })
  lastName?: string;

  @Column('boolean')
  isTestAccount: boolean;

  @Column('timestamp with time zone', { nullable: true })
  lastActive?: string;

  @Column('varchar', { nullable: true })
  mobile?: string;

  @Column(() => Location)
  location: Location;

  @Column('date', { nullable: true })
  birthday?: Date;

  // TURN ALL OF THESE INTO DTOS
  @Column('simple-json')
  metrics: Partial<UserMetrics>;

  @Column('simple-json', { nullable: true })
  preferences?: Partial<UserPreferences>;

  @Column('simple-json', { nullable: true })
  financial?: Partial<PaymentDetails>;

  @OneToMany(() => OrderEntity, (order: OrderEntity) => order.user, {
    cascade: true,
  })
  orders: OrderEntity[];

  @OneToMany(() => BookingEntity, (booking) => booking.user, {
    cascade: true,
  })
  bookings: BookingEntity[];
}
