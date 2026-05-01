import { useEffect, useState } from "react";
import { Modal } from "@/components/shared/Modal/Modal";
import { Input } from "@/components/shared/FormInputs/Input";
import { Textarea } from "@/components/shared/FormInputs/Textarea";
import { Select } from "@/components/shared/FormInputs/Select";
import { Checkbox } from "@/components/shared/FormInputs/Checkbox";
import { PrimaryButton } from "@/components/shared/Buttons/PrimaryButton";

type CreateEventFormData = {
  title: string;
  description: string;
  location: string;
  date: string;
  time: string;
  duration: string;
  durationUnit: "HOUR" | "DAY";
  category: string;
  maxAttendees: string;
  imageUrl: string;
  hostName: string;
  hostRole: string;
  contactPhone: string;
  price: string;
  latitude: string;
  longitude: string;
  tags: string;
  recurringEvent: boolean;
};

export type CreateEventPayload = {
  title: string;
  description: string;
  location: string;
  date: string;
  time: string;
  duration?: number;
  durationUnit?: "HOUR" | "DAY";
  category?: string;
  maxAttendees?: number;
  imageUrl?: string;
  hostName?: string;
  hostRole?: string;
  contactPhone?: string;
  price?: number;
  latitude?: number;
  longitude?: number;
  tags?: string[];
  recurringEvent?: boolean;
};

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: string[];
  onSubmit: (payload: CreateEventPayload) => void;
  submitting?: boolean;
}

const emptyForm: CreateEventFormData = {
  title: "",
  description: "",
  location: "",
  date: "",
  time: "",
  duration: "",
  durationUnit: "HOUR",
  category: "",
  maxAttendees: "",
  imageUrl: "",
  hostName: "",
  hostRole: "",
  contactPhone: "",
  price: "",
  latitude: "",
  longitude: "",
  tags: "",
  recurringEvent: false,
};

const toNumber = (value: string): number | undefined => {
  if (!value.trim()) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

export function CreateEventModal({
  isOpen,
  onClose,
  categories,
  onSubmit,
  submitting,
}: CreateEventModalProps) {
  const [form, setForm] = useState<CreateEventFormData>(emptyForm);

  useEffect(() => {
    if (!isOpen) return;
    if (!form.category && categories.length > 0) {
      setForm((prev) => ({ ...prev, category: categories[0] }));
    }
  }, [isOpen, categories, form.category]);

  const updateField = <K extends keyof CreateEventFormData>(
    key: K,
    value: CreateEventFormData[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleClose = () => {
    setForm(emptyForm);
    onClose();
  };

  const handleSubmit = () => {
    if (
      !form.title.trim() ||
      !form.description.trim() ||
      !form.location.trim()
    ) {
      alert("Please fill in Title, Description, and Location.");
      return;
    }
    if (!form.date || !form.time) {
      alert("Please provide a date and time for the event.");
      return;
    }
    if (!form.category) {
      alert("Please select a category.");
      return;
    }

    const payload: CreateEventPayload = {
      title: form.title.trim(),
      description: form.description.trim(),
      location: form.location.trim(),
      date: form.date,
      time: form.time,
      duration: toNumber(form.duration),
      durationUnit: form.durationUnit,
      category: form.category || undefined,
      maxAttendees: toNumber(form.maxAttendees),
      imageUrl: form.imageUrl.trim() || undefined,
      hostName: form.hostName.trim() || undefined,
      hostRole: form.hostRole.trim() || undefined,
      contactPhone: form.contactPhone.trim() || undefined,
      price: toNumber(form.price),
      latitude: toNumber(form.latitude),
      longitude: toNumber(form.longitude),
      tags: form.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      recurringEvent: form.recurringEvent,
    };

    onSubmit(payload);
  };

  const footer = (
    <>
      <button
        type="button"
        onClick={handleClose}
        className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
      >
        Cancel
      </button>
      <PrimaryButton onClick={handleSubmit} disabled={submitting}>
        {submitting ? "Creating..." : "Create Event"}
      </PrimaryButton>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create Event"
      size="xl"
      footer={footer}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Title"
          required
          value={form.title}
          onChange={(e) => updateField("title", e.target.value)}
          placeholder="Event title"
        />
        <Input
          label="Location"
          required
          value={form.location}
          onChange={(e) => updateField("location", e.target.value)}
          placeholder="Event location"
        />
        <Input
          label="Date"
          type="date"
          required
          value={form.date}
          onChange={(e) => updateField("date", e.target.value)}
        />
        <Input
          label="Time"
          type="time"
          required
          value={form.time}
          onChange={(e) => updateField("time", e.target.value)}
        />
        <Input
          label="Duration"
          type="number"
          min={1}
          value={form.duration}
          onChange={(e) => updateField("duration", e.target.value)}
          placeholder="Duration"
        />
        <Select
          label="Duration Unit"
          value={form.durationUnit}
          onChange={(e) =>
            updateField("durationUnit", e.target.value as "HOUR" | "DAY")
          }
          options={[
            { value: "HOUR", label: "Hours" },
            { value: "DAY", label: "Days" },
          ]}
        />
        <Select
          label="Category"
          required
          value={form.category}
          onChange={(e) => updateField("category", e.target.value)}
          options={categories.map((category) => ({
            value: category,
            label: category,
          }))}
          placeholder="Select category"
        />
        <Input
          label="Max Attendees"
          type="number"
          min={0}
          value={form.maxAttendees}
          onChange={(e) => updateField("maxAttendees", e.target.value)}
          placeholder="0"
        />
        <Input
          label="Host Name"
          value={form.hostName}
          onChange={(e) => updateField("hostName", e.target.value)}
          placeholder="Organizer name"
        />
        <Input
          label="Host Role"
          value={form.hostRole}
          onChange={(e) => updateField("hostRole", e.target.value)}
          placeholder="Organizer role"
        />
        <Input
          label="Contact Phone"
          value={form.contactPhone}
          onChange={(e) => updateField("contactPhone", e.target.value)}
          placeholder="+201xxxxxxxxx"
        />
        <Input
          label="Price"
          type="number"
          min={0}
          value={form.price}
          onChange={(e) => updateField("price", e.target.value)}
          placeholder="0"
        />
        <Input
          label="Cover Image URL"
          value={form.imageUrl}
          onChange={(e) => updateField("imageUrl", e.target.value)}
          placeholder="https://"
        />
        <Input
          label="Latitude"
          type="number"
          value={form.latitude}
          onChange={(e) => updateField("latitude", e.target.value)}
        />
        <Input
          label="Longitude"
          type="number"
          value={form.longitude}
          onChange={(e) => updateField("longitude", e.target.value)}
        />
        <Input
          label="Tags"
          value={form.tags}
          onChange={(e) => updateField("tags", e.target.value)}
          placeholder="tag1, tag2"
        />
      </div>
      <div className="mt-4">
        <Textarea
          label="Description"
          required
          rows={4}
          value={form.description}
          onChange={(e) => updateField("description", e.target.value)}
          placeholder="Describe the event"
        />
      </div>
      <div className="mt-4">
        <Checkbox
          label="Recurring Event"
          description="Mark if this event repeats regularly."
          checked={form.recurringEvent}
          onChange={(e) => updateField("recurringEvent", e.target.checked)}
        />
      </div>
    </Modal>
  );
}
