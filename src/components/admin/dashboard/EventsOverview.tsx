import React from 'react';
import { Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import Event from '@/models/event';
import { CalendarDays } from 'lucide-react';

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface EventsOverviewProps {
  events: Event[];
}

export default function EventsOverview({ events }: EventsOverviewProps) {
  // Calculate key metrics
  const activeEvents = events.filter(event => new Date(event.end_date) > new Date()).length;
  const completedEvents = events.filter(event => new Date(event.end_date) <= new Date()).length;
  const totalRegistrations = events.reduce((sum, event) => sum + (event.registered_count || 0), 0);
  const totalCapacity = events.reduce((sum, event) => sum + (event.max_registration || 0), 0);
  const registrationRate = totalCapacity > 0 ? (totalRegistrations / totalCapacity) * 100 : 0;

  // Get top events by registration
  const topEvents = [...events]
    .sort((a, b) => (b.registered_count || 0) - (a.registered_count || 0))
    .slice(0, 3);

  // Status chart data
  const statusData = {
    labels: ['Active', 'Completed'],
    datasets: [
      {
        data: [activeEvents, completedEvents],
        backgroundColor: [
          'rgba(99, 102, 241, 0.7)',
          'rgba(209, 213, 219, 0.7)'
        ],
        borderColor: [
          'rgba(99, 102, 241, 1)',
          'rgba(209, 213, 219, 1)'
        ],
        borderWidth: 1,
        hoverOffset: 4
      }
    ]
  };

  // Chart options
  const doughnutOptions = {
    cutout: '70%',
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          usePointStyle: true,
          boxWidth: 8,
          padding: 15
        }
      },
      tooltip: {
        displayColors: false,
        callbacks: {
          label: function(context: any) {
            return `${context.label}: ${context.raw}`;
          }
        }
      }
    },
    maintainAspectRatio: false
  };

  return (
    <div className="space-y-6">
      {/* Key metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          <div className="flex items-center space-x-3 mb-2">
            <div className="bg-indigo-50 p-2 rounded-full">
              <CalendarDays size={18} className="text-indigo-600" />
            </div>
            <span className="text-sm font-medium text-gray-600">Active Events</span>
          </div>
          <div className="flex items-baseline">
            <span className="text-2xl font-semibold text-gray-800">{activeEvents}</span>
            <span className="ml-2 text-xs text-gray-500">of {events.length} total</span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-gray-600">Registration Rate</span>
            <span className="text-sm font-medium text-indigo-600">{registrationRate.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-indigo-600 h-2.5 rounded-full" 
              style={{ width: `${Math.min(100, registrationRate)}%` }}
            ></div>
          </div>
          <div className="mt-1 text-xs text-gray-500">
            {totalRegistrations} of {totalCapacity} spots filled
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          <div className="text-sm font-medium text-gray-600 mb-2">Event Status</div>
          <div className="h-24">
            {events.length > 0 && <Doughnut data={statusData} options={doughnutOptions} />}
          </div>
        </div>
      </div>

      {/* Top events */}
      {topEvents.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          <h3 className="text-sm font-medium text-gray-600 mb-3">Top Events by Registration</h3>
          <div className="space-y-3">
            {topEvents.map((event, index) => (
              <div key={index} className="flex items-center">
                <div className="w-8 h-8 flex-shrink-0 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-xs font-medium">
                  {index + 1}
                </div>
                <div className="ml-3 flex-grow">
                  <div className="flex justify-between items-baseline">
                    <span className="text-sm font-medium text-gray-800 truncate max-w-[200px]">
                      {event.title}
                    </span>
                    <span className="text-xs font-medium text-indigo-600">
                      {event.registered_count || 0} registrations
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                    <div 
                      className="bg-indigo-600 h-1.5 rounded-full" 
                      style={{ 
                        width: `${event.max_registration ? Math.min(100, (event.registered_count || 0) / event.max_registration * 100) : 0}%` 
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
