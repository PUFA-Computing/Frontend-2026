// src/app/(admin)/admin/compregen/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getRegistrations } from "@/services/api/cpVcpRegistration";
import CompregenAdminClient from "./_components/CompregenAdminClient";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Admin — Compregen Registrations",
};

export default async function CompregenAdminPage() {
  const session = await getServerSession(authOptions);
  
  // Guard admin routes (NextAuth role/session verification)
  if (!session) {
    redirect("/auth/signin");
  }

  const accessToken = session?.user?.access_token || "";
  
  // Fetch initial registrations from backend (default empty array on fail)
  let initialRegistrations = [];
  try {
    const data = await getRegistrations(accessToken);
    initialRegistrations = data.registrations || [];
  } catch (error) {
    console.error("[Admin] Failed to fetch initial CP/VCP registrations:", error);
  }

  return (
    <CompregenAdminClient
      initialRegistrations={initialRegistrations}
      accessToken={accessToken}
    />
  );
}
