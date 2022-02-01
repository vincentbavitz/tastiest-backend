import { Column } from 'typeorm';

export default class Location {
  @Column('numeric', { nullable: true })
  lat?: number;

  @Column('numeric', { nullable: true })
  lon?: number;

  @Column('varchar', { nullable: true })
  address?: string;

  @Column('varchar', { nullable: true })
  postcode?: string;

  /** Display location. Eg. '33 Mayfair - London' */
  @Column('varchar', { nullable: true })
  display?: string;
}
