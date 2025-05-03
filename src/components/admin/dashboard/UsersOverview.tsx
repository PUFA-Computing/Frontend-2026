import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import User from '@/models/user';
import Event from '@/models/event';
import { Users, ShieldCheck, Mail } from 'lucide-react';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

interface UsersOverviewProps {
  users: User[];
  events: Event[];
}

export default function UsersOverview({ users, events }: UsersOverviewProps) {
  // Calculate key metrics
  const verifiedUsers = users.filter(user => user.student_id_verified).length;
  const emailVerifiedUsers = users.filter(user => user.email_verified).length;
  const twoFaEnabledUsers = users.filter(user => user.twofa_enabled).length;
  
  const verifiedPercentage = users.length > 0 ? (verifiedUsers / users.length) * 100 : 0;
  const emailVerifiedPercentage = users.length > 0 ? (emailVerifiedUsers / users.length) * 100 : 0;
  const twoFaEnabledPercentage = users.length > 0 ? (twoFaEnabledUsers / users.length) * 100 : 0;

  // Count users by major
  const majorCounts: { [key: string]: number } = {};
  users.forEach(user => {
    const major = user.major || "Undeclared";
    majorCounts[major] = (majorCounts[major] || 0) + 1;
  });

  // Get top majors
  const topMajors = Object.entries(majorCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  // Verification chart data
  const verificationData = {
    labels: ['Verified', 'Unverified'],
    datasets: [
      {
        data: [verifiedUsers, users.length - verifiedUsers],
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
              <Users size={18} className="text-indigo-600" />
            </div>
            <span className="text-sm font-medium text-gray-600">Total Users</span>
          </div>
          <div className="text-2xl font-semibold text-gray-800">{users.length}</div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          <div className="flex items-center space-x-3 mb-2">
            <div className="bg-indigo-50 p-2 rounded-full">
              <ShieldCheck size={18} className="text-indigo-600" />
            </div>
            <span className="text-sm font-medium text-gray-600">ID Verification</span>
          </div>
          <div className="flex items-baseline">
            <span className="text-2xl font-semibold text-gray-800">{verifiedPercentage.toFixed(1)}%</span>
            <span className="ml-2 text-xs text-gray-500">({verifiedUsers} verified)</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
            <div 
              className="bg-indigo-600 h-1.5 rounded-full" 
              style={{ width: `${Math.min(100, verifiedPercentage)}%` }}
            ></div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          <div className="flex items-center space-x-3 mb-2">
            <div className="bg-indigo-50 p-2 rounded-full">
              <Mail size={18} className="text-indigo-600" />
            </div>
            <span className="text-sm font-medium text-gray-600">Email Verification</span>
          </div>
          <div className="flex items-baseline">
            <span className="text-2xl font-semibold text-gray-800">{emailVerifiedPercentage.toFixed(1)}%</span>
            <span className="ml-2 text-xs text-gray-500">({emailVerifiedUsers} verified)</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
            <div 
              className="bg-indigo-600 h-1.5 rounded-full" 
              style={{ width: `${Math.min(100, emailVerifiedPercentage)}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* User distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          <h3 className="text-sm font-medium text-gray-600 mb-3">Verification Status</h3>
          <div className="h-48">
            {users.length > 0 && <Doughnut data={verificationData} options={doughnutOptions} />}
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          <h3 className="text-sm font-medium text-gray-600 mb-3">Top Majors</h3>
          {topMajors.length > 0 ? (
            <div className="space-y-4">
              {topMajors.map(([major, count], index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-700">{major}</span>
                    <span className="text-xs font-medium text-indigo-600">{count} users</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-indigo-600 h-2 rounded-full" 
                      style={{ width: `${(count / users.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-48 flex items-center justify-center text-gray-400">
              No data available
            </div>
          )}
        </div>
      </div>

      {/* 2FA adoption */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
        <div className="flex items-center space-x-3 mb-3">
          <span className="text-sm font-medium text-gray-600">2FA Adoption</span>
          <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2 py-0.5 rounded">
            {twoFaEnabledPercentage.toFixed(1)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-indigo-600 h-2.5 rounded-full" 
            style={{ width: `${Math.min(100, twoFaEnabledPercentage)}%` }}
          ></div>
        </div>
        <div className="mt-2 text-xs text-gray-500">
          {twoFaEnabledUsers} of {users.length} users have enabled two-factor authentication
        </div>
      </div>
    </div>
  );
}
