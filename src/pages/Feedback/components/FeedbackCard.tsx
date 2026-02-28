import {
  ThumbsUp,
  ThumbsDown,
  Eye,
  MessageSquare,
  Trash2,
  MapPin,
  User,
} from "lucide-react";
import type { Feedback } from "../types";
import { FeedbackStatusBadge } from "./shared/FeedbackStatusBadge";
import { FeedbackCategoryBadge } from "./shared/FeedbackCategoryBadge";
import { formatDate } from "@/lib";

interface FeedbackCardProps {
  feedback: Feedback;
  onViewDetails: (feedback: Feedback) => void;
  onRespond: (feedback: Feedback) => void;
  onDelete: (feedback: Feedback) => void;
}

export function FeedbackCard({
  feedback,
  onViewDetails,
  onRespond,
  onDelete,
}: FeedbackCardProps) {
  const { upvotes = 0, downvotes = 0 } = feedback.votes;
  const netVotes = upvotes - downvotes;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex gap-6">
        {/* Vote Section */}
        <div className="flex flex-col items-center gap-2">
          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <ThumbsUp className="w-5 h-5 text-gray-600" />
          </button>
          <span className="text-lg font-bold text-gray-900">{netVotes}</span>
          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <ThumbsDown className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Content Section */}
        <div className="flex-1 space-y-4">
          {/* Header */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              {feedback.title}
            </h3>

            {/* Author Info */}
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
              <div className="flex items-center gap-1.5">
                <User className="w-4 h-4" />
                <span>{feedback.author.name}</span>
              </div>
              {feedback.author.unit && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />
                  <span>Unit {feedback.author.unit}</span>
                </div>
              )}
              <span className="text-gray-400">•</span>
              <span>{formatDate(feedback.createdAt)}</span>
            </div>

            {/* Badges */}
            <div className="flex gap-2 mb-3">
              <FeedbackCategoryBadge category={feedback.category} />
              <FeedbackStatusBadge
                status={feedback.status}
                isAnonymous={feedback.author.isAnonymous}
              />
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-700 leading-relaxed">
            {feedback.description}
          </p>

          {/* Admin Response */}
          {feedback.adminResponse && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <MessageSquare className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <p className="font-semibold text-blue-900">
                      {feedback.adminResponse.respondedBy}
                    </p>
                    <span className="text-sm text-blue-600">
                      {formatDate(feedback.adminResponse.respondedAt)}
                    </span>
                  </div>
                  <p className="text-blue-800 leading-relaxed">
                    {feedback.adminResponse.message}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => onViewDetails(feedback)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition-colors"
            >
              <Eye className="w-4 h-4" />
              View Details
            </button>
            <button
              onClick={() => onRespond(feedback)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-medium transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              Respond
            </button>
            <button
              onClick={() => onDelete(feedback)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-100 hover:bg-red-200 text-red-700 font-medium transition-colors ml-auto"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
