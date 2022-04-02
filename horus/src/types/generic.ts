export type Media = {
  title: string | null;
  description: string | null;
  url: string;
};

export type YouTubeVideo = {
  url: string;
  title: string | null;
};

export interface MetaDetails {
  title: string; // displayed in google search results
  description: string; // displayed in google search results
  image: Media; // og-image
}

export type StripeAccount = import('stripe').Stripe.Account;
export type Document = import('@contentful/rich-text-types').Document;
