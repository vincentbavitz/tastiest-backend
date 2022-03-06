import {
  CurrencyValue,
  ExperienceProduct,
  OrderPrice,
  PaymentCardDetails,
  RefundDetails,
} from '@tastiest-io/tastiest-utils';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BookingEntity } from '../../bookings/entities/booking.entity';
import { RestaurantEntity } from '../../restaurants/entities/restaurant.entity';
import { UserEntity } from '../../users/entities/user.entity';

@Entity('order')
export class OrderEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar')
  token: string;

  @Column('varchar')
  userFacingOrderId: string;

  @ManyToOne(() => UserEntity, (user: UserEntity) => user.orders, {
    eager: true,
  })
  @JoinColumn()
  user: UserEntity;

  @Column('numeric')
  heads: number;

  @ManyToOne(() => RestaurantEntity)
  @JoinColumn()
  restaurant: RestaurantEntity;

  @OneToOne(() => BookingEntity)
  @JoinColumn()
  booking: BookingEntity;

  @Column('simple-json')
  experience: ExperienceProduct;

  @Column('simple-json')
  price: OrderPrice;

  @Column('simple-json', { nullable: true })
  refund: RefundDetails;

  @Column('timestamp with time zone')
  bookedFor: Date;

  @Column('varchar', { nullable: true })
  paymentMethod: string;

  @Column('simple-json', { nullable: true })
  paymentCard: PaymentCardDetails;

  @Column('varchar', { nullable: true })
  discountCode: string;

  @Column('varchar')
  fromSlug: string;

  @Column('timestamp with time zone', { nullable: true })
  paidAt: Date;

  @Column('timestamp with time zone', { nullable: true })
  createdAt: Date;

  @Column('timestamp with time zone', { nullable: true })
  abandonedAt: Date;

  @Column('simple-json', { nullable: true })
  tastiestPortion: CurrencyValue;

  @Column('simple-json', { nullable: true })
  restaurantPortion: CurrencyValue;

  @Column('boolean')
  isUserFollowing: boolean;

  @Column('boolean')
  isTest: boolean;
}