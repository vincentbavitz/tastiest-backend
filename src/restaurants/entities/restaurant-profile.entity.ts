import { Document } from '@contentful/rich-text-types';
import { Media, MetaDetails } from '@tastiest-io/tastiest-utils';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

/**
 * The restaurant's profile is generally information from Contentful
 * that will appear on their display page at tastiest.io/[city]/[cuisine]/[restaurant].
 *
 * Note that this is intended to be readonly information and only updated from
 * the Contentful sync task.
 *
 * We sync with Contentful to avoid making duplicate requests for a single restaurant.
 * Note that this is an entity unto itself so that we can easily exclude it from the
 * restaurant entity, keeping response size small.
 */
@Entity('restaurant-profile')
export class RestaurantProfileEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar')
  website: string;

  @Column('varchar')
  publicPhoneNumber: string;

  @Column('simple-json')
  profilePicture: Media;

  @Column('simple-json')
  backdropVideo: Media;

  @Column('simple-json')
  backdropStillFrame: Media;

  @Column('simple-json')
  displayPhotograph: Media;

  @Column('simple-json')
  heroIllustration: Media;

  @Column('simple-json')
  description: Document;

  /** Page metadata */
  @Column('simple-json')
  meta: MetaDetails;
}
