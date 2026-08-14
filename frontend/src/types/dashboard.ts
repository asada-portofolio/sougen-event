import type { AboutStats } from './about';
import type { ActiveEvent } from './event';
import type { ContactMessage } from './contact';

export interface DashboardData {
  activeEvent: ActiveEvent | null;
  stats: AboutStats;
  unreadMessagesCount: number;
  recentMessages: ContactMessage[];
}
