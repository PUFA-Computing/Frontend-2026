"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import type Event from "@/models/event";

interface EventsSearchProps {
  events: Event[];
}

export default function EventsSearch({ events }: EventsSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Apply search filtering when searchQuery changes
  useEffect(() => {
    if (!searchQuery.trim()) {
      // If search is empty, show all events (respecting any active category filters)
      const eventElements = document.querySelectorAll('[data-event-id]');
      eventElements.forEach(element => {
        if (element.classList.contains('filter-hidden')) {
          // Don't show if hidden by category filter
          return;
        }
        (element as HTMLElement).style.display = 'block';
      });
      return;
    }
    
    const query = searchQuery.toLowerCase().trim();
    
    // Get all event elements
    const eventElements = document.querySelectorAll('[data-event-id]');
    
    // Loop through all events
    events.forEach(event => {
      const element = document.querySelector(`[data-event-id="${event.id}"]`);
      if (!element) return;
      
      // Check if event matches search query
      const matchesSearch = 
        event.title.toLowerCase().includes(query) || 
        event.description.toLowerCase().includes(query) ||
        event.organization.toLowerCase().includes(query) ||
        (event.location && event.location.toLowerCase().includes(query));
      
      // Only show if it matches search and isn't hidden by category filter
      if (matchesSearch) {
        if (!element.classList.contains('filter-hidden')) {
          (element as HTMLElement).style.display = 'block';
        }
      } else {
        (element as HTMLElement).style.display = 'none';
      }
    });
  }, [searchQuery, events]);
  
  return (
    <div className="relative w-full">
      <div className="flex w-full overflow-hidden rounded-lg border border-gray-300 bg-white shadow-sm focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500">
        <div className="flex items-center pl-3">
          <Search className="h-4 w-4 text-gray-400 sm:h-5 sm:w-5" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full border-0 py-2 pl-2 pr-3 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-0"
          placeholder="Search events..."
        />
      </div>
    </div>
  );
}
