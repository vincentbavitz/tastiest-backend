export type Media = {
  title: string | null;
  description: string | null;
  url: string;
};

export interface MetaDetails {
  title: string; // displayed in google search results
  description: string; // displayed in google search results
  image: Media; // og-image
}
