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

  @Column('varchar', { nullable: true })
  website: string;

  @Column('varchar', { name: 'public_phone_number', nullable: true })
  publicPhoneNumber: string;

  @Column('simple-json', { name: 'profile_picture', nullable: true })
  profilePicture: Media;

  @Column('simple-json', { name: 'backdrop_video', nullable: true })
  backdropVideo: Media;

  @Column('simple-json', { name: 'backdrop_still_frame', nullable: true })
  backdropStillFrame: Media;

  @Column('simple-json', { name: 'display_photograph', nullable: true })
  displayPhotograph: Media;

  @Column('simple-json', { name: 'hero_illustration', nullable: true })
  heroIllustration: Media;

  @Column('simple-json', { nullable: true })
  description: Document;

  /** Page metadata */
  @Column('simple-json', { nullable: true })
  meta: MetaDetails;
}
