import { Column } from 'typeorm';

/**
 * Note! We do not include .entity.ts on this file because it is
 * used only as a nested property.
 * We don't want TypeORM to make its own table for this entity.
 */
export default class Contact {
  @Column('varchar')
  firstName: string;

  @Column('varchar', { nullable: true })
  lastName?: string;

  @Column('varchar', { nullable: true })
  email?: string;

  @Column('varchar', { nullable: true })
  phoneNumber?: string;
}
