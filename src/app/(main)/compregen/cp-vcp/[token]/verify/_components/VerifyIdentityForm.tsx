// src/app/(main)/compregen/cp-vcp/[token]/verify/_components/VerifyIdentityForm.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { verifyIdentity } from "@/services/api/cpVcpRegistration";
import AttemptCounter from "@/components/compregen/AttemptCounter";
import { AlertCircle, ArrowRight } from "lucide-react";

interface Props {
  token: string;
}

export default function VerifyIdentityForm({ token }: Props) {
  const [studentId, setStudentId] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Rate limiting / Lockout states
  const [attemptsRemaining, setAttemptsRemaining] = useState(5);
  const [errorMsg, setErrorMsg] = useState("");
  const [isLockedOut, setIsLockedOut] = useState(false);
  const [notEligible, setNotEligible] = useState(false);
  
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLockedOut) return;

    setErrorMsg("");
    setNotEligible(false);

    // Simple validation
    if (!studentId.trim()) {
      setErrorMsg("Student ID is required.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setErrorMsg("Please enter a valid campus email address.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await verifyIdentity(token, studentId.trim(), email.trim().toLowerCase());

      if (res.verified) {
        // Successful verification set the cookie backend-side. Go to form.
        router.push(`/compregen/cp-vcp/${token}/form`);
      } else {
        // Not eligible or mismatch
        setNotEligible(true);
        const remaining = res.attempts_remaining ?? (attemptsRemaining - 1);
        setAttemptsRemaining(remaining);

        if (res.reason === "not_in_whitelist") {
          setErrorMsg("This Student ID is not registered in the Compregen eligibility whitelist.");
        } else if (res.reason === "email_mismatch") {
          setErrorMsg("The email address provided does not match the Student ID on our whitelist.");
        } else {
          setErrorMsg(res.error || "Verification failed. Please check your credentials.");
        }

        if (remaining <= 0 || res.error === "rate_limited") {
          setIsLockedOut(true);
          setErrorMsg("You have exhausted all 5 verification attempts. This link is locked out.");
        }
      }
    } catch (err: any) {
      setErrorMsg("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Error alert banner */}
      {errorMsg && (
        <div className="flex gap-2.5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-600" />
          <div>
            <p className="font-semibold">Verification Failed</p>
            <p className="mt-0.5 leading-relaxed">{errorMsg}</p>
          </div>
        </div>
      )}

      {/* Student ID field */}
      <div className="space-y-1.5">
        <label
          htmlFor="verify-student-id"
          className="text-xs font-bold uppercase tracking-wider text-gray-500"
        >
          Student ID
        </label>
        <Input
          id="verify-student-id"
          type="text"
          placeholder="e.g. 001202300050"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          disabled={isLoading || isLockedOut}
          className={`h-11 w-full bg-white text-gray-900 border ${
            notEligible ? "border-red-400 focus-visible:ring-red-400" : "border-gray-300"
          }`}
        />
      </div>

      {/* Campus Email field */}
      <div className="space-y-1.5">
        <label
          htmlFor="verify-email"
          className="text-xs font-bold uppercase tracking-wider text-gray-500"
        >
          Campus Email Address
        </label>
        <Input
          id="verify-email"
          type="email"
          placeholder="e.g. name@student.president.ac.id"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading || isLockedOut}
          className={`h-11 w-full bg-white text-gray-900 border ${
            notEligible ? "border-red-400 focus-visible:ring-red-400" : "border-gray-300"
          }`}
        />
      </div>

      {/* Rate limit counter display (always visible to guide UX) */}
      <div className="pt-2">
        <AttemptCounter attemptsRemaining={attemptsRemaining} />
      </div>

      {/* Action Submit Button */}
      <Button
        id="verify-submit"
        type="submit"
        disabled={isLoading || isLockedOut}
        className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold transition active:scale-98 shadow-md disabled:bg-gray-400"
        style={{ backgroundColor: isLockedOut ? "#9ca3af" : "#2563eb", color: "#ffffff" }}
      >
        {isLoading ? (
          "Verifying..."
        ) : isLockedOut ? (
          "Form Locked"
        ) : notEligible ? (
          <span className="flex items-center justify-center gap-1.5">
            Try again <ArrowRight className="h-4 w-4" />
          </span>
        ) : (
          <span className="flex items-center justify-center gap-1.5">
            Verify Identity <ArrowRight className="h-4 w-4" />
          </span>
        )}
      </Button>
    </form>
  );
}
