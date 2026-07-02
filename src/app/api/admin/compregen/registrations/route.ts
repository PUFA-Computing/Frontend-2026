import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import axios from "axios";
import { BASE_URL } from "@/config/config";

export async function GET() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // [MOCK] Bypass if mock mode is active
  if (process.env.NEXT_PUBLIC_MOCK_COMPREGEN === "true") {
    return NextResponse.json({
      registrations: [
        {
          id: "mock-reg-001",
          cabinet_name: "Synergy Cabinet",
          submitted_at: new Date().toISOString(),
          members: {
            cp:   { full_name: "Budi Santoso",  student_id: "001202300001", major: "Informatics",       phone_number: "081234567890", nationality: "Indonesian", photo_upload_id: "" },
            vcp1: { full_name: "Dewi Rahayu",   student_id: "001202300002", major: "Information System", phone_number: "081234567891", nationality: "Indonesian", photo_upload_id: "" },
            vcp2: { full_name: "Andi Wijaya",   student_id: "001202300003", major: "Informatics",       phone_number: "081234567892", nationality: "Indonesian", photo_upload_id: "" },
          },
        },
      ],
    });
  }

  try {
    const adminApiKey = process.env.COMPREGEN_ADMIN_API_KEY || process.env.ADMIN_API_KEY || "";
    const response = await axios.get(`${BASE_URL}/compregen/admin/registrations`, {
      headers: {
        "X-Admin-Api-Key": adminApiKey,
        Accept: "application/json",
      },
    });
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("[API Proxy] Error fetching registrations:", error.message);
    const status = error.response?.status || 500;
    const data = error.response?.data || { error: "Failed to fetch registrations from backend" };
    return NextResponse.json(data, { status });
  }
}
