export interface GalleryPhoto {
  id: number;
  eventId: number;
  imageUrlFull: string;
  imageUrlThumb: string;
  width: number;
  height: number;
  caption: string | null;
  isCover: boolean;
  displayOrder: number;
}

export interface GalleryAlbum {
  id: number;
  slug: string;
  name: string;
  startDate: string; // ISO String
  endDate: string; // ISO String
  galleryPhotos: GalleryPhoto[];
  _count: {
    galleryPhotos: number;
  };
}

export interface GalleryDetailResponse {
  event: {
    id: number;
    name: string;
    slug: string;
    theme?: string | null;
    startDate?: string | null;
    endDate?: string | null;
    location?: string | null;
    googleDriveUrl?: string | null;
    posterImageUrl?: string | null;
    heroImageUrl?: string | null;
    _count?: {
      galleryPhotos: number;
    };
  };
  photos: GalleryPhoto[];
  nextCursor: number | null;
}
