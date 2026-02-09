import React from "react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon,
  trend,
  className = "",
}) => {
  return (
    <div
      className={`bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-start justify-between ${className}`}
    >
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
        <h4 className="text-2xl font-bold text-gray-900">{value}</h4>
        {trend && (
          <p
            className={`text-xs mt-2 font-medium ${trend.isPositive ? "text-green-600" : "text-red-600"}`}
          >
            {trend.isPositive ? "↑" : "↓"} {trend.value}{" "}
            <span className="text-gray-400">vs last month</span>
          </p>
        )}
      </div>
      <div className="p-3 bg-blue-50 rounded-lg text-blue-600">{icon}</div>
    </div>
  );
};
