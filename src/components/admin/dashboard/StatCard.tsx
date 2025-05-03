import React, { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: number | string;
  description?: string;
  icon?: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export default function StatCard({
  title,
  value,
  description,
  icon,
  trend,
  className = ''
}: StatCardProps) {
  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-100 p-5 transition-all duration-200 hover:shadow-md ${className}`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <h3 className="text-2xl font-semibold text-gray-800">{value}</h3>
          {description && (
            <p className="text-xs text-gray-500 mt-1">{description}</p>
          )}
          {trend && (
            <div className={`flex items-center mt-2 text-xs ${trend.isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
              <span>{trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%</span>
              <span className="ml-1">vs last period</span>
            </div>
          )}
        </div>
        {icon && (
          <div className="bg-indigo-50 p-3 rounded-full">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
