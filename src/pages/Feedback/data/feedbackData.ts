import type { Feedback, FeedbackStatistics } from "../types";

export const feedbackData: Feedback[] = [
  {
    id: "fb-001",
    title: "Add More Benches in the Garden Area",
    description:
      "It would be great to have more seating areas in the garden, especially near the children's playground. This would make it more comfortable for parents to supervise their kids.",
    author: {
      name: "Ahmed Hassan",
      unit: "Building A - Unit 205",
      isAnonymous: false,
    },
    category: "facilities",
    status: "pending",
    type: "public",
    votes: {
      upvotes: 22,
      downvotes: 0,
    },
    createdAt: "2024-02-09T10:00:00Z",
    isPopular: true,
  },
  {
    id: "fb-002",
    title: "Extended Gym Hours on Weekends",
    description:
      "Can we extend the gym operating hours on weekends? Currently it closes at 8 PM, but many residents work during the week and would benefit from later hours on Saturday and Sunday.",
    author: {
      name: "Sara Mohamed",
      unit: "Building B - Unit 320",
      isAnonymous: false,
    },
    category: "services",
    status: "under-review",
    type: "public",
    votes: {
      upvotes: 26,
      downvotes: 0,
    },
    createdAt: "2024-02-09T14:30:00Z",
    adminResponse: {
      id: "res-001",
      respondedBy: "Admin Team",
      respondedAt: "2024-02-10T09:00:00Z",
      message:
        "Thank you for your suggestion. We are currently discussing this with the facilities team and will announce any changes soon.",
    },
    isPopular: true,
  },
  {
    id: "fb-003",
    title: "Monthly Community Events",
    description:
      "I think it would be wonderful to organize monthly community events like movie nights, potlucks, or game tournaments. This would help residents get to know each other better.",
    author: {
      name: "Mohamed Ali",
      unit: "Building C - Unit 304",
      isAnonymous: false,
    },
    category: "events",
    status: "resolved",
    type: "public",
    votes: {
      upvotes: 42,
      downvotes: 0,
    },
    createdAt: "2024-02-08T16:00:00Z",
    adminResponse: {
      id: "res-002",
      respondedBy: "Admin Team",
      respondedAt: "2024-02-10T11:00:00Z",
      message:
        "Excellent idea! We're excited to announce that we'll be starting a monthly community event program starting next month. Check the Events section for details!",
    },
    isPopular: true,
  },
  {
    id: "fb-004",
    title: "Improve Pool Cleanliness",
    description:
      "The swimming pool often has leaves and debris floating in it. Perhaps we could increase the cleaning frequency or add a pool cover when not in use?",
    author: {
      name: "Layla Ibrahim",
      unit: "Building D - Unit 108",
      isAnonymous: false,
    },
    category: "facilities",
    status: "pending",
    type: "public",
    votes: {
      upvotes: 17,
      downvotes: 3,
    },
    createdAt: "2024-02-12T09:15:00Z",
    isPopular: false,
  },
  {
    id: "fb-005",
    title: "Security Concern at Parking Lot",
    description:
      "There have been reports of unauthorized vehicles in the residents parking area. Can we improve the access control system?",
    author: {
      name: "Anonymous",
      isAnonymous: true,
    },
    category: "security",
    status: "under-review",
    type: "private",
    votes: {
      upvotes: 0,
      downvotes: 0,
    },
    createdAt: "2024-02-11T20:30:00Z",
    adminResponse: {
      id: "res-003",
      respondedBy: "Admin Team",
      respondedAt: "2024-02-12T08:00:00Z",
      message:
        "Thank you for bringing this to our attention. We are reviewing the security footage and will implement additional measures immediately.",
    },
    isPopular: false,
  },
];

export const calculateFeedbackStatistics = (
  feedbacks: Feedback[],
): FeedbackStatistics => {
  const totalVotes = feedbacks.reduce(
    (sum, fb) => sum + fb.votes.upvotes + fb.votes.downvotes,
    0,
  );

  return {
    total: feedbacks.length,
    pending: feedbacks.filter((fb) => fb.status === "pending").length,
    totalVotes,
    popular: feedbacks.filter((fb) => fb.isPopular).length,
  };
};
