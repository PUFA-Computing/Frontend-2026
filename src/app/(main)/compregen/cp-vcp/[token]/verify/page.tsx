// src/app/(main)/compregen/cp-vcp/[token]/verify/page.tsx
import React from "react";
import CompregenLogoHeader from "@/components/compregen/CompregenLogoHeader";
import VerifyIdentityForm from "./_components/VerifyIdentityForm";

interface Props {
  params: Promise<{
    token: string;
  }>;
}

export default async function VerifyIdentityPage({ params }: Props) {
  const { token } = await params;

  return (
    <div
      className="bg-cover bg-center min-h-screen flex items-center justify-center py-10 px-4 md:px-6"
      style={{ backgroundImage: `url('/doodle.svg')` }}
    >
      {/* Maximum width container matching signin page constraint but flexible */}
      <div className="w-full max-w-xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 md:p-8 flex flex-col gap-6">
          
          {/* Welcoming Header */}
          <CompregenLogoHeader 
            title="Hello, Computizens!" 
            subtitle="CP & VCP Registration — Identity Verification"
          />

          {/* Form container */}
          <div className="pt-2">
            <VerifyIdentityForm token={token} />
          </div>

        </div>
      </div>
    </div>
  );
}
