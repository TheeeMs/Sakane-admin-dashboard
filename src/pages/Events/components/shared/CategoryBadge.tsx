import type { EventCategory } from "../../types";
import { getCategoryColor } from "../../utils/eventUtils";

interface CategoryBadgeProps {
  category: EventCategory;
}

export function CategoryBadge({ category }: CategoryBadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(category)}`}
    >
      {category.charAt(0).toUpperCase() + category.slice(1)}
    </span>
  );
}
