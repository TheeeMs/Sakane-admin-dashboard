interface ProgressBarProps {
  current: number;
  max: number;
  color?: string;
}

export function ProgressBar({ current, max, color = 'bg-[#00A996]' }: ProgressBarProps) {
  const percentage = Math.min((current / max) * 100, 100);
  
  return (
    <div className="w-full">
      <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
        <span>
          {current} / {max} attendees
        </span>
        <span className="font-semibold">{Math.round(percentage)}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <div
          className={`${color} h-full rounded-full transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
