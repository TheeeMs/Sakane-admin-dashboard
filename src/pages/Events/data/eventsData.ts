import type { Event, EventStatistics } from '../types';

export const eventsData: Event[] = [
  {
    id: 'event-001',
    title: 'Community BBQ',
    description: 'Join us for a fun community BBQ with food, music, and great company!',
    imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&q=80',
    status: 'approved',
    category: 'social',
    organizer: {
      name: 'Ahmed Hassan',
      avatar: 'https://i.pravatar.cc/150?img=12',
      unit: 'Building A - Unit 205'
    },
    location: 'Rooftop Garden',
    startDate: '2024-03-15',
    startTime: '18:00',
    endTime: '22:00',
    capacity: 50,
    attendees: 38,
    tags: ['Food', 'Music', 'Outdoor'],
    createdAt: '2024-02-20T10:00:00Z',
    approvedBy: 'Admin',
    approvedAt: '2024-02-21T14:30:00Z'
  },
  {
    id: 'event-002',
    title: 'Swimming Pool Party',
    description: 'Beat the heat with a refreshing pool party. Family-friendly event with activities for all ages.',
    imageUrl: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=400&q=80',
    status: 'pending',
    category: 'sports',
    organizer: {
      name: 'Sarah Mohamed',
      avatar: 'https://i.pravatar.cc/150?img=5',
      unit: 'Building B - Unit 110'
    },
    location: 'Swimming Pool',
    startDate: '2024-03-20',
    startTime: '15:00',
    endTime: '19:00',
    capacity: 40,
    attendees: 0,
    tags: ['Swimming', 'Family', 'Summer'],
    createdAt: '2024-03-01T09:00:00Z'
  },
  {
    id: 'event-003',
    title: 'Morning Yoga Session',
    description: 'Start your day with mindfulness and stretching. All levels welcome.',
    imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&q=80',
    status: 'ongoing',
    category: 'health',
    organizer: {
      name: 'Layla Ibrahim',
      avatar: 'https://i.pravatar.cc/150?img=9',
      unit: 'Building C - Unit 301'
    },
    location: 'Fitness Center',
    startDate: '2024-03-10',
    endDate: '2024-03-31',
    startTime: '07:00',
    endTime: '08:00',
    capacity: 20,
    attendees: 15,
    tags: ['Yoga', 'Fitness', 'Wellness'],
    createdAt: '2024-02-15T08:00:00Z',
    approvedBy: 'Admin',
    approvedAt: '2024-02-16T10:00:00Z'
  },
  {
    id: 'event-004',
    title: 'Movie Night',
    description: 'Outdoor movie screening under the stars. Bring your blankets and enjoy!',
    imageUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&q=80',
    status: 'completed',
    category: 'entertainment',
    organizer: {
      name: 'Omar Khalil',
      avatar: 'https://i.pravatar.cc/150?img=33',
      unit: 'Building A - Unit 102'
    },
    location: 'Central Garden',
    startDate: '2024-03-05',
    startTime: '20:00',
    endTime: '23:00',
    capacity: 60,
    attendees: 52,
    tags: ['Cinema', 'Outdoor', 'Evening'],
    createdAt: '2024-02-10T12:00:00Z',
    approvedBy: 'Admin',
    approvedAt: '2024-02-11T09:00:00Z'
  },
  {
    id: 'event-005',
    title: 'Eid Festival',
    description: 'Celebrate Eid with the community! Traditional food, games, and activities for children.',
    imageUrl: 'https://images.unsplash.com/photo-1583037189850-1921ae7c6c22?w=400&q=80',
    status: 'approved',
    category: 'cultural',
    organizer: {
      name: 'Fatima Ali',
      avatar: 'https://i.pravatar.cc/150?img=20',
      unit: 'Building D - Unit 405'
    },
    location: 'Main Hall',
    startDate: '2024-04-10',
    startTime: '10:00',
    endTime: '16:00',
    capacity: 100,
    attendees: 0,
    tags: ['Eid', 'Cultural', 'Family'],
    createdAt: '2024-02-25T11:00:00Z',
    approvedBy: 'Admin',
    approvedAt: '2024-02-26T15:00:00Z'
  },
  {
    id: 'event-006',
    title: 'Kids Pool Party',
    description: 'Special pool party for children with games, snacks, and lifeguard supervision.',
    imageUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=400&q=80',
    status: 'rejected',
    category: 'social',
    organizer: {
      name: 'Mona Saeed',
      avatar: 'https://i.pravatar.cc/150?img=16',
      unit: 'Building B - Unit 208'
    },
    location: 'Kids Pool',
    startDate: '2024-03-18',
    startTime: '14:00',
    endTime: '17:00',
    capacity: 25,
    attendees: 0,
    tags: ['Kids', 'Swimming', 'Party'],
    createdAt: '2024-02-28T13:00:00Z',
    rejectionReason: 'Pool maintenance scheduled for that date'
  }
];

export const calculateEventStatistics = (events: Event[]): EventStatistics => {
  return {
    total: events.length,
    pending: events.filter(e => e.status === 'pending').length,
    approved: events.filter(e => e.status === 'approved').length,
    ongoing: events.filter(e => e.status === 'ongoing').length,
    completed: events.filter(e => e.status === 'completed').length,
    rejected: events.filter(e => e.status === 'rejected').length
  };
};
