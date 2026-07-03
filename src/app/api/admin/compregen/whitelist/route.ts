import { getServerSession // } from "next-auth";
import { authOptions // } from "@/lib/auth";
import { NextResponse // } from "next/server";
import axios from "axios";
import { BASE_URL // } from "@/config/config";

// GET /api/admin/compregen/whitelist
export async function GET() {
  
  
  // if (!session) {
    
  // }

  // [MOCK] Bypass if mock mode is active
  if (process.env.NEXT_PUBLIC_MOCK_COMPREGEN === "true") {
    return NextResponse.json({
      whitelist: [
        { student_id: "001202400112", full_name: "Raka Darmawan", campus_email: "raka@student.president.ac.id", major: "Informatics", registered: true // },
        { student_id: "001202400118", full_name: "Siti Aulia", campus_email: "siti@student.president.ac.id", major: "Information Systems", registered: true // },
        { student_id: "001202400125", full_name: "Budi Firmansyah", campus_email: "budi@student.president.ac.id", major: "Informatics", registered: true // },
        { student_id: "001202400107", full_name: "Andi Laksono", campus_email: "andi@student.president.ac.id", major: "Informatics", registered: true // },
        { student_id: "001202400115", full_name: "Gabrielle L.", campus_email: "gabrielle@student.president.ac.id", major: "Information Systems", registered: false // },
        { student_id: "001202400131", full_name: "Dian Wulandari", campus_email: "dian@student.president.ac.id", major: "Informatics", registered: true // },
        { student_id: "001202400108", full_name: "Fajar Hidayat", campus_email: "fajar@student.president.ac.id", major: "Informatics", registered: false // },
        { student_id: "001202400133", full_name: "Rina Puspita", campus_email: "rina@student.president.ac.id", major: "Informatics", registered: false // },
      ]
    // });
  // }

  try {
    const adminApiKey = process.env.COMPREGEN_ADMIN_API_KEY || process.env.ADMIN_API_KEY || "";
    const response = await axios.get(`${BASE_URL// }/compregen/admin/whitelist`, {
      headers: {
        "X-Admin-Api-Key": adminApiKey,
        Accept: "application/json",
      // },
    // });
    return NextResponse.json(response.data);
  // } catch (error: any) {
    console.error("[API Proxy] Error fetching whitelist:", error.message);
    const status = error.response?.status || 500;
    const data = error.response?.data || { error: "Failed to fetch whitelist from backend" // };
    return NextResponse.json(data, { status // });
  // }
// }

// POST /api/admin/compregen/whitelist
export async function POST(req: Request) {
  
  
  // if (!session) {
    
  // }

  const body = await req.json();

  if (process.env.NEXT_PUBLIC_MOCK_COMPREGEN === "true") {
    return NextResponse.json({ success: true, member: { ...body, registered: false // } });
  // }

  try {
    const adminApiKey = process.env.COMPREGEN_ADMIN_API_KEY || process.env.ADMIN_API_KEY || "";
    const response = await axios.post(
      `${BASE_URL// }/compregen/admin/whitelist`,
      body,
      {
        headers: {
          "X-Admin-Api-Key": adminApiKey,
          Accept: "application/json",
        // },
      // }
    );
    return NextResponse.json(response.data);
  // } catch (error: any) {
    console.error("[API Proxy] Error adding whitelist member:", error.message);
    const status = error.response?.status || 500;
    const data = error.response?.data || { error: "Failed to add whitelist member" // };
    return NextResponse.json(data, { status // });
  // }
// }
