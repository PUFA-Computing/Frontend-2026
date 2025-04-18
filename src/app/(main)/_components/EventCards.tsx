import EventCard from "@/components/event/EventCard";
import BGImage from "@/assets/backgroundimg.svg";
import { fetchEvents } from "@/services/api/event";
import { Suspense } from "react";
import { CircularProgress } from "@/components/ui/CircularProgress";

async function EventsDisplay() {
    // Fetch real events data from the API
    const events = await fetchEvents();

    // Sort events by start_date (newest first)
    const sortedEvents = events.sort((a, b) => {
        return new Date(b.start_date).getTime() - new Date(a.start_date).getTime();
    });

    // Take only the first 3 events to display
    const limitedEvents = sortedEvents.slice(0, 3);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {limitedEvents.map((event) => (
                <EventCard
                    key={event.id}
                    title={event.title}
                    description={event.description.length > 100 ? `${event.description.substring(0, 100)}...` : event.description}
                    image={event.thumbnail || BGImage}
                    link={`/events/${event.slug}`}
                />
            ))}
        </div>
    );
}

export default function EventCards() {
    return (
        <Suspense fallback={
            <div className="flex justify-center items-center h-64">
                <CircularProgress />
            </div>
        }>
            <EventsDisplay />
        </Suspense>
    );
}