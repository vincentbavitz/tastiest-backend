import { Address, UserMetrics } from '@tastiest-io/tastiest-utils';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

type AddressWithPostcode = Address & { postcode: string | null };

@Entity('user')
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  /** From Firebase Auth */
  @Column({ type: 'varchar', unique: true })
  uid: string;

  @Column({ type: 'varchar', unique: true })
  email: string;

  @Column('varchar')
  firstName: string;

  @Column('simple-json')
  metrics: UserMetrics;

  @Column('timestamp with time zone')
  lastActive: string;

  @Column('boolean')
  isTestAccount: boolean;

  @Column('varchar', { nullable: true })
  lastName?: string;

  @Column('varchar', { nullable: true })
  mobile?: string;

  @Column('simple-json', { nullable: true })
  address?: AddressWithPostcode;

  @Column('date', { nullable: true })
  birthday?: Date;
}
