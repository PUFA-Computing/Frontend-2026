// src/app/(main)/compregen/cp-vcp/[token]/invalid/page.tsx
import React from "react";
import Link from "next/link";
import CompregenLogoHeader from "@/components/compregen/CompregenLogoHeader";
import { AlertOctagon, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function InvalidTokenPage() {
  return (
    <div
      className="bg-cover bg-center min-h-screen flex items-center justify-center py-10 px-4 md:px-6"
      style={{ backgroundImage: `url('/doodle.svg')` }}
    >
      <div className="w-full max-w-xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-8 flex flex-col gap-6 items-center text-center">
          
          <CompregenLogoHeader 
            title="Hello, Computizens!" 
            subtitle="Link Invalid"
          />

          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 text-amber-600 my-2 shadow-[0_0_15px_rgba(245,158,11,0.25)]">
            <AlertOctagon className="h-10 w-10 text-amber-500" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-bold text-gray-900">Invalid or Expired Invite</h2>
            <p className="text-sm text-gray-500 leading-relaxed max-w-sm">
              This invite link is invalid, has expired, or has already been used to complete a registration.
            </p>
            <p className="text-xs text-gray-400 max-w-sm mt-1">
              If you believe this is an error, please contact your department administrator.
            </p>
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
