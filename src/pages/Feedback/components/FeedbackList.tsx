import { useMemo } from "react";
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
  activeTab: FeedbackType;
  onTabChange: (tab: FeedbackType) => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter: FeedbackStatus | "ALL";
  onStatusChange: (value: FeedbackStatus | "ALL") => void;
  categoryFilter: FeedbackCategory | "ALL";
  onCategoryChange: (value: FeedbackCategory | "ALL") => void;
  statusOptions: string[];
  categoryOptions: string[];
  publicCount: number;
  privateCount: number;
  isLoading?: boolean;
}

export function FeedbackList({
  feedbackList,
  onViewDetails,
  onRespond,
  onDelete,
  activeTab,
  onTabChange,
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  categoryFilter,
  onCategoryChange,
  statusOptions,
  categoryOptions,
  publicCount,
  privateCount,
  isLoading = false,
}: FeedbackListProps) {
  const statusOptionsWithAll = useMemo(() => {
    const options = ["ALL", ...statusOptions];
    return Array.from(new Set(options));
  }, [statusOptions]);

  const categoryOptionsWithAll = useMemo(
    () => ["All Categories", ...categoryOptions],
    [categoryOptions],
  );

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => onTabChange("public")}
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
          onClick={() => onTabChange("private")}
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
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) =>
            onStatusChange(e.target.value as FeedbackStatus | "ALL")
          }
          className="px-4 py-3 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent cursor-pointer"
        >
          {statusOptionsWithAll.map((status) => (
            <option key={status} value={status}>
              {status === "ALL"
                ? "All Status"
                : status
                    .toLowerCase()
                    .replace(/_/g, " ")
                    .replace(/\b\w/g, (match) => match.toUpperCase())}
            </option>
          ))}
        </select>

        {/* Category Filter */}
        <select
          value={categoryFilter}
          onChange={(e) =>
            onCategoryChange(e.target.value as FeedbackCategory | "ALL")
          }
          className="px-4 py-3 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent cursor-pointer"
        >
          {categoryOptionsWithAll.map((category) => (
            <option
              key={category}
              value={category === "All Categories" ? "ALL" : category}
            >
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Feedback List */}
      {isLoading ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <p className="text-gray-500 text-lg">Loading feedback...</p>
        </div>
      ) : feedbackList.length > 0 ? (
        <div className="space-y-4">
          {feedbackList.map((feedback) => (
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
            statusFilter !== "ALL" ||
            categoryFilter !== "ALL") && (
            <button
              onClick={() => {
                onSearchChange("");
                onStatusChange("ALL");
                onCategoryChange("ALL");
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
