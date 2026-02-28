import {
  Home,
  Users,
  Calendar,
  Wrench,
  Shield,
  HelpCircle,
} from "lucide-react";
import { IconBadge } from "@/components/shared";
import type { FeedbackCategory } from "../../types";

interface CategoryBadgeProps {
  category: FeedbackCategory;
}

export function FeedbackCategoryBadge({ category }: CategoryBadgeProps) {
  const categoryConfig = {
    facilities: {
      icon: Home,
      label: "Facilities",
      color: "text-blue-600",
    },
    services: {
      icon: Users,
      label: "Services",
      color: "text-teal-600",
    },
    events: {
      icon: Calendar,
      label: "Events",
      color: "text-purple-600",
    },
    maintenance: {
      icon: Wrench,
      label: "Maintenance",
      color: "text-orange-600",
    },
    security: {
      icon: Shield,
      label: "Security",
      color: "text-red-600",
    },
    other: {
      icon: HelpCircle,
      label: "Other",
      color: "text-gray-600",
    },
  };

  const config = categoryConfig[category];

  return (
    <IconBadge
      icon={config.icon}
      label={config.label}
      iconColor={config.color}
    />
  );
}
