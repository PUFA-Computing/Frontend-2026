import { NextResponse  } from "next/server";
import axios from "axios";
import { BASE_URL  } from "@/config/config";

export async function GET() {
   // [MOCK] Bypass if mock mode is active
  if (process.env.NEXT_PUBLIC_MOCK_COMPREGEN === "true") {
    return NextResponse.json({
      registrations: [
        {
          id: "mock-reg-001",
          submitted_at: new Date().toISOString(),
          members: {
            cp:   { full_name: "Arka Pradipa Dwi Santoso",  student_id: "001202400020", major: "Informatics",       phone_number: "081234567890", nationality: "Indonesian", photo_upload_id: ""  },
            vcp1: { full_name: "Arka Pradipa Dwi Santoso",   student_id: "001202400020", major: "Information System", phone_number: "081234567891", nationality: "Indonesian", photo_upload_id: ""  },
            vcp2: { full_name: "Arka Pradipa Dwi Santoso",   student_id: "001202400020", major: "Informatics",       phone_number: "081234567892", nationality: "Indonesian", photo_upload_id: ""  },
           },
         },
      ],
     });
   }

  try {
    const adminApiKey = process.env.COMPREGEN_ADMIN_API_KEY || process.env.ADMIN_API_KEY || "";
    const response = await axios.get(`${BASE_URL }/compregen/admin/registrations`, {
      headers: {
        "X-Admin-Api-Key": adminApiKey,
        Accept: "application/json",
       },
     });
    return NextResponse.json(response.data);
   } catch (error: any) {
    console.error("[API Proxy] Error fetching registrations:", error.message);
    const status = error.response?.status || 500;
    const data = error.response?.data || { error: "Failed to fetch registrations from backend"  };
    return NextResponse.json(data, { status  });
   }
 }
