export interface ProgramPhoto {
  id: number;
  programId: number;
  imageUrlFull: string;
  imageUrlThumb: string;
  width: number;
  height: number;
  caption: string | null;
  displayOrder: number;
}

export interface Program {
  id: number;
  slug: string;
  name: string;
  category: string | null;
  description: string | null;
  rulesHtml: string | null;
  coverImageUrl: string | null;
  displayOrder: number;
  photos: ProgramPhoto[];
}
