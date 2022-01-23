import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user')
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  /** From Firebase Auth */
  // @Column('varchar', { nullable: true })
  // uid: string;

  @Column('varchar')
  name: string;

  @Column('varchar')
  tastiestFoods: string;
}
