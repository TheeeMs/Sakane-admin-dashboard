import { InfoItem } from "@/components/shared/InfoItem";
import type { LucideIcon } from "lucide-react";

interface EventInfoItemProps {
  icon: LucideIcon;
  label: string;
  value: string;
  iconBg: string;
  iconColor: string;
}

export function EventInfoItem(props: EventInfoItemProps) {
  return <InfoItem {...props} />;
}
