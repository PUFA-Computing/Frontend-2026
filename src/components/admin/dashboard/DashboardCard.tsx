import React, { ReactNode, useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface DashboardCardProps {
  title: string;
  children: ReactNode;
  defaultExpanded?: boolean;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  icon?: ReactNode;
}

export default function DashboardCard({
  title,
  children,
  defaultExpanded = true,
  className = '',
  headerClassName = '',
  contentClassName = '',
  icon
}: DashboardCardProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden transition-all duration-200 ${className}`}>
      <div 
        className={`flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors ${headerClassName}`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-3">
          {icon && <div className="text-gray-500">{icon}</div>}
          <h3 className="font-medium text-gray-800">{title}</h3>
        </div>
        <div className="text-gray-400">
          {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
        </div>
      </div>
      
      <div 
        className={`overflow-hidden transition-all duration-300 ${contentClassName}`}
        style={{ 
          maxHeight: isExpanded ? '2000px' : '0',
          opacity: isExpanded ? 1 : 0,
          padding: isExpanded ? '1rem' : '0 1rem'
        }}
      >
        {children}
      </div>
    </div>
  );
}
