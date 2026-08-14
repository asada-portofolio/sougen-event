export interface AboutContent {
  id: number;
  storyText: string | null;
  storyImageUrl: string | null;
  visionText: string | null;
  missionList: string[]; // It's stored as Json in DB but mapped to string[] in API
}

export interface TeamMember {
  id: number;
  name: string;
  role: string;
  profileImageUrl: string | null;
  displayOrder: number;
}

export interface AboutStats {
  events: number;
  talents: number;
  communities: number;
}
