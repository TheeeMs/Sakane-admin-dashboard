import { GenericTable } from "@/components/shared/GenericTable";
import TypeBadge from "./TypeBadge";
import StatusBadge from "./StatusBadge";
import { TagIcon, EyeIcon, EditIcon, HistoryIcon, TrashIcon } from "./icons";
import type { Report } from "../types";

interface ReportTableProps {
  reports: Report[];
  onViewReport: (report: Report) => void;
  onEditReport: (report: Report) => void;
  onDeleteReport: (report: Report) => void;
}

export default function ReportTable({
  reports,
  onViewReport,
  onEditReport,
  onDeleteReport,
}: ReportTableProps) {
  return (
    <GenericTable<Report>
      data={reports}
      searchPlaceholder="Search by title, description, or reporter name..."
      searchKeys={["title", "shortDesc", "reportedBy", "location", "category"]}
      filters={[
        {
          key: "type",
          label: "All Types",
          options: [
            { value: "Missing", label: "Missing" },
            { value: "Found", label: "Found" },
          ],
        },
        {
          key: "status",
          label: "All Status",
          options: [
            { value: "Open", label: "Open" },
            { value: "Matched", label: "Matched" },
            { value: "Resolved", label: "Resolved" },
            { value: "Closed", label: "Closed" },
          ],
        },
      ]}
      actions={[
        {
          icon: <EyeIcon />,
          hoverColor: "#10b981",
          label: "View",
          action: onViewReport,
        },
        {
          icon: <EditIcon />,
          hoverColor: "#3b82f6",
          label: "Edit",
          action: onEditReport,
        },
        {
          icon: <HistoryIcon />,
          hoverColor: "#f59e0b",
          label: "History",
          action: () => console.log("History clicked"),
        },
        {
          icon: <TrashIcon />,
          hoverColor: "#ef4444",
          label: "Delete",
          action: onDeleteReport,
        },
      ]}
      columns={[
        {
          key: "type",
          header: "Type",
          render: (r) => <TypeBadge type={r.type} />,
        },
        {
          key: "category",
          header: "Category",
          render: (r) => (
            <span className="flex items-center gap-2 text-gray-600">
              <TagIcon /> {r.category}
            </span>
          ),
        },
        {
          key: "title",
          header: "Item Details",
          render: (r) => (
            <div>
              <div className="font-semibold text-gray-900 truncate">
                {r.title}
              </div>
              <div className="text-gray-400 text-xs mt-1">{r.shortDesc}</div>
            </div>
          ),
          className: "max-w-[180px]",
        },
        {
          key: "location",
          header: "Location",
          render: (r) => <span className="text-gray-700">{r.location}</span>,
        },
        {
          key: "reportedBy",
          header: "Reported By",
          render: (r) => (
            <div>
              <div className="font-medium text-gray-800">{r.reportedBy}</div>
              <div className="text-xs text-gray-400">{r.unit}</div>
            </div>
          ),
        },
        {
          key: "status",
          header: "Status",
          render: (r) => <StatusBadge status={r.status} />,
        },
        {
          key: "date",
          header: "Date",
          render: (r) => (
            <span className="text-gray-600 whitespace-nowrap">{r.date}</span>
          ),
        },
      ]}
    />
  );
}
