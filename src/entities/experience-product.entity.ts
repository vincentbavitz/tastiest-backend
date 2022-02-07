// export interface ExperienceProduct {
//   id: string;
//   name: string;
//   // dishName: string; // Appears in the "Do you know a better ..." section
//   image: Media;
//   tagline: string; // Experience the best porterhouse steak in London
//   allowedHeads: number[]; // eg [2,4,6] for Date Night
//   pricePerHeadGBP: number; // eg 29.95
//   additionalInfo: Document | null; // eg; PLUS 1 Mocktail each. In sidebar.
//   dynamicImage: Media | null; // .mp4 VP9 600x600, webm fallback.
//   restaurant: RestaurantContentful;
// }

// import { Column, PrimaryColumn } from 'typeorm';

// export default class Location {
//   /** ID comes from Contentful sync. */
//   @PrimaryColumn({ type: 'varchar', readonly: true })
//   id: string;

//   @Column('numeric', { nullable: true })
//   lon?: number;

//   @Column('varchar', { nullable: true })
//   address?: string;

//   @Column('varchar', { nullable: true })
//   postcode?: string;

//   /** Display location. Eg. '33 Mayfair - London' */
//   @Column('varchar', { nullable: true })
//   display?: string;
// }
