import { Column } from 'typeorm';

/**
 * Note! We do not include .entity.ts on this file because it is
 * used only as a nested property.
 * We don't want TypeORM to make its own table for this entity.
 */
export default class Contact {
  @Column('varchar', { name: 'first_name' })
  firstName: string;

  @Column('varchar', { name: 'last_name', nullable: true })
  lastName?: string;

  @Column('varchar', { name: 'email', nullable: true })
  email?: string;

  @Column('varchar', { name: 'phone_number', nullable: true })
  phoneNumber?: string;
}
