// src/app/(main)/compregen/cp-vcp/[token]/form/page.tsx
import React from "react";
import CompregenLogoHeader from "@/components/compregen/CompregenLogoHeader";
import RegistrationForm from "./_components/RegistrationForm";

interface Props {
  params: {
    token: string;
  };
}

export default function RegistrationFormPage({ params }: Props) {
  const { token } = params;

  return (
    <div
      className="bg-cover bg-center min-h-screen py-10 px-4 md:px-6"
      style={{ backgroundImage: `url('/doodle.svg')` }}
    >
      <div className="w-full max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 md:p-8 flex flex-col gap-6">
          
          {/* Welcoming Header */}
          <CompregenLogoHeader 
            title="Hello, Computizens!" 
            subtitle="CP & VCP Trio Registration Form"
          />

          {/* Form Container */}
          <div className="mt-2">
            <RegistrationForm token={token} />
          </div>

        </div>
      </div>
    </div>
  );
}
