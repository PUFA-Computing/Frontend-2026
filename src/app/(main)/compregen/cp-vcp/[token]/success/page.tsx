// src/app/(main)/compregen/cp-vcp/[token]/success/page.tsx
import React from "react";
import Link from "next/link";
import CompregenLogoHeader from "@/components/compregen/CompregenLogoHeader";
import { CheckCircle, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SuccessPage() {
  return (
    <div
      className="bg-cover bg-center min-h-screen flex items-center justify-center py-10 px-4 md:px-6"
      style={{ backgroundImage: `url('/doodle.svg')` }}
    >
      <div className="w-full max-w-xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-8 flex flex-col gap-6 items-center text-center">
          
          <CompregenLogoHeader 
            title="Hello, Computizens!" 
            subtitle="Registration Submitted"
          />

          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 my-2 shadow-[0_0_15px_rgba(16,185,129,0.25)]">
            <CheckCircle className="h-10 w-10 animate-bounce" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-bold text-gray-900">Success!</h2>
            <p className="text-sm text-gray-500 leading-relaxed max-w-sm">
              Your cabinet details and profiles have been saved successfully. The admin team will review your photos and eligibility.
            </p>
          </div>

          {/* WhatsApp Group Invite */}
          <div className="w-full p-5 bg-emerald-50/50 border border-emerald-100 rounded-2xl flex flex-col items-center gap-2.5 my-1">
            <div className="text-emerald-800 text-sm font-bold flex items-center gap-2">
              <svg className="h-5 w-5 fill-emerald-600" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 0 0 1.333 4.982L2 22l5.233-1.372a9.948 9.948 0 0 0 4.777 1.22c5.508 0 9.99-4.479 9.993-9.986 0-2.668-1.037-5.176-2.923-7.062A9.92 9.92 0 0 0 12.012 2zm4.957 14.123c-.272.766-1.578 1.4-2.146 1.48-.49.07-1.127.08-3.238-.79-2.696-1.11-4.437-3.86-4.572-4.042-.134-.182-1.09-1.45-1.09-2.767 0-1.317.674-1.962.914-2.224.24-.263.53-.329.706-.329.177 0 .354.002.508.01.164.007.385-.062.602.464.224.542.766 1.868.83 2.001.065.13.109.284.022.46-.088.176-.131.285-.262.438-.13.153-.274.342-.392.459-.13.13-.267.273-.114.537.153.263.68 1.122 1.458 1.815.998.892 1.838 1.168 2.099 1.299.262.13.416.11.57-.066.153-.175.656-.766.83-.984.175-.219.35-.184.59-.096.24.088 1.52.717 1.783.849.263.13.438.197.504.307.066.11.066.634-.206 1.4z" />
              </svg>
              Join Candidate WhatsApp Group
            </div>
            <p className="text-xs text-gray-500 max-w-sm leading-relaxed">
              Please join the official WhatsApp coordinator group for CP & VCP candidates to receive further schedules and coordination details.
            </p>
            <a 
              href="https://chat.whatsapp.com/invite/compregen2027" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-full block"
            >
              <Button className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex items-center justify-center gap-1.5 shadow-md">
                Join Group Chat
              </Button>
            </a>
          </div>

          <div className="w-full pt-4 border-t border-gray-100">
            <Link href="/" passHref className="w-full block">
              <Button className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center justify-center gap-1.5 shadow-md">
                <Home className="h-4 w-4" /> Back to Homepage
              </Button>
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
