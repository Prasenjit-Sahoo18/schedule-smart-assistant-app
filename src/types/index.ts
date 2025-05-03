
export type CalendarViewType = 'month' | 'week' | 'day';

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  description?: string;
  category?: 'default' | 'work' | 'personal' | 'important';
  location?: string;
}

export interface AIAssistantMessage {
  id: string;
  content: string;
  timestamp: Date;
  isUser: boolean;
}
