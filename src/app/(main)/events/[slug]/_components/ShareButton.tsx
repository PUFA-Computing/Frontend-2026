"use client";

import React from "react";
import { Share2 } from "lucide-react";

interface ShareButtonProps {
  title: string;
}

export default function ShareButton({ title }: ShareButtonProps) {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: title,
        text: `Check out this event: ${title}`,
        url: window.location.href,
      }).catch(err => console.log('Error sharing', err));
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <button 
      className="flex w-full items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50"
      onClick={handleShare}
    >
      <Share2 className="mr-2 h-4 w-4" />
      Share Event
    </button>
  );
}
