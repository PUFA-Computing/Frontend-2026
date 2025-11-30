// src/app/(main)/vote/_components/VoteSuccessModal.tsx

import React from 'react';
import { CheckCircle } from 'lucide-react';

interface VoteSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidateName: string;
}

export function VoteSuccessModal({
  isOpen,
  onClose,
  candidateName,
}: VoteSuccessModalProps) {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative z-10 w-full max-w-md duration-300 animate-in zoom-in-95">
        <div className="relative overflow-hidden bg-white shadow-2xl rounded-2xl">
          {/* Success animation background */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-50" />
          
          {/* Confetti effect */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-float"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `-${Math.random() * 20}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${2 + Math.random() * 2}s`,
                }}
              >
                <div
                  className="w-2 h-2 rounded-full"
                  style={{
                    backgroundColor: [
                      '#F2B233',
                      '#B48322',
                      '#10B981',
                      '#3B82F6',
                      '#8B5CF6',
                    ][Math.floor(Math.random() * 5)],
                  }}
                />
              </div>
            ))}
          </div>
          
          {/* Content */}
          <div className="relative z-10 p-8 text-center">
            {/* Success Icon */}
            <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 bg-green-500 rounded-full shadow-lg animate-bounce">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            
            {/* Title */}
            <h2 className="mb-3 text-3xl font-bold text-gray-900">
              Vote Recorded!
            </h2>
            
            {/* Message */}
            <p className="mb-2 text-lg text-gray-700">
              You voted for
            </p>
            <p className="mb-6 text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#B48322] to-[#F2B233]">
              {candidateName}
            </p>
            
            <p className="mb-8 text-sm text-gray-600">
              Thank you for participating in the Major Leader election. Your voice matters in shaping the future of our program!
            </p>
            
            {/* Close Button */}
            <button
              onClick={onClose}
              className="w-full rounded-xl bg-gradient-to-r from-[#000000] to-[#B48322] py-3 font-bold text-white transition-all duration-300 hover:from-[#B48322] hover:to-[#F2B233] hover:shadow-lg"
            >
              Close
            </button>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
        .animate-float {
          animation: float linear infinite;
        }
      `}</style>
    </div>
  );
}