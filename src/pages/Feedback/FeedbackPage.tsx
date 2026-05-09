import { useEffect, useMemo, useState } from "react";
import { MessageSquare, Clock, ThumbsUp, TrendingUp, Plus } from "lucide-react";
import {
  Modal,
  PrimaryButton,
  Select,
  StatCard,
  Textarea,
} from "@/components/shared";
import {
  FeedbackList,
  CreateFeedbackModal,
  type FeedbackFormData,
} from "./components";
import { feedbackApi, type AdminFeedbackCardItemDto } from "./data/feedbackApi";
import { residentsApi } from "./data/residentsApi";
import type { Feedback, FeedbackStatistics, FeedbackStatus } from "./types";
import { FeedbackCategoryBadge } from "./components/shared/FeedbackCategoryBadge";
import { FeedbackStatusBadge } from "./components/shared/FeedbackStatusBadge";
import { formatDate } from "@/lib";

export function FeedbackPage() {
  const [feedbackList, setFeedbackList] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<FeedbackStatistics>({
    total: 0,
    pending: 0,
    totalVotes: 0,
    popular: 0,
  });
  const [categoryOptions, setCategoryOptions] = useState<string[]>([]);
  const [statusOptions, setStatusOptions] = useState<string[]>([]);
  const [tabCounts, setTabCounts] = useState({
    publicSuggestions: 0,
    privateFeedback: 0,
  });
  const [filters, setFilters] = useState({
    tab: "PUBLIC_SUGGESTIONS",
    search: "",
    status: "ALL",
    category: "ALL",
  });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [residentOptions, setResidentOptions] = useState<
    Array<{ value: string; label: string }>
  >([]);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [detailsFeedback, setDetailsFeedback] = useState<Feedback | null>(null);
  const [detailsRaw, setDetailsRaw] = useState<AdminFeedbackCardItemDto | null>(
    null,
  );
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [isRespondOpen, setIsRespondOpen] = useState(false);
  const [respondTarget, setRespondTarget] = useState<Feedback | null>(null);
  const [respondMessage, setRespondMessage] = useState("");
  const [respondStatus, setRespondStatus] =
    useState<FeedbackStatus>("UNDER_REVIEW");

  const defaultCategories = useMemo(
    () => [
      "Facilities",
      "Maintenance",
      "Security",
      "Events & Activities",
      "Services",
      "Other",
    ],
    [],
  );

  const effectiveCategories = categoryOptions.length
    ? categoryOptions
    : defaultCategories;

  const statistics = summary;

  const respondStatusOptions = useMemo(() => {
    const base = statusOptions.filter((status) => status !== "ALL");
    return base.length
      ? base
      : ["PENDING", "UNDER_REVIEW", "RESOLVED", "ARCHIVED"];
  }, [statusOptions]);

  const mapStatus = (raw?: string | null): FeedbackStatus => {
    const normalized = (raw || "").toUpperCase();
    switch (normalized) {
      case "UNDER_REVIEW":
        return "UNDER_REVIEW";
      case "RESOLVED":
        return "RESOLVED";
      case "ARCHIVED":
        return "ARCHIVED";
      case "PENDING":
      default:
        return "PENDING";
    }
  };

  const normalizeFeedback = (
    raw: AdminFeedbackCardItemDto,
    index: number,
    popularThreshold: number,
  ): Feedback => {
    const upvotes = raw.upvotes ?? 0;
    const downvotes = raw.downvotes ?? 0;
    const voteCount = raw.voteCount ?? upvotes + downvotes;
    const createdAt = raw.createdAt ?? new Date().toISOString();
    const adminResponse = raw.adminResponse?.trim();

    return {
      id: raw.feedbackId || `feedback-${index}`,
      title: raw.title ?? "Untitled Feedback",
      description: raw.content ?? "",
      author: {
        name: raw.authorName ?? "Resident",
        unit: raw.unitNumber ?? undefined,
        isAnonymous: Boolean(raw.isAnonymous),
      },
      category: (raw.category ?? "Other").trim() || "Other",
      status: mapStatus(raw.uiStatus || raw.workflowStatus),
      type: raw.isPublic ? "public" : "private",
      votes: {
        upvotes,
        downvotes,
      },
      createdAt,
      adminResponse: adminResponse
        ? {
            id: raw.feedbackId,
            respondedBy: "Admin Team",
            respondedAt: createdAt,
            message: adminResponse,
          }
        : undefined,
      isPopular: voteCount >= popularThreshold,
    };
  };

  const fetchDashboard = async (override?: Partial<typeof filters>) => {
    try {
      setLoading(true);
      const nextFilters = { ...filters, ...override };
      const params = {
        tab: nextFilters.tab,
        search: nextFilters.search || undefined,
        status: nextFilters.status === "ALL" ? undefined : nextFilters.status,
        category:
          nextFilters.category === "ALL" ? undefined : nextFilters.category,
        page: 0,
        size: 100,
      };

      const res = await feedbackApi.listFeedback(params);
      const threshold = res.data.summary?.popularThreshold ?? 20;
      const items = res.data.items || [];
      setFeedbackList(
        items.map((item, index) => normalizeFeedback(item, index, threshold)),
      );
      const summaryData = res.data.summary;
      if (summaryData) {
        setSummary({
          total: summaryData.totalSuggestions ?? 0,
          pending: summaryData.pendingReviewCount ?? 0,
          totalVotes: summaryData.totalVotes ?? 0,
          popular: summaryData.popularCount ?? 0,
        });
      } else {
        const totalVotes = items.reduce(
          (acc, item) => acc + (item.upvotes ?? 0) + (item.downvotes ?? 0),
          0,
        );
        setSummary({
          total: items.length,
          pending: items.filter(
            (item) =>
              mapStatus(item.uiStatus || item.workflowStatus) === "PENDING",
          ).length,
          totalVotes,
          popular: items.filter((item) => (item.voteCount ?? 0) >= threshold)
            .length,
        });
      }

      setTabCounts({
        publicSuggestions: res.data.tabs?.publicSuggestions ?? 0,
        privateFeedback: res.data.tabs?.privateFeedback ?? 0,
      });
    } catch (err) {
      console.error("Failed to fetch feedback", err);
      setFeedbackList([]);
      setSummary({
        total: 0,
        pending: 0,
        totalVotes: 0,
        popular: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchOptions = async () => {
    try {
      const [statusesRes, categoriesRes] = await Promise.all([
        feedbackApi.listStatuses(),
        feedbackApi.listCategories(),
      ]);
      setStatusOptions(statusesRes.data || []);
      setCategoryOptions(categoriesRes.data || []);
    } catch (err) {
      console.error("Failed to load feedback options", err);
      setStatusOptions([]);
      setCategoryOptions([]);
    }
  };

  const fetchResidents = async () => {
    try {
      const res = await residentsApi.listResidents({ page: 0, size: 100 });
      const options = (res.data.residents || []).map((resident) => {
        const name = resident.fullName?.trim() || "Resident";
        const building = resident.buildingName?.trim();
        const unit = resident.unitNumber?.trim();
        const suffix = [building, unit].filter(Boolean).join(" - ");
        return {
          value: resident.residentId,
          label: suffix ? `${name} (${suffix})` : name,
        };
      });
      setResidentOptions(options);
    } catch (err) {
      console.error("Failed to load residents", err);
      setResidentOptions([]);
    }
  };

  useEffect(() => {
    fetchDashboard();
    fetchOptions();
    fetchResidents();
  }, []);

  // Handlers
  const handleViewDetails = (feedback: Feedback) => {
    setIsDetailsOpen(true);
    setDetailsLoading(true);
    setDetailsFeedback(feedback);
    setDetailsRaw(null);

    feedbackApi
      .getFeedbackDetails(feedback.id)
      .then((res) => {
        const raw = res.data.feedback;
        setDetailsRaw(raw);
        setDetailsFeedback(normalizeFeedback(raw, 0, 20));
      })
      .catch((err) => {
        console.error("Failed to load feedback details", err);
      })
      .finally(() => setDetailsLoading(false));
  };

  const handleRespond = (feedback: Feedback) => {
    setRespondTarget(feedback);
    setRespondMessage("");
    setRespondStatus("UNDER_REVIEW");
    setIsRespondOpen(true);
  };

  const handleDelete = (feedback: Feedback) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this feedback?",
    );
    if (!confirmed) {
      return;
    }

    feedbackApi
      .deleteFeedback(feedback.id)
      .then(() => fetchDashboard())
      .catch((err) => {
        console.error("Failed to delete feedback", err);
      });
  };

  const handleCreateFeedback = () => {
    setIsCreateModalOpen(true);
  };

  const handleSubmitFeedback = (data: FeedbackFormData) => {
    feedbackApi
      .createFeedback({
        authorId: data.residentId || undefined,
        title: data.title,
        content: data.description,
        isPublic: data.type === "public",
        category: data.category,
        isAnonymous: data.isAnonymous,
      })
      .then(() => fetchDashboard())
      .catch((err) => {
        console.error("Failed to create feedback", err);
      });
  };

  const handleSubmitResponse = () => {
    if (!respondTarget) {
      return;
    }

    const trimmed = respondMessage.trim();
    if (!trimmed) {
      return;
    }

    feedbackApi
      .respondToFeedback(respondTarget.id, {
        response: trimmed,
        newStatus: respondStatus,
      })
      .then(() => {
        setIsRespondOpen(false);
        setRespondTarget(null);
        setRespondMessage("");
        fetchDashboard();
      })
      .catch((err) => {
        console.error("Failed to respond to feedback", err);
      });
  };

  const handleTabChange = (tab: "public" | "private") => {
    const tabValue =
      tab === "public" ? "PUBLIC_SUGGESTIONS" : "PRIVATE_FEEDBACK";
    setFilters((prev) => ({ ...prev, tab: tabValue }));
    fetchDashboard({ tab: tabValue });
  };

  const handleSearchChange = (value: string) => {
    setFilters((prev) => ({ ...prev, search: value }));
    fetchDashboard({ search: value });
  };

  const handleStatusChange = (value: FeedbackStatus | "ALL") => {
    setFilters((prev) => ({ ...prev, status: value }));
    fetchDashboard({ status: value });
  };

  const handleCategoryChange = (value: string | "ALL") => {
    setFilters((prev) => ({ ...prev, category: value }));
    fetchDashboard({ category: value });
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
        activeTab={filters.tab === "PUBLIC_SUGGESTIONS" ? "public" : "private"}
        onTabChange={handleTabChange}
        searchQuery={filters.search}
        onSearchChange={handleSearchChange}
        statusFilter={filters.status as FeedbackStatus | "ALL"}
        onStatusChange={handleStatusChange}
        categoryFilter={filters.category}
        onCategoryChange={handleCategoryChange}
        statusOptions={statusOptions}
        categoryOptions={effectiveCategories}
        publicCount={tabCounts.publicSuggestions}
        privateCount={tabCounts.privateFeedback}
        isLoading={loading}
      />

      {/* Create Feedback Modal */}
      <CreateFeedbackModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleSubmitFeedback}
        categories={effectiveCategories}
        residentOptions={residentOptions}
      />

      <Modal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        title="Feedback Details"
        size="lg"
      >
        {detailsLoading ? (
          <div className="py-6 text-gray-600">Loading details...</div>
        ) : detailsFeedback ? (
          <div className="space-y-5">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                {detailsFeedback.title}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {formatDate(detailsFeedback.createdAt)}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <FeedbackCategoryBadge category={detailsFeedback.category} />
              <FeedbackStatusBadge
                status={detailsFeedback.status}
                isAnonymous={detailsFeedback.author.isAnonymous}
              />
              <span className="text-sm text-gray-600">
                {detailsFeedback.type === "public" ? "Public" : "Private"}
              </span>
            </div>

            <div className="text-sm text-gray-700">
              <span className="font-medium">Author:</span>{" "}
              {detailsFeedback.author.name}
              {detailsFeedback.author.unit && (
                <span className="ml-2 text-gray-500">
                  Unit {detailsFeedback.author.unit}
                </span>
              )}
            </div>

            {detailsRaw?.location && (
              <div className="text-sm text-gray-700">
                <span className="font-medium">Location:</span>{" "}
                {detailsRaw.location}
              </div>
            )}

            <div className="text-sm text-gray-700">
              <span className="font-medium">Votes:</span>{" "}
              {detailsFeedback.votes.upvotes} up /{" "}
              {detailsFeedback.votes.downvotes} down
            </div>

            <div>
              <p className="text-gray-700 leading-relaxed">
                {detailsFeedback.description}
              </p>
            </div>

            {detailsFeedback.adminResponse && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm font-semibold text-blue-900 mb-2">
                  Admin Response
                </p>
                <p className="text-blue-800 leading-relaxed">
                  {detailsFeedback.adminResponse.message}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="py-6 text-gray-600">No details available.</div>
        )}
      </Modal>

      <Modal
        isOpen={isRespondOpen}
        onClose={() => setIsRespondOpen(false)}
        title="Respond to Feedback"
        size="md"
        footer={
          <>
            <button
              type="button"
              onClick={() => setIsRespondOpen(false)}
              className="px-6 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <PrimaryButton onClick={handleSubmitResponse} icon={MessageSquare}>
              Send Response
            </PrimaryButton>
          </>
        }
      >
        <div className="space-y-5">
          {respondTarget && (
            <div className="rounded-lg border border-gray-200 p-4">
              <p className="text-sm text-gray-500">Feedback</p>
              <p className="font-semibold text-gray-900">
                {respondTarget.title}
              </p>
            </div>
          )}

          <Textarea
            label="Response"
            required
            rows={6}
            value={respondMessage}
            onChange={(event) => setRespondMessage(event.target.value)}
            placeholder="Write your response to the resident"
          />

          <Select
            label="Update Status"
            value={respondStatus}
            onChange={(event) =>
              setRespondStatus(event.target.value as FeedbackStatus)
            }
            options={respondStatusOptions.map((status) => ({
              value: status,
              label: status
                .toLowerCase()
                .replace(/_/g, " ")
                .replace(/\b\w/g, (match) => match.toUpperCase()),
            }))}
          />
        </div>
      </Modal>
    </div>
  );
}
