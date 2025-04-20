import { fetchEvents } from "@/services/api/event";
import { fetchNews } from "@/services/api/news";
import { fetchAspirations } from "@/services/api/aspiration";
import { GetAllUsers } from "@/services/api/user";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import StatisticCard from "@/components/admin/statistic/StatisticCard";
import EventsStatistics from "@/components/admin/statistic/EventsStatistics";
import NewsStatistics from "@/components/admin/statistic/NewsStatistics";
import UsersStatistics from "@/components/admin/statistic/UsersStatistics";
import AspirationsStatistics from "@/components/admin/statistic/AspirationsStatistics";

export default async function AdminIndex() {
    const session = await getServerSession(authOptions);
    const accessToken = session?.user?.access_token || "";
    
    // Fetch data for statistics
    const events = await fetchEvents().catch(() => []);
    const news = await fetchNews().catch(() => []);
    const aspirations = await fetchAspirations().catch(() => []);
    const users = await GetAllUsers(accessToken).catch(() => []);

    // Calculate summary statistics
    const totalEvents = events.length;
    const totalNews = news.length;
    const totalAspirations = aspirations.length;
    const totalUsers = users.length;
    
    // Calculate active events (events that haven't ended yet)
    const activeEvents = events.filter(event => new Date(event.end_date) > new Date()).length;
    
    // Calculate total registered users across all events
    const totalRegistrations = events.reduce((sum, event) => sum + (event.registered_count || 0), 0);
    
    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-8">Admin Dashboard Statistics</h1>
            
            {/* Summary Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatisticCard 
                    title="Total Events" 
                    value={totalEvents} 
                    icon="📅" 
                    color="bg-blue-500" 
                    description={`${activeEvents} active events`}
                />
                <StatisticCard 
                    title="Total News" 
                    value={totalNews} 
                    icon="📰" 
                    color="bg-green-500" 
                    description="Published articles"
                />
                <StatisticCard 
                    title="Total Users" 
                    value={totalUsers} 
                    icon="👥" 
                    color="bg-purple-500" 
                    description="Registered accounts"
                />
                <StatisticCard 
                    title="Total Aspirations" 
                    value={totalAspirations} 
                    icon="💬" 
                    color="bg-amber-500" 
                    description="Community feedback"
                />
            </div>
            
            {/* Detailed Statistics Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <EventsStatistics events={events} />
                <UsersStatistics users={users} events={events} />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <NewsStatistics news={news} />
                <AspirationsStatistics aspirations={aspirations} />
            </div>
        </div>
    );
}
