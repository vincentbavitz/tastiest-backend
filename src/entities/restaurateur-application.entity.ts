import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('restaurateur_application')
export class RestaurateurApplicationEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar')
  name: string;

  @Column('varchar')
  email: string;

  @Column('varchar')
  contactNumber: string;

  @Column('varchar')
  restaurantName: string;

  @Column('varchar')
  restaurantWebsite: string;

  @Column('varchar')
  restaurantAddress: string;

  @Column('varchar')
  description: string;
}

export default RestaurateurApplicationEntity;
