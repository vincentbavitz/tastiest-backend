import { Column } from 'typeorm';

/**
 * Note! We do not include .entity.ts on this file because it is
 * used only as a nested property.
 * We don't want TypeORM to make its own table for this entity.
 */
export default class Location {
  @Column('numeric', { name: 'lat', nullable: true })
  lat?: number;

  @Column('numeric', { name: 'lon', nullable: true })
  lon?: number;

  @Column('varchar', { name: 'address', nullable: true })
  address?: string;

  @Column('varchar', { name: 'postcode', nullable: true })
  postcode?: string;

  /** Display location. Eg. '33 Mayfair - London' */
  @Column('varchar', { name: 'display', nullable: true })
  display?: string;
}
