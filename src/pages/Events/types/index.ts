export type EventStatus = 'pending' | 'approved' | 'ongoing' | 'completed' | 'rejected';
export type EventCategory = 'social' | 'sports' | 'health' | 'entertainment' | 'cultural' | 'education';

export interface Event {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  status: EventStatus;
  category: EventCategory;
  organizer: {
    name: string;
    avatar?: string;
    unit?: string;
  };
  location: string;
  startDate: string;
  endDate?: string;
  startTime: string;
  endTime?: string;
  capacity: number;
  attendees: number;
  tags: string[];
  createdAt: string;
  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string;
}

export interface EventStatistics {
  total: number;
  pending: number;
  approved: number;
  ongoing: number;
  completed: number;
  rejected: number;
}
