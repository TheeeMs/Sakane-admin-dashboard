interface ImageGalleryProps {
  images: string[];
  title?: string;
  columns?: 2 | 3 | 4;
  imageHeight?: string;
}

export function ImageGallery({
  images,
  title,
  columns = 3,
  imageHeight = "h-32",
}: ImageGalleryProps) {
  if (!images || images.length === 0) return null;

  const gridColsClass = {
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
  }[columns];

  return (
    <div>
      {title && (
        <h3 className="text-lg font-bold text-gray-900 mb-3">{title}</h3>
      )}
      <div className={`grid ${gridColsClass} gap-3`}>
        {images.map((image: string, index: number) => (
          <img
            key={index}
            src={image}
            alt={`Gallery ${index + 1}`}
            className={`w-full ${imageHeight} object-cover rounded-lg`}
          />
        ))}
      </div>
    </div>
  );
}
