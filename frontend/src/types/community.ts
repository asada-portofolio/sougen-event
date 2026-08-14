export interface CommunityPhoto {
  id: number;
  communityId: number;
  imageUrlFull: string;
  imageUrlThumb: string;
  width: number;
  height: number;
  caption: string | null;
  displayOrder: number;
}

export interface Community {
  id: number;
  slug: string;
  name: string;
  category: string | null;
  establishedYear: number | null;
  instagramUrl: string | null;
  description: string | null;
  logoUrl: string | null;
  displayOrder: number;
  photos: CommunityPhoto[];
}
