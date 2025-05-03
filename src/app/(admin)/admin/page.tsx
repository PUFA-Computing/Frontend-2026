import { fetchEvents } from "@/services/api/event";
import { fetchNews } from "@/services/api/news";
import { fetchAspirations } from "@/services/api/aspiration";
import { GetAllUsers } from "@/services/api/user";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import AdminDashboardClient from "@/components/admin/dashboard/AdminDashboardClient";

export default async function AdminDashboardPage() {
    const session = await getServerSession(authOptions);
    const accessToken = session?.user?.access_token || "";
    
    // Fetch data for statistics
    const events = await fetchEvents().catch(() => []);
    const news = await fetchNews().catch(() => []);
    const aspirations = await fetchAspirations().catch(() => []);
    const users = await GetAllUsers(accessToken).catch(() => []);
    
    return <AdminDashboardClient events={events} news={news} aspirations={aspirations} users={users} />;
}
