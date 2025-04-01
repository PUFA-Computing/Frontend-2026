import EventCard from "@/components/event/EventCard";
import BGImage from "@/assets/backgroundimg.svg";

const eventData = [
    {
        title: "Hackathon",
        description: "Competition for students to develop innovative solutions to real-world problems.",
        image: BGImage,
        link: "/events/hackathon"
    },
    {
        title: "PUFA Computing Regeneration 2025",
        description: "[PUFA COMPUTING REGENERATION 2025 OPEN REGISTRATION] What's up, PUFA Computing! It's finally here...",
        image: BGImage,
        link: "/events/regeneration-2025"
    },
    {
        title: "Tech Talk: AI in Healthcare",
        description: "Learn about the latest applications of AI in the healthcare industry.",
        image: BGImage,
        link: "/events/tech-talk-ai-healthcare"
    }
];

export default function EventCards() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {eventData.map((event, index) => (
                <EventCard
                    key={index}
                    {...event}
                />
            ))}
        </div>
    );
}