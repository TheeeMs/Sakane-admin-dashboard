import {
  formatDate as libFormatDate,
  formatTime as libFormatTime,
} from "@/lib/formatters";

export const getCategoryColor = (category: string): string => {
  const colors = {
    social: "bg-purple-100 text-purple-700",
    sports: "bg-blue-100 text-blue-700",
    health: "bg-green-100 text-green-700",
    entertainment: "bg-pink-100 text-pink-700",
    cultural: "bg-orange-100 text-orange-700",
    education: "bg-indigo-100 text-indigo-700",
  };
  return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-700";
};

// Re-export formatters from lib for backward compatibility
export const formatDate = libFormatDate;
export const formatTime = libFormatTime;
