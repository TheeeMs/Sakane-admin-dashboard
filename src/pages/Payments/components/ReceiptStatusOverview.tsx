import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { TrendingUp } from "lucide-react";
import type { ReceiptStatistics } from "../types";

interface ReceiptStatusOverviewProps {
  statistics: ReceiptStatistics;
}

const COLORS = {
  paid: "#00A996",
  pending: "#F59E0B",
  overdue: "#EF4444",
};

export function ReceiptStatusOverview({ statistics }: ReceiptStatusOverviewProps) {
  const total = statistics.totalPaid + statistics.totalPending + statistics.totalOverdue;
  const paidPercentage = total > 0 ? Math.round((statistics.totalPaid / total) * 100) : 0;

  const data = [
    { name: "Paid", value: statistics.totalPaid, color: COLORS.paid },
    { name: "Pending", value: statistics.totalPending, color: COLORS.pending },
    { name: "Overdue", value: statistics.totalOverdue, color: COLORS.overdue },
  ];

  return (
    <div className="bg-white rounded-2xl border-2 border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Receipt Status Overview</h3>
      
      <div className="flex flex-col items-center">
        {/* Donut Chart */}
        <div className="relative w-40 h-40 mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={70}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          {/* Center Text */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{paidPercentage}%</p>
              <p className="text-xs text-gray-500">Total Paid</p>
            </div>
          </div>
        </div>

        {/* +8% from last month */}
        <div className="flex items-center gap-1 text-sm text-green-600 mb-4">
          <TrendingUp className="w-4 h-4" />
          <span>+8% from last month</span>
        </div>

        {/* Legend */}
        <div className="w-full space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#00A996]" />
              <span className="text-gray-700">Paid</span>
            </div>
            <span className="text-gray-900 font-medium">{statistics.totalPaid} receipts</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#F59E0B]" />
              <span className="text-gray-700">Pending</span>
            </div>
            <span className="text-gray-900 font-medium">{statistics.totalPending} receipts</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#EF4444]" />
              <span className="text-gray-700">Overdue</span>
            </div>
            <span className="text-gray-900 font-medium">{statistics.totalOverdue} receipts</span>
          </div>
        </div>
      </div>
    </div>
  );
}
