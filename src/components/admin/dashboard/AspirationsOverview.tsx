import React from 'react';
import { MessageSquare, CheckCircle, AlertCircle, Clock } from 'lucide-react';

interface AspirationsOverviewProps {
  aspirations: any[];
}

export default function AspirationsOverview({ aspirations }: AspirationsOverviewProps) {
  // Calculate metrics
  const totalAspirations = aspirations.length;
  
  // Count aspirations by status
  const pendingAspirations = aspirations.filter(a => a.status === 'pending').length;
  const resolvedAspirations = aspirations.filter(a => a.status === 'resolved').length;
  const rejectedAspirations = aspirations.filter(a => a.status === 'rejected').length;
  
  // Calculate percentages
  const pendingPercentage = totalAspirations > 0 ? (pendingAspirations / totalAspirations) * 100 : 0;
  const resolvedPercentage = totalAspirations > 0 ? (resolvedAspirations / totalAspirations) * 100 : 0;
  const rejectedPercentage = totalAspirations > 0 ? (rejectedAspirations / totalAspirations) * 100 : 0;
  
  // Get recent aspirations
  const recentAspirations = [...aspirations]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Key metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          <div className="flex items-center space-x-3 mb-2">
            <div className="bg-indigo-50 p-2 rounded-full">
              <MessageSquare size={18} className="text-indigo-600" />
            </div>
            <span className="text-sm font-medium text-gray-600">Total Feedback</span>
          </div>
          <div className="text-2xl font-semibold text-gray-800">{totalAspirations}</div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          <div className="flex items-center space-x-3 mb-2">
            <div className="bg-indigo-50 p-2 rounded-full">
              <CheckCircle size={18} className="text-indigo-600" />
            </div>
            <span className="text-sm font-medium text-gray-600">Resolution Rate</span>
          </div>
          <div className="flex items-baseline">
            <span className="text-2xl font-semibold text-gray-800">{resolvedPercentage.toFixed(1)}%</span>
            <span className="ml-2 text-xs text-gray-500">({resolvedAspirations} resolved)</span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          <div className="flex items-center space-x-3 mb-2">
            <div className="bg-indigo-50 p-2 rounded-full">
              <Clock size={18} className="text-indigo-600" />
            </div>
            <span className="text-sm font-medium text-gray-600">Pending</span>
          </div>
          <div className="flex items-baseline">
            <span className="text-2xl font-semibold text-gray-800">{pendingAspirations}</span>
            <span className="ml-2 text-xs text-gray-500">({pendingPercentage.toFixed(1)}%)</span>
          </div>
        </div>
      </div>

      {/* Status breakdown */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
        <h3 className="text-sm font-medium text-gray-600 mb-3">Status Breakdown</h3>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-indigo-500 mr-2"></div>
                <span className="text-sm text-gray-700">Resolved</span>
              </div>
              <span className="text-xs font-medium text-indigo-600">{resolvedPercentage.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-indigo-500 h-2 rounded-full" 
                style={{ width: `${resolvedPercentage}%` }}
              ></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
                <span className="text-sm text-gray-700">Pending</span>
              </div>
              <span className="text-xs font-medium text-amber-600">{pendingPercentage.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-amber-500 h-2 rounded-full" 
                style={{ width: `${pendingPercentage}%` }}
              ></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-gray-500 mr-2"></div>
                <span className="text-sm text-gray-700">Rejected</span>
              </div>
              <span className="text-xs font-medium text-gray-600">{rejectedPercentage.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gray-500 h-2 rounded-full" 
                style={{ width: `${rejectedPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent feedback */}
      {recentAspirations.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          <h3 className="text-sm font-medium text-gray-600 mb-3">Recent Feedback</h3>
          <div className="space-y-3">
            {recentAspirations.map((item, index) => (
              <div key={index} className="flex items-start">
                <div className={`w-8 h-8 flex-shrink-0 rounded-full flex items-center justify-center text-xs font-medium
                  ${item.status === 'resolved' ? 'bg-indigo-100 text-indigo-600' : 
                    item.status === 'pending' ? 'bg-amber-100 text-amber-600' : 
                    'bg-gray-100 text-gray-600'}`}
                >
                  {item.status === 'resolved' ? <CheckCircle size={14} /> : 
                   item.status === 'pending' ? <Clock size={14} /> : 
                   <AlertCircle size={14} />}
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-gray-800 line-clamp-1">{item.title || 'Untitled Feedback'}</h4>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                    {item.content || 'No content provided'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
