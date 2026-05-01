export type FeedbackStatus =
  | "PENDING"
  | "UNDER_REVIEW"
  | "RESOLVED"
  | "ARCHIVED";
export type FeedbackCategory = string;
export type FeedbackType = "public" | "private";

export interface FeedbackVotes {
  upvotes: number;
  downvotes: number;
}

export interface AdminResponse {
  id: string;
  respondedBy: string;
  respondedAt?: string;
  message: string;
}

export interface Feedback {
  id: string;
  title: string;
  description: string;
  author: {
    name: string;
    unit?: string;
    isAnonymous: boolean;
  };
  category: FeedbackCategory;
  status: FeedbackStatus;
  type: FeedbackType;
  votes: FeedbackVotes;
  createdAt: string;
  adminResponse?: AdminResponse;
  isPopular: boolean;
}

export interface FeedbackStatistics {
  total: number;
  pending: number;
  totalVotes: number;
  popular: number;
}
