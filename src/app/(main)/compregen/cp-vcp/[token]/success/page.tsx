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
              Your cabinet details and trio profiles have been saved successfully. The admin team will review your photos and eligibility.
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
