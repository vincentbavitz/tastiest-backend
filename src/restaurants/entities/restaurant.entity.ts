import { BaseEntity, Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { FollowerEntity } from '../entities/follower.entity';

@Entity('restaurant')
export class RestaurantEntity extends BaseEntity {
  /** From Firebase Auth */
  @PrimaryColumn({ type: 'varchar', readonly: true })
  id: string;

  @Column('varchar')
  name: string;

  @OneToMany(
    () => FollowerEntity,
    (follower: FollowerEntity) => follower.restaurant,
  )
  followers: FollowerEntity[];
}
