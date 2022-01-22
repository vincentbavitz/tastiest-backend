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
  OneToOne,
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
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar')
  token: string;

  @Column('varchar')
  userFacingOrderId: string;

  @OneToOne(() => UserEntity)
  @JoinColumn()
  user: UserEntity;

  @OneToOne(() => RestaurantEntity)
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

  @Column('timestamp')
  bookedFor: number;

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
