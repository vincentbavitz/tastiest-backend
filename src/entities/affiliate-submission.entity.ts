import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('affiliate_submission')
export class AffiliateSubmissionEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar')
  platform: string;

  @Column('varchar')
  reference: string;

  @OneToOne(() => UserEntity, { nullable: true })
  @JoinColumn()
  user: UserEntity;
}
