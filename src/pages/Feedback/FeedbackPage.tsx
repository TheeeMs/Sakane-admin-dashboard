import { useState } from "react";
import { MessageSquare, Clock, ThumbsUp, TrendingUp, Plus } from "lucide-react";
import { PrimaryButton, StatCard } from "@/components/shared";
import {
  FeedbackList,
  CreateFeedbackModal,
  type FeedbackFormData,
} from "./components";
import { feedbackData, calculateFeedbackStatistics } from "./data/feedbackData";
import type { Feedback } from "./types";

export function FeedbackPage() {
  const [feedbackList] = useState(feedbackData);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Calculate statistics
  const statistics = calculateFeedbackStatistics(feedbackList);

  // Handlers
  const handleViewDetails = (feedback: Feedback) => {
    console.log("View details:", feedback);
    // TODO: Open details modal
  };

  const handleRespond = (feedback: Feedback) => {
    console.log("Respond to:", feedback);
    // TODO: Open respond modal/form
  };

  const handleDelete = (feedback: Feedback) => {
    console.log("Delete:", feedback);
    // TODO: Show confirmation and delete
  };

  const handleCreateFeedback = () => {
    setIsCreateModalOpen(true);
  };

  const handleSubmitFeedback = (data: FeedbackFormData) => {
    console.log("New feedback submitted:", data);
    // TODO: Add feedback to the list
    // TODO: Call API to save feedback
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Resident Feedback
          </h1>
          <p className="text-gray-600 mt-1">
            Manage and respond to resident suggestions and feedback
          </p>
        </div>
        <PrimaryButton onClick={handleCreateFeedback} icon={Plus}>
          Create Feedback
        </PrimaryButton>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard
          icon={MessageSquare}
          label="Total Suggestions"
          value={statistics.total}
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
          gradient="bg-gradient-to-br from-blue-50 to-transparent"
          borderColor="border-blue-200"
        />
        <StatCard
          icon={Clock}
          label="Pending Review"
          value={statistics.pending}
          iconBg="bg-yellow-100"
          iconColor="text-yellow-600"
          gradient="bg-gradient-to-br from-yellow-50 to-transparent"
          borderColor="border-yellow-200"
        />
        <StatCard
          icon={ThumbsUp}
          label="Total Votes"
          value={statistics.totalVotes}
          iconBg="bg-green-100"
          iconColor="text-green-600"
          gradient="bg-gradient-to-br from-green-50 to-transparent"
          borderColor="border-green-200"
        />
        <StatCard
          icon={TrendingUp}
          label="Popular (20+ votes)"
          value={statistics.popular}
          iconBg="bg-purple-100"
          iconColor="text-purple-600"
          gradient="bg-gradient-to-br from-purple-50 to-transparent"
          borderColor="border-purple-200"
        />
      </div>

      {/* Feedback List with Tabs and Filters */}
      <FeedbackList
        feedbackList={feedbackList}
        onViewDetails={handleViewDetails}
        onRespond={handleRespond}
        onDelete={handleDelete}
      />

      {/* Create Feedback Modal */}
      <CreateFeedbackModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleSubmitFeedback}
      />
    </div>
  );
}
