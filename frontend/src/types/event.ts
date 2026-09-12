export type HeroMode = 'TEMPLATE' | 'POSTER';
import type { Program } from './program';

export interface GalleryPhoto {
  imageUrlThumb: string | null;
}

export interface Talent {
  id: number;
  stageName: string;
  bio: string | null;
  profileImageUrl: string | null;
  instagramUrl: string | null;
  followerCount: number | null;
  postCount: number | null;
}

export interface EventTalent {
  id: number;
  eventId: number;
  talentId: number;
  role: 'GUEST' | 'PERFORMER';
  performOrder: number | null;
  performTime: string | null;
  displayOrder: number;
  talent: Talent;
}


export interface EventProgram {
  id: number;
  eventId: number;
  programId: number;
  displayOrder: number;
  registrationUrl?: string | null;
  program: Program;
}

export interface RundownItem {
  id: number;
  eventDayId: number;
  time: string;
  activityName: string;
  location: string | null;
  displayOrder: number;
}

export interface EventDay {
  id: number;
  eventId: number;
  dayNumber: number;
  date: string;
  locationOverride: string | null;
  rundownItems: RundownItem[];
}

export interface ActiveEvent {
  id: number;
  slug: string;
  name: string;
  theme: string | null;
  startDate: string;
  endDate: string;
  location: string;
  heroMode: HeroMode;
  heroImageUrl: string | null;
  posterImageUrl: string | null;
  registrationUrl: string | null;
  googleDriveUrl: string | null;
  isActive: boolean;
  eventDays: EventDay[];
  eventTalents: EventTalent[];
  eventPrograms: EventProgram[];
  galleryPhotos: GalleryPhoto[];
}

export type EventDetailData = ActiveEvent;

export interface EventSummary {
  id: number;
  slug: string;
  name: string;
  theme: string | null;
  startDate: string;
  endDate: string;
  location: string;
  posterImageUrl: string | null;
  isActive: boolean;
  galleryPhotos: GalleryPhoto[];
}
