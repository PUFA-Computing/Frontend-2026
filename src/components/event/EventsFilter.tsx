"use client";

import { useState, useEffect } from "react";
import type Event from "@/models/event";
import EventsSearch from "./EventsSearch";

type FilterStatus = "all" | "upcoming" | "ongoing" | "ended";

interface EventsFilterProps {
  events: Event[];
}

export default function EventsFilter({ events }: EventsFilterProps) {
  const [activeFilter, setActiveFilter] = useState<FilterStatus>("all");
  
  // Apply filtering when activeFilter changes
  useEffect(() => {
    const now = new Date();
    
    // Get all event elements
    const eventElements = document.querySelectorAll('[data-event-id]');
    
    // First remove filter-hidden class from all events
    eventElements.forEach(element => {
      element.classList.remove('filter-hidden');
    });
    
    // Then add filter-hidden class to events that don't match the filter
    if (activeFilter !== "all") {
      events.forEach(event => {
        const element = document.querySelector(`[data-event-id="${event.id}"]`);
        if (!element) return;
        
        const isUpcoming = event.start_date > now;
        const isOngoing = event.start_date <= now && event.end_date >= now;
        const isEnded = event.end_date < now;
        
        let shouldShow = false;
        
        if (activeFilter === "upcoming" && isUpcoming) shouldShow = true;
        else if (activeFilter === "ongoing" && isOngoing) shouldShow = true;
        else if (activeFilter === "ended" && isEnded) shouldShow = true;
        
        if (!shouldShow) {
          element.classList.add('filter-hidden');
          (element as HTMLElement).style.display = 'none';
        } else {
          (element as HTMLElement).style.display = 'block';
        }
      });
    } else {
      // Show all events if filter is "all"
      eventElements.forEach(element => {
        (element as HTMLElement).style.display = 'block';
      });
    }
  }, [activeFilter, events]);
  
  return (
    <div className="space-y-4">
      {/* Search Box */}
      <EventsSearch events={events} />
      
      {/* Filter Pills */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-gray-700">Filter:</span>
        
        {/* Status Filter Pills */}
        <div className="flex overflow-x-auto">
          <button 
            onClick={() => setActiveFilter("all")}
            className={`mr-1 whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium sm:text-sm ${
              activeFilter === "all" 
                ? "bg-indigo-100 text-indigo-700" 
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            All
          </button>
          <button 
            onClick={() => setActiveFilter("upcoming")}
            className={`mr-1 whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium sm:text-sm ${
              activeFilter === "upcoming" 
                ? "bg-indigo-100 text-indigo-700" 
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            Upcoming
          </button>
          <button 
            onClick={() => setActiveFilter("ongoing")}
            className={`mr-1 whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium sm:text-sm ${
              activeFilter === "ongoing" 
                ? "bg-indigo-100 text-indigo-700" 
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            Ongoing
          </button>
          <button 
            onClick={() => setActiveFilter("ended")}
            className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium sm:text-sm ${
              activeFilter === "ended" 
                ? "bg-indigo-100 text-indigo-700" 
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            Ended
          </button>
        </div>
      </div>
    </div>
  );
}
