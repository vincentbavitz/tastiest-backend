import { Column } from 'typeorm';

/**
 * Note! We do not include .entity.ts on this file because it is
 * used only as a nested property.
 * We don't want TypeORM to make its own table for this entity.
 */
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
