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
  };
  photos: GalleryPhoto[];
  nextCursor: number | null;
}
