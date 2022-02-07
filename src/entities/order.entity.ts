import {
  Currency,
  ExperienceProduct,
  OrderPrice,
} from '@tastiest-io/tastiest-utils';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BookingEntity } from './booking.entity';
import { RestaurantEntity } from './restaurant.entity';
import { UserEntity } from './user.entity';

type PaymentCardDetails = {
  brand: string;
  last4: string;
};

type CurrencyValue = {
  amount: number;
  currency: Currency;
};

type RefundDetails = CurrencyValue & {
  refundedAt: number;
};

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

  @ManyToOne(() => BookingEntity)
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

  @Column('timestamp', { nullable: true })
  paidAt: number;

  @Column('timestamp', { nullable: true })
  createdAt: number;

  @Column('timestamp', { nullable: true })
  abandonedAt: number;

  @Column('simple-json', { nullable: true })
  tastiestPortion: CurrencyValue;

  @Column('simple-json', { nullable: true })
  restaurantPortion: CurrencyValue;

  @Column('boolean')
  isUserFollowing: boolean;

  @Column('boolean')
  isTest: boolean;
}
