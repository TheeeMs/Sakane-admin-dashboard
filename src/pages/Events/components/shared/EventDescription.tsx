interface EventDescriptionProps {
  description: string;
}

export function EventDescription({ description }: EventDescriptionProps) {
  return (
    <div>
      <h3 className="text-lg font-bold text-gray-900 mb-3">
        Event Description
      </h3>
      <p className="text-gray-700 leading-relaxed">{description}</p>
    </div>
  );
}
