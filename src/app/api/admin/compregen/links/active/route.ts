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

  if (process.env.NEXT_PUBLIC_MOCK_COMPREGEN === "true") {
    return NextResponse.json({
      token: "mock-token-active",
      url: `http://localhost:3000/compregen/cp-vcp/mock-token-active`,
      status: "active"
    });
  }

  try {
    const adminApiKey = process.env.COMPREGEN_ADMIN_API_KEY || process.env.ADMIN_API_KEY || "";
    const response = await axios.get(
      `${BASE_URL}/compregen/admin/links/active`,
      {
        headers: {
          "X-Admin-Api-Key": adminApiKey,
          Accept: "application/json",
        },
      }
    );
    return NextResponse.json(response.data);
  } catch (error: any) {
    const status = error.response?.status || 404;
    const data = error.response?.data || { error: "No active link found" };
    return NextResponse.json(data, { status });
  }
}