import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { fetchCandidates } from "@/services/api/candidate";
import VoteDashboardClient from "./_components/VoteDashboardClient";

export default async function AdminVotesPage() {
  const session = await getServerSession(authOptions);
  const accessToken = session?.user?.access_token || "";

  // Fetch initial candidates data
  const candidates = await fetchCandidates();

  return <VoteDashboardClient initialCandidates={candidates} accessToken={accessToken} />;
}
