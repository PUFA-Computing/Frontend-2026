import React from 'react';
import News from '@/models/news';
import { FileText, Calendar, TrendingUp } from 'lucide-react';

interface NewsOverviewProps {
  news: News[];
}

export default function NewsOverview({ news }: NewsOverviewProps) {
  // Calculate metrics
  const totalNews = news.length;
  
  // Get recent news
  const recentNews = [...news]
    .sort((a, b) => new Date(b.publish_date).getTime() - new Date(a.publish_date).getTime())
    .slice(0, 3);
  
  // Calculate monthly distribution
  const currentYear = new Date().getFullYear();
  const monthCounts = Array(12).fill(0);
  
  news.forEach(item => {
    const publishDate = new Date(item.publish_date);
    if (publishDate.getFullYear() === currentYear) {
      monthCounts[publishDate.getMonth()]++;
    }
  });
  
  // Find the month with most publications
  const maxPublications = Math.max(...monthCounts);
  const mostActiveMonthIndex = monthCounts.indexOf(maxPublications);
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const mostActiveMonth = monthNames[mostActiveMonthIndex];

  return (
    <div className="space-y-6">
      {/* Key metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          <div className="flex items-center space-x-3 mb-2">
            <div className="bg-indigo-50 p-2 rounded-full">
              <FileText size={18} className="text-indigo-600" />
            </div>
            <span className="text-sm font-medium text-gray-600">Total Articles</span>
          </div>
          <div className="text-2xl font-semibold text-gray-800">{totalNews}</div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          <div className="flex items-center space-x-3 mb-2">
            <div className="bg-indigo-50 p-2 rounded-full">
              <Calendar size={18} className="text-indigo-600" />
            </div>
            <span className="text-sm font-medium text-gray-600">Most Active Month</span>
          </div>
          <div className="flex items-baseline">
            <span className="text-2xl font-semibold text-gray-800">{mostActiveMonth}</span>
            <span className="ml-2 text-xs text-gray-500">({maxPublications} articles)</span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          <div className="flex items-center space-x-3 mb-2">
            <div className="bg-indigo-50 p-2 rounded-full">
              <TrendingUp size={18} className="text-indigo-600" />
            </div>
            <span className="text-sm font-medium text-gray-600">Monthly Average</span>
          </div>
          <div className="text-2xl font-semibold text-gray-800">
            {(monthCounts.reduce((a, b) => a + b, 0) / 12).toFixed(1)}
          </div>
        </div>
      </div>

      {/* Monthly distribution */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
        <h3 className="text-sm font-medium text-gray-600 mb-3">Monthly Distribution</h3>
        <div className="grid grid-cols-12 gap-1 h-24 items-end">
          {monthCounts.map((count, index) => (
            <div key={index} className="flex flex-col items-center">
              <div 
                className="w-full bg-indigo-600 rounded-t"
                style={{ 
                  height: `${count > 0 ? (count / maxPublications) * 100 : 0}%`,
                  minHeight: count > 0 ? '4px' : '0'
                }}
              ></div>
              <span className="text-xs text-gray-500 mt-1">{monthNames[index].charAt(0)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent articles */}
      {recentNews.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          <h3 className="text-sm font-medium text-gray-600 mb-3">Recent Articles</h3>
          <div className="space-y-3">
            {recentNews.map((item, index) => (
              <div key={index} className="flex items-start">
                <div className="w-8 h-8 flex-shrink-0 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-xs font-medium">
                  {index + 1}
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-gray-800 line-clamp-1">{item.title}</h4>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(item.publish_date).toLocaleDateString()}
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
