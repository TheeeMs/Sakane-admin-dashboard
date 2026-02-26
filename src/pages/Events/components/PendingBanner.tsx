import { AlertCircle } from 'lucide-react';

interface PendingBannerProps {
  count: number;
  onViewClick?: () => void;
}

export function PendingBanner({ count, onViewClick }: PendingBannerProps) {
  if (count === 0) return null;

  return (
    <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border-l-4 border-yellow-400 rounded-lg p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-yellow-100 p-2 rounded-full">
            <AlertCircle className="w-5 h-5 text-yellow-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Pending Approval</h3>
            <p className="text-sm text-gray-600">
              {count} event{count !== 1 ? 's' : ''} waiting for your review
            </p>
          </div>
        </div>
        
        {onViewClick && (
          <button
            onClick={onViewClick}
            className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-medium transition-colors duration-200"
          >
            Review Now
          </button>
        )}
      </div>
    </div>
  );
}
