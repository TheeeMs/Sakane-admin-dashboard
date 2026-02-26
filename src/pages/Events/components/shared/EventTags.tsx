import { TagsList } from "@/components/shared/TagsList";

interface EventTagsProps {
  tags: string[];
}

export function EventTags({ tags }: EventTagsProps) {
  return <TagsList tags={tags} title="Tags" />;
}
