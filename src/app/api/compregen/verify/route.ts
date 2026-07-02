import { NextResponse } from "next/server";
import axios from "axios";
import { BASE_URL } from "@/config/config";

export async function POST(request: Request) {
  const body = await request.json();
  
  try {
    const response = await axios.post(`${BASE_URL}/compregen/verify`, body, {
      headers: { "Content-Type": "application/json" },
    });
    
    const res = NextResponse.json(response.data);
    
    if (response.data.verified) {
      res.cookies.set("compregen_session", `verified:${body.token}`, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        path: "/",
        maxAge: 3600,
      });
    }
    
    return res;
  } catch (error: any) {
    const status = error.response?.status || 500;
    const data = error.response?.data || { error: "Verification failed" };
    return NextResponse.json(data, { status });
  }
}