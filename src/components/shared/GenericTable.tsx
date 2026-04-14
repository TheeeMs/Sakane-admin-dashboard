import { useState, useMemo } from "react";
import type { ReactNode } from "react";
import { Search } from "lucide-react";
import { Select } from "@/components/shared";

interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (item: T) => ReactNode;
  className?: string;
}

interface ActionButton<T> {
  icon: React.ReactNode;
  hoverColor?: string;
  label: string;
  action: (item: T) => void;
}

interface FilterConfig<T> {
  key: keyof T;
  label: string;
  options: { value: string; label: string }[];
}

interface GenericTableProps<T extends { id: string | number }> {
  data: T[];
  columns: Column<T>[];

  searchPlaceholder?: string;
  searchKeys?: (keyof T)[];

  filters?: FilterConfig<T>[];

  actions?: ActionButton<T>[];

  onRowClick?: (item: T) => void;

  emptyMessage?: string;
}

export function GenericTable<T extends { id: string | number }>({
  data,
  columns,
  searchPlaceholder = "Search...",
  searchKeys = [],
  filters = [],
  actions = [],
  onRowClick,
  emptyMessage = "No items found",
}: GenericTableProps<T>) {

  const [searchQuery, setSearchQuery] = useState("");
  const [filterValues, setFilterValues] = useState<Record<string, string>>(
    () => filters.reduce((acc, f) => ({ ...acc, [String(f.key)]: "all" }), {})
  );

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      // Search
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = searchKeys.some((key) =>
          String(item[key] ?? "").toLowerCase().includes(query)
        );
        if (!matchesSearch) return false;
      }

      // Filters
      for (const [key, value] of Object.entries(filterValues)) {
        if (value !== "all" && String(item[key as keyof T]) !== value) {
          return false;
        }
      }

      return true;
    });
  }, [data, searchQuery, filterValues, searchKeys]);

  const hasActiveFilters = searchQuery || Object.values(filterValues).some((v) => v !== "all");

  const clearFilters = () => {
    setSearchQuery("");
    setFilterValues(filters.reduce((acc, f) => ({ ...acc, [String(f.key)]: "all" }), {}));
  };

  const showActions = actions.length > 0;

  return (
    <div className="space-y-6">
      {/* Filters Bar */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex flex-wrap gap-4 mb-4">
          {/* Search */}
          <div className="flex-1 min-w-[280px] relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
            />
          </div>

          {/* Dynamic Filters */}
          {filters.map((filter) => (
            <Select
              key={String(filter.key)}
              label=""
              value={filterValues[String(filter.key)]}
              onChange={(e) =>
                setFilterValues((prev) => ({
                  ...prev,
                  [String(filter.key)]: e.target.value,
                }))
              }
              options={[
                { value: "all", label: filter.label },
                ...filter.options,
              ]}
            />
          ))}
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>
            Showing <strong>{filteredData.length}</strong> of <strong>{data.length}</strong> reports
          </span>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-teal-600 hover:text-teal-700 font-medium"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {columns.map((col, i) => (
                  <th
                    key={i}
                    className={`px-6 py-4 text-left font-semibold text-gray-900 ${col.className || ""}`}
                  >
                    {col.header}
                  </th>
                ))}
                {showActions && (
                  <th className="px-6 py-4 text-left font-semibold text-gray-900 w-32">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => onRowClick?.(item)}
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    {columns.map((col, i) => (
                      <td key={i} className={`px-6 py-4 ${col.className || ""}`}>
                        {col.render ? col.render(item) : (item[col.key as keyof T] as ReactNode)}
                      </td>
                    ))}

                    {/* Actions Column */}
                    {showActions && (
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          {actions.map((btn, index) => (
                            <button
                              key={index}
                              onClick={(e) => {
                                e.stopPropagation();
                                btn.action(item);
                              }}
                              className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 hover:border-current transition-all"
                              style={{ color: "#6b7280" }}
                              onMouseEnter={(e) => {
                                if (btn.hoverColor) {
                                  e.currentTarget.style.color = btn.hoverColor;
                                  e.currentTarget.style.borderColor = btn.hoverColor;
                                }
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.color = "#6b7280";
                                e.currentTarget.style.borderColor = "#e5e7eb";
                              }}
                              title={btn.label}
                            >
                              {btn.icon}
                            </button>
                          ))}
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={columns.length + (showActions ? 1 : 0)}
                    className="px-6 py-16 text-center text-gray-500"
                  >
                    {emptyMessage}
                    {hasActiveFilters && (
                      <button
                        onClick={clearFilters}
                        className="mt-4 block mx-auto text-teal-600 hover:text-teal-700 font-medium"
                      >
                        Clear filters
                      </button>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}