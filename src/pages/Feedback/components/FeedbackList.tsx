import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import type {
  Feedback,
  FeedbackType,
  FeedbackStatus,
  FeedbackCategory,
} from "../types";
import { FeedbackCard } from "./FeedbackCard";

interface FeedbackListProps {
  feedbackList: Feedback[];
  onViewDetails: (feedback: Feedback) => void;
  onRespond: (feedback: Feedback) => void;
  onDelete: (feedback: Feedback) => void;
}

export function FeedbackList({
  feedbackList,
  onViewDetails,
  onRespond,
  onDelete,
}: FeedbackListProps) {
  const [activeTab, setActiveTab] = useState<FeedbackType>("public");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<FeedbackStatus | "all">(
    "all",
  );
  const [categoryFilter, setCategoryFilter] = useState<
    FeedbackCategory | "all"
  >("all");

  // Filter feedback
  const filteredFeedback = useMemo(() => {
    return feedbackList.filter((feedback) => {
      // Tab filter
      if (feedback.type !== activeTab) return false;

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = feedback.title.toLowerCase().includes(query);
        const matchesDescription = feedback.description
          .toLowerCase()
          .includes(query);
        const matchesAuthor = feedback.author.name
          .toLowerCase()
          .includes(query);
        if (!matchesTitle && !matchesDescription && !matchesAuthor)
          return false;
      }

      // Status filter
      if (statusFilter !== "all" && feedback.status !== statusFilter)
        return false;

      // Category filter
      if (categoryFilter !== "all" && feedback.category !== categoryFilter)
        return false;

      return true;
    });
  }, [feedbackList, activeTab, searchQuery, statusFilter, categoryFilter]);

  // Count feedback by type
  const publicCount = feedbackList.filter((f) => f.type === "public").length;
  const privateCount = feedbackList.filter((f) => f.type === "private").length;

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("public")}
          className={`px-6 py-3 font-semibold transition-colors relative ${
            activeTab === "public"
              ? "text-teal-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Public Suggestions ({publicCount})
          {activeTab === "public" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-600" />
          )}
        </button>
        <button
          onClick={() => setActiveTab("private")}
          className={`px-6 py-3 font-semibold transition-colors relative ${
            activeTab === "private"
              ? "text-teal-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Private Feedback ({privateCount})
          {activeTab === "private" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-600" />
          )}
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search feedback..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value as FeedbackStatus | "all")
          }
          className="px-4 py-3 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent cursor-pointer"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="under-review">Under Review</option>
          <option value="resolved">Resolved</option>
          <option value="rejected">Rejected</option>
        </select>

        {/* Category Filter */}
        <select
          value={categoryFilter}
          onChange={(e) =>
            setCategoryFilter(e.target.value as FeedbackCategory | "all")
          }
          className="px-4 py-3 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent cursor-pointer"
        >
          <option value="all">All Categories</option>
          <option value="facilities">Facilities</option>
          <option value="services">Services</option>
          <option value="events">Events</option>
          <option value="maintenance">Maintenance</option>
          <option value="security">Security</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* Feedback List */}
      {filteredFeedback.length > 0 ? (
        <div className="space-y-4">
          {filteredFeedback.map((feedback) => (
            <FeedbackCard
              key={feedback.id}
              feedback={feedback}
              onViewDetails={onViewDetails}
              onRespond={onRespond}
              onDelete={onDelete}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <p className="text-gray-500 text-lg">No feedback found</p>
          {(searchQuery ||
            statusFilter !== "all" ||
            categoryFilter !== "all") && (
            <button
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("all");
                setCategoryFilter("all");
              }}
              className="mt-4 text-teal-600 hover:text-teal-700 font-medium"
            >
              Clear filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}
