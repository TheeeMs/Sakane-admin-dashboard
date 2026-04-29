import type { EventStatus } from '../../types';

interface StatusBadgeProps {
  status: EventStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const statusConfig = {
    pending: {
      bg: 'bg-yellow-100',
      text: 'text-yellow-700',
      label: 'Pending'
    },
    approved: {
      bg: 'bg-green-100',
      text: 'text-green-700',
      label: 'Approved'
    },
    ongoing: {
      bg: 'bg-blue-100',
      text: 'text-blue-700',
      label: 'Ongoing'
    },
    completed: {
      bg: 'bg-gray-100',
      text: 'text-gray-700',
      label: 'Completed'
    },
    rejected: {
      bg: 'bg-red-100',
      text: 'text-red-700',
      label: 'Rejected'
    }
  };

  const config = statusConfig[status];

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  );
}
