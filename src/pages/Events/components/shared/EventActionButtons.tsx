import { Bell, Download, Edit, Trash2 } from "lucide-react";

interface EventActionButtonsProps {
  onNotify?: () => void;
  onExport?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function EventActionButtons({
  onNotify,
  onExport,
  onEdit,
  onDelete,
}: EventActionButtonsProps) {
  return (
    <div className="flex flex-wrap gap-3">
      <button
        onClick={onNotify}
        className="flex items-center gap-2 px-4 py-2 bg-[#00A996] hover:bg-[#008c7a] text-white rounded-lg font-medium transition-colors"
      >
        <Bell className="w-4 h-4" />
        Notify Residents
      </button>
      <button
        onClick={onExport}
        className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
      >
        <Download className="w-4 h-4" />
        Export List
      </button>
      <button
        onClick={onEdit}
        className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
      >
        <Edit className="w-4 h-4" />
        Edit
      </button>
      <button
        onClick={onDelete}
        className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg font-medium transition-colors ml-auto"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}
