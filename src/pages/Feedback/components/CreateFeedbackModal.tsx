import { useState } from "react";
import { Globe, Lock, Lightbulb, Send } from "lucide-react";
import {
  Modal,
  Input,
  Textarea,
  Select,
  FileUpload,
  Checkbox,
  ToggleGroup,
  PrimaryButton,
} from "@/components/shared";
import type { FeedbackCategory, FeedbackType } from "../types";

interface CreateFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FeedbackFormData) => void;
}

export interface FeedbackFormData {
  residentId: string;
  type: FeedbackType;
  title: string;
  category: FeedbackCategory;
  description: string;
  photos: File[];
  isAnonymous: boolean;
}

// Mock residents data - replace with actual data from your store/API
const residents = [
  { value: "1", label: "Ahmed Hassan - Unit A-101" },
  { value: "2", label: "Sara Mohamed - Unit B-205" },
  { value: "3", label: "Omar Ali - Unit C-304" },
  { value: "4", label: "Fatma Ibrahim - Unit D-402" },
];

const categories = [
  { value: "facilities", label: "Facilities" },
  { value: "services", label: "Services" },
  { value: "events", label: "Events" },
  { value: "maintenance", label: "Maintenance" },
  { value: "security", label: "Security" },
  { value: "other", label: "Other" },
];

export function CreateFeedbackModal({
  isOpen,
  onClose,
  onSubmit,
}: CreateFeedbackModalProps) {
  const [formData, setFormData] = useState<FeedbackFormData>({
    residentId: "",
    type: "public",
    title: "",
    category: "" as FeedbackCategory,
    description: "",
    photos: [],
    isAnonymous: false,
  });

  const handleSubmit = () => {
    onSubmit(formData);
    onClose();
    // Reset form
    setFormData({
      residentId: "",
      type: "public",
      title: "",
      category: "" as FeedbackCategory,
      description: "",
      photos: [],
      isAnonymous: false,
    });
  };

  const footer = (
    <>
      <button
        type="button"
        onClick={onClose}
        className="px-6 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition-colors"
      >
        Cancel
      </button>
      <PrimaryButton onClick={handleSubmit} icon={Send}>
        Publish Post
      </PrimaryButton>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Feedback"
      footer={footer}
      size="lg"
    >
      <div className="space-y-6">
        {/* Resident Selection */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
          <Select
            label="Submit On Behalf Of (Select Resident)"
            required
            value={formData.residentId}
            onChange={(e) =>
              setFormData({ ...formData, residentId: e.target.value })
            }
            options={residents}
            placeholder="Select a resident..."
          />
        </div>

        {/* Post Type */}
        <ToggleGroup
          label="Post Type"
          required
          value={formData.type}
          onChange={(value) =>
            setFormData({ ...formData, type: value as FeedbackType })
          }
          options={[
            { value: "public", label: "Public", icon: Globe },
            { value: "private", label: "Private", icon: Lock },
          ]}
        />

        {/* Title */}
        <Input
          label="Title"
          required
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Brief description"
        />

        {/* Category */}
        <Select
          label="Select Category"
          required
          value={formData.category}
          onChange={(e) =>
            setFormData({
              ...formData,
              category: e.target.value as FeedbackCategory,
            })
          }
          options={categories}
          placeholder="Choose a category..."
        />

        {/* Description */}
        <Textarea
          label="Detailed Description"
          required
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="Provide detailed information (color, size, distinguishing features)"
          rows={6}
        />

        {/* Photos */}
        <FileUpload
          label="Add Photos (optional)"
          onFilesChange={(files) => setFormData({ ...formData, photos: files })}
          multiple
        />

        {/* Anonymous Checkbox */}
        <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-4">
          <Checkbox
            label="Post anonymously"
            description="Your name will be hidden from other residents (Admin can still see who posted)"
            checked={formData.isAnonymous}
            onChange={(e) =>
              setFormData({ ...formData, isAnonymous: e.target.checked })
            }
          />
        </div>

        {/* Tips Box */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-base font-medium text-blue-900 mb-2">
                Tips for a great post
              </h4>
              <ul className="space-y-1 text-sm text-blue-800">
                <li>• Be clear and specific about your suggestion</li>
                <li>• Explain how it benefits the community</li>
                <li>• Add photos to make your post more engaging</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
