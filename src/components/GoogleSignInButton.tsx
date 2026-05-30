"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { Spinner } from "@nextui-org/spinner";

/**
 * Google "Continue with Google" button.
 *
 * Wires NextAuth's GoogleProvider. After the OAuth dance, the signIn callback
 * in src/lib/auth.ts forwards the Google id_token to the Go backend, which
 * either logs the user in, links Google to an existing email/password account,
 * or creates a fresh row.
 *
 * After successful sign-in:
 *  - new student@president.ac.id user → needs_completion=true → /auth/complete-profile
 *  - everyone else                    → /dashboard
 *
 * We can't directly read needs_completion from signIn() (it returns only
 * ok/error), so the dashboard layout checks it and bounces accordingly.
 * For a snappier UX we set callbackUrl to /auth/post-google which decides.
 */
export default function GoogleSignInButton({
    label = "Continue with Google",
    callbackUrl = "/auth/post-google",
}: {
    label?: string;
    callbackUrl?: string;
}) {
    const [loading, setLoading] = useState(false);

    const handleClick = async () => {
        setLoading(true);
        // redirect: true → NextAuth handles the full OAuth round-trip and
        // navigates to callbackUrl when done. Errors land on /auth/signin?error=…
        await signIn("google", { callbackUrl });
    };

    return (
        <button
            type="button"
            onClick={handleClick}
            disabled={loading}
            className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
        >
            {loading ? (
                <Spinner size="sm" />
            ) : (
                // Official Google "G" logo (inline SVG so we don't depend on a static asset)
                <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
                    <path
                        d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
                        fill="#4285F4"
                    />
                    <path
                        d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
                        fill="#34A853"
                    />
                    <path
                        d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.96H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.04l3.007-2.333z"
                        fill="#FBBC05"
                    />
                    <path
                        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.96l3.007 2.333C4.672 5.166 6.656 3.58 9 3.58z"
                        fill="#EA4335"
                    />
                </svg>
            )}
            <span>{label}</span>
        </button>
    );
}
