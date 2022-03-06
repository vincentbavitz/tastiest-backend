import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';

@Entity('affiliate_submission')
export class AffiliateSubmissionEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar')
  platform: string;

  @Column('varchar')
  reference: string;

  @Column({ type: 'varchar', default: '' })
  affiliateType: string;

  @ManyToOne(() => UserEntity, { nullable: true, eager: true })
  @JoinColumn()
  user: UserEntity;
}