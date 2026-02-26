interface TagsListProps {
  tags: string[];
  title?: string;
  maxDisplay?: number;
}

export function TagsList({
  tags,
  title,
  maxDisplay,
}: TagsListProps) {
  if (!tags || tags.length === 0) return null;

  const displayTags = maxDisplay ? tags.slice(0, maxDisplay) : tags;
  const remainingCount =
    maxDisplay && tags.length > maxDisplay ? tags.length - maxDisplay : 0;

  return (
    <div>
      {title && (
        <h3 className="text-lg font-bold text-gray-900 mb-3">{title}</h3>
      )}
      <div className="flex flex-wrap gap-2">
        {displayTags.map((tag: string, index: number) => (
          <span
            key={index}
            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
          >
            {tag}
          </span>
        ))}
        {remainingCount > 0 && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
            +{remainingCount}
          </span>
        )}
      </div>
    </div>
  );
}
