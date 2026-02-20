import {
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Wrench,
  Home as HomeIcon,
  Eye,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Calendar,
  UserPlus,
  Settings,
  Receipt,
  Bell,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// ─── Types ─────────────────────────────────────────────────────────────────────
interface StatCard {
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  badge?: { label: string; color: string; bg: string };
  value: string;
  label: string;
  trend?: { value: string; positive: boolean };
}

// ─── Data ──────────────────────────────────────────────────────────────────────
const revenueData = [
  { month: "Jan", collected: 32000, overdue: 5000 },
  { month: "Feb", collected: 38000, overdue: 7000 },
  { month: "Mar", collected: 42000, overdue: 4000 },
  { month: "Apr", collected: 40000, overdue: 6000 },
  { month: "May", collected: 45000, overdue: 3000 },
  { month: "Jun", collected: 44300, overdue: 5500 },
];

const occupancyData = [
  { month: "Jan", rate: 93.2 },
  { month: "Feb", rate: 93.8 },
  { month: "Mar", rate: 94.5 },
  { month: "Apr", rate: 94.1 },
  { month: "May", rate: 95.8 },
  { month: "Jun", rate: 96.5 },
];

const maintenancePieData = [
  { name: "Pending", value: 18, color: "#FBBF24" },
  { name: "In Progress", value: 12, color: "#3B82F6" },
  { name: "Completed", value: 45, color: "#10B981" },
  { name: "Cancelled", value: 3, color: "#EF4444" },
];

const recentPayments = [
  {
    name: "Ahmed Hassan",
    unit: "A-205",
    time: "2 hours ago",
    amount: "3500 EGP",
    status: "paid",
  },
  {
    name: "Sara El-Gendy",
    unit: "B-102",
    time: "5 hours ago",
    amount: "4200 EGP",
    status: "paid",
  },
  {
    name: "Mohamed Ali",
    unit: "C-310",
    time: "1 day ago",
    amount: "3800 EGP",
    status: "paid",
  },
  {
    name: "Heba Mahmoud",
    unit: "A-150",
    time: "1 day ago",
    amount: "3500 EGP",
    status: "paid",
  },
];

const maintenanceRequests = [
  {
    type: "Plumbing",
    unit: "A-102",
    time: "15 mins ago",
    priority: "high",
    status: "Pending",
  },
  {
    type: "Electrical",
    unit: "B-205",
    time: "1 hour ago",
    priority: "medium",
    status: "In Progress",
  },
  {
    type: "AC Repair",
    unit: "C-310",
    time: "3 hours ago",
    priority: "low",
    status: "In Progress",
  },
  {
    type: "Cleaning",
    unit: "A-405",
    time: "5 hours ago",
    priority: "low",
    status: "Pending",
  },
];

const upcomingEvents = [
  {
    title: "Summer BBQ Party",
    date: "Feb 15 at 6:00 PM",
    attendees: 45,
    color: "#F97316",
  },
  {
    title: "Kids Swimming Class",
    date: "Feb 18 at 10:00 AM",
    attendees: 28,
    color: "#8B5CF6",
  },
  {
    title: "Yoga & Wellness W.",
    date: "Feb 20 at 7:00 AM",
    attendees: 18,
    color: "#10B981",
  },
];

const gateAccessLogs = [
  {
    name: "Ahmed Khaled",
    type: "Resident · A-205",
    time: "10 mins ago",
    status: "Granted",
  },
  {
    name: "Delivery - Amazon",
    type: "Visitor · B-102",
    time: "25 mins ago",
    status: "Granted",
  },
  {
    name: "Sara Mohamed",
    type: "Resident · C-205",
    time: "41 mins ago",
    status: "Granted",
  },
  {
    name: "Unknown Vehicle",
    type: "Visitor · N/A",
    time: "1 hour ago",
    status: "Denied",
  },
];

const statCards: StatCard[] = [
  {
    icon: Users,
    iconBg: "bg-sky-50",
    iconColor: "text-sky-500",
    trend: { value: "+5%", positive: true },
    value: "1,250",
    label: "Total Residents",
  },
  {
    icon: DollarSign,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-500",
    trend: { value: "+12%", positive: true },
    value: "44.3K",
    label: "Monthly Revenue",
  },
  {
    icon: Wrench,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-500",
    badge: { label: "18 Pending", color: "text-amber-600", bg: "bg-amber-50" },
    value: "78",
    label: "Total Requests",
  },
  {
    icon: HomeIcon,
    iconBg: "bg-purple-50",
    iconColor: "text-purple-500",
    badge: { label: "97%", color: "text-purple-600", bg: "bg-purple-50" },
    value: "332/342",
    label: "Units Occupied",
  },
  {
    icon: Eye,
    iconBg: "bg-teal-50",
    iconColor: "text-teal-500",
    badge: { label: "Today", color: "text-teal-600", bg: "bg-teal-50" },
    value: "24",
    label: "Active Visitors",
  },
  {
    icon: AlertTriangle,
    iconBg: "bg-red-50",
    iconColor: "text-red-500",
    badge: { label: "Urgent", color: "text-red-600", bg: "bg-red-50" },
    value: "12",
    label: "Overdue Payments",
  },
];

// ─── Sub-components ────────────────────────────────────────────────────────────

const PriorityBadge = ({ priority }: { priority: string }) => {
  const styles: Record<string, string> = {
    high: "bg-red-100 text-red-600",
    medium: "bg-amber-100 text-amber-600",
    low: "bg-green-100 text-green-600",
  };
  return (
    <span
      className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${styles[priority] ?? ""}`}
    >
      {priority}
    </span>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    Pending: "text-amber-600",
    "In Progress": "text-blue-600",
    Completed: "text-emerald-600",
    Granted: "text-emerald-600",
    Denied: "text-red-600",
  };
  return (
    <span
      className={`text-xs font-semibold ${styles[status] ?? "text-gray-500"}`}
    >
      {status}
    </span>
  );
};

// ─── Main Dashboard ────────────────────────────────────────────────────────────

const DashboardHome = () => {
  return (
    <div className="space-y-5">
      {/* Welcome Banner */}
      <div className="relative bg-gradient-to-r from-[#00A389] via-[#008070] to-[#005C4F] rounded-2xl px-8 py-6 overflow-hidden shadow-lg">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-12 -right-12 w-52 h-52 bg-white/10 rounded-full" />
          <div className="absolute -bottom-16 -left-8 w-64 h-64 bg-white/5 rounded-full" />
          <div className="absolute top-6 right-44 w-24 h-24 bg-white/5 rounded-full" />
        </div>
        <div className="relative flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">
              Welcome back, Mohamed! 👋
            </h1>
            <p className="text-white/70 text-sm">
              Here's what's happening with Sakane Compound today.
            </p>
          </div>
          <div className="text-right">
            <p className="text-white/60 text-xs mb-0.5">Current Date</p>
            <p className="text-white font-semibold text-sm">
              Thursday, February 12, 2026
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={i}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-start justify-between mb-3">
                <div
                  className={`w-9 h-9 rounded-lg ${card.iconBg} flex items-center justify-center`}
                >
                  <Icon className={`w-4.5 h-4.5 ${card.iconColor}`} />
                </div>
                {card.trend && (
                  <span
                    className={`flex items-center gap-0.5 text-[11px] font-semibold ${
                      card.trend.positive ? "text-emerald-500" : "text-red-500"
                    }`}
                  >
                    {card.trend.positive ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    {card.trend.value}
                  </span>
                )}
                {card.badge && (
                  <span
                    className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${card.badge.bg} ${card.badge.color}`}
                  >
                    {card.badge.label}
                  </span>
                )}
              </div>
              <p className="text-xl font-bold text-gray-800 leading-tight">
                {card.value}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">{card.label}</p>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_290px] gap-4">
        {/* Revenue Overview */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-gray-800">
                Revenue Overview
              </h2>
              <p className="text-xs text-gray-400">
                Monthly payment collection analysis
              </p>
            </div>
            <select className="text-xs border border-gray-200 rounded-lg px-2.5 py-1 text-gray-600 outline-none bg-white cursor-pointer hover:bg-gray-50">
              <option>2026</option>
              <option>2025</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart
              data={revenueData}
              margin={{ top: 5, right: 5, left: -15, bottom: 0 }}
            >
              <defs>
                <linearGradient
                  id="collectedGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#00A389" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#00A389" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient
                  id="overdueGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#F3F4F6"
                vertical={false}
              />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11, fill: "#9CA3AF" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#9CA3AF" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  fontSize: 12,
                  borderRadius: 8,
                  border: "1px solid #E5E7EB",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  padding: "8px 12px",
                }}
              />
              <Area
                type="monotone"
                dataKey="collected"
                stroke="#00A389"
                strokeWidth={2.5}
                fill="url(#collectedGradient)"
                name="Collected"
              />
              <Area
                type="monotone"
                dataKey="overdue"
                stroke="#EF4444"
                strokeWidth={2}
                fill="url(#overdueGradient)"
                name="Overdue"
              />
            </AreaChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-5 mt-2">
            <span className="flex items-center gap-1.5 text-xs text-gray-500">
              <span className="w-4 h-0.5 bg-[#00A389] rounded-full inline-block" />
              Collected
            </span>
            <span className="flex items-center gap-1.5 text-xs text-gray-500">
              <span className="w-4 h-0.5 bg-red-400 rounded-full inline-block" />
              Overdue
            </span>
          </div>
        </div>

        {/* Maintenance Status */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="mb-3">
            <h2 className="text-sm font-semibold text-gray-800">
              Maintenance Status
            </h2>
            <p className="text-xs text-gray-400">Current month overview</p>
          </div>
          <div className="flex justify-center my-2">
            <PieChart width={170} height={170}>
              <Pie
                data={maintenancePieData}
                cx={85}
                cy={85}
                innerRadius={52}
                outerRadius={78}
                paddingAngle={3}
                dataKey="value"
                strokeWidth={0}
              >
                {maintenancePieData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-2">
            {maintenancePieData.map((item) => (
              <div key={item.name} className="flex items-center gap-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-[11px] text-gray-500 truncate">
                  {item.name}
                </span>
                <span className="text-[11px] font-bold text-gray-700 ml-auto">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Occupancy Trend */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <div className="mb-4">
          <h2 className="text-sm font-semibold text-gray-800">
            Occupancy Trend
          </h2>
          <p className="text-xs text-gray-400">Unit occupancy rate over time</p>
        </div>
        <ResponsiveContainer width="100%" height={150}>
          <LineChart
            data={occupancyData}
            margin={{ top: 5, right: 5, left: -15, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#F3F4F6"
              vertical={false}
            />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fill: "#9CA3AF" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={[90, 100]}
              tick={{ fontSize: 11, fill: "#9CA3AF" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                fontSize: 12,
                borderRadius: 8,
                border: "1px solid #E5E7EB",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                padding: "8px 12px",
              }}
              formatter={(value) => [`${value}%`, "Occupancy Rate"]}
            />
            <Line
              type="monotone"
              dataKey="rate"
              stroke="#00A389"
              strokeWidth={2.5}
              dot={{
                fill: "#00A389",
                r: 4.5,
                strokeWidth: 2.5,
                stroke: "#fff",
              }}
              activeDot={{ r: 6, fill: "#00A389" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Tables Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Recent Payments */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-800">
              Recent Payments
            </h3>
            <button className="text-xs text-[#00A389] font-semibold hover:underline transition-all">
              View All
            </button>
          </div>
          <div className="space-y-3.5">
            {recentPayments.map((p, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-800 truncate">
                    {p.name}
                  </p>
                  <p className="text-[10px] text-gray-400">
                    {p.unit} · {p.time}
                  </p>
                </div>
                <p className="text-xs font-bold text-gray-700 whitespace-nowrap">
                  {p.amount}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Maintenance Requests */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-800">
              Maintenance Requests
            </h3>
            <button className="text-xs text-[#00A389] font-semibold hover:underline transition-all">
              View All
            </button>
          </div>
          <div className="space-y-3.5">
            {maintenanceRequests.map((m, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-800">
                    {m.type}
                  </p>
                  <p className="text-[10px] text-gray-400">
                    {m.unit} · {m.time}
                  </p>
                </div>
                <PriorityBadge priority={m.priority} />
                <StatusBadge status={m.status} />
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-800">
              Upcoming Events
            </h3>
            <button className="text-xs text-[#00A389] font-semibold hover:underline transition-all">
              View All
            </button>
          </div>
          <div className="space-y-3.5">
            {upcomingEvents.map((e, i) => (
              <div key={i} className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: e.color + "20" }}
                >
                  <Calendar className="w-4 h-4" style={{ color: e.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-800 truncate">
                    {e.title}
                  </p>
                  <p className="text-[10px] text-gray-400">{e.date}</p>
                  <p className="text-[10px] text-gray-400">
                    At {e.attendees} attendees
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Gate Access Logs */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-800">
              Gate Access Logs
            </h3>
            <button className="text-xs text-[#00A389] font-semibold hover:underline transition-all">
              View All
            </button>
          </div>
          <div className="space-y-3.5">
            {gateAccessLogs.map((g, i) => (
              <div key={i} className="flex items-center gap-2">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                    g.status === "Granted" ? "bg-emerald-50" : "bg-red-50"
                  }`}
                >
                  {g.status === "Granted" ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <XCircle className="w-3.5 h-3.5 text-red-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-800 truncate">
                    {g.name}
                  </p>
                  <p className="text-[10px] text-gray-400 truncate">{g.type}</p>
                  <p className="text-[10px] text-gray-400">{g.time}</p>
                </div>
                <StatusBadge status={g.status} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            icon: UserPlus,
            label: "Add New Resident",
            sub: "Register a new resident",
            bg: "bg-sky-50",
            color: "text-sky-500",
            border: "border-sky-100",
            hover: "hover:bg-sky-50",
          },
          {
            icon: Settings,
            label: "Create Maintenance",
            sub: "Log new request",
            bg: "bg-orange-50",
            color: "text-orange-500",
            border: "border-orange-100",
            hover: "hover:bg-orange-50",
          },
          {
            icon: Receipt,
            label: "Record Payment",
            sub: "Add payment record",
            bg: "bg-emerald-50",
            color: "text-emerald-600",
            border: "border-emerald-100",
            hover: "hover:bg-emerald-50",
          },
          {
            icon: Bell,
            label: "Send Announcement",
            sub: "Notify all residents",
            bg: "bg-purple-50",
            color: "text-purple-600",
            border: "border-purple-100",
            hover: "hover:bg-purple-50",
          },
        ].map((action, i) => {
          const Icon = action.icon;
          return (
            <button
              key={i}
              className={`bg-white border ${action.border} rounded-xl p-5 flex flex-col items-center gap-3 hover:shadow-md transition-all duration-200 group`}
            >
              <div
                className={`w-12 h-12 ${action.bg} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}
              >
                <Icon className={`w-5 h-5 ${action.color}`} />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-gray-800">
                  {action.label}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">{action.sub}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default DashboardHome;
