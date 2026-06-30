import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import axios from "axios";
import { BASE_URL } from "@/config/config";

export async function POST() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // [MOCK] Bypass if mock mode is active
  if (process.env.NEXT_PUBLIC_MOCK_COMPREGEN === "true") {
    const mockToken = `mock-token-${Date.now()}`;
    return NextResponse.json({
      token: mockToken,
      url: `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/compregen/cp-vcp/${mockToken}`,
    }, { status: 201 });
  }

  try {
    const adminApiKey = process.env.COMPREGEN_ADMIN_API_KEY || process.env.ADMIN_API_KEY || "";
    const response = await axios.post(
      `${BASE_URL}/compregen/admin/links`,
      {},
      {
        headers: {
          "X-Admin-Api-Key": adminApiKey,
          Accept: "application/json",
        },
      }
    );
    return NextResponse.json(response.data, { status: 201 });
  } catch (error: any) {
    console.error("[API Proxy] Error generating invite link:", error.message);
    const status = error.response?.status || 500;
    const data = error.response?.data || { error: "Failed to generate invite link from backend" };
    return NextResponse.json(data, { status });
  }
}
