import { ImageGallery } from "@/components/shared/ImageGallery";

interface EventGalleryProps {
  images: string[];
}

export function EventGallery({ images }: EventGalleryProps) {
  return <ImageGallery images={images.slice(0, 3)} title="Event Gallery" />;
}
