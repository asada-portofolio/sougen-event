export interface ContactMessage {
  id: number;
  senderName: string;
  senderEmail: string;
  senderPhone: string | null;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface ContactChannel {
  id: number;
  type: string;
  label: string;
  value: string;
  url: string | null;
  isEmergencyContact: boolean;
  displayOrder: number;
}
