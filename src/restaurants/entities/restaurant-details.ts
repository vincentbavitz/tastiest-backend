import { CuisineSymbol } from '@tastiest-io/tastiest-utils';
import Contact from 'src/entities/contact';
import { Column } from 'typeorm';
import Location from '../../entities/location';

/**
 * Note! We do not include .entity.ts on this file because it is
 * used only as a nested property.
 * We don't want TypeORM to make its own table for this entity.
 */
export default class RestaurantDetails {
  @Column('varchar')
  name: string;

  @Column('varchar')
  city: string;

  @Column('varchar')
  cuisine: CuisineSymbol;

  @Column(() => Location)
  location: Location;

  @Column(() => Contact)
  contact: Contact;

  // This is the name as it appears in the URL. Eg. tastiest.io/london/numa
  @Column('varchar')
  uriName: string;

  @Column('varchar', { nullable: true })
  bookingSystem: string;
}
