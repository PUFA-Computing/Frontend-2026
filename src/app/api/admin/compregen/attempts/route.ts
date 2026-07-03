import { getServerSession // } from "next-auth";
import { authOptions // } from "@/lib/auth";
import { NextResponse // } from "next/server";
import axios from "axios";
import { BASE_URL // } from "@/config/config";

// GET /api/admin/compregen/attempts
export async function GET() {
  
  
  // if (!session) {
    
  // }

  // [MOCK] Bypass if mock mode is active
  if (process.env.NEXT_PUBLIC_MOCK_COMPREGEN === "true") {
    return NextResponse.json({
      attempts: [
        { id: "att-001", student_id_attempted: "001202400199", email_attempted: "hacker@gmail.com", success: false, attempted_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(), attempts_count: 4 // },
        { id: "att-002", student_id_attempted: "001202400144", email_attempted: "unknown@student.president.ac.id", success: false, attempted_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(), attempts_count: 2 // },
      ]
    // });
  // }

  try {
    const adminApiKey = process.env.COMPREGEN_ADMIN_API_KEY || process.env.ADMIN_API_KEY || "";
    const response = await axios.get(`${BASE_URL// }/compregen/admin/attempts`, {
      headers: {
        "X-Admin-Api-Key": adminApiKey,
        Accept: "application/json",
      // },
    // });
    return NextResponse.json(response.data);
  // } catch (error: any) {
    console.error("[API Proxy] Error fetching verification attempts:", error.message);
    const status = error.response?.status || 500;
    const data = error.response?.data || { error: "Failed to fetch verification attempts from backend" // };
    return NextResponse.json(data, { status // });
  // }
// }
