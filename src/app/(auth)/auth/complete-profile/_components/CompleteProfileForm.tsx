"use client";

import { useState, useCallback } from "react";
import { Spinner } from "@nextui-org/spinner";
import Swal from "sweetalert2";
import { BASE_URL } from "@/config/config";
import { signOut } from "next-auth/react";

const MAJOR_LABELS: Record<string, string> = {
    "001": "Informatics",
    "012": "Information System",
    "013": "Visual Communication Design",
    "025": "Interior Design",
};

const CS_PREFIXES = ["001", "012", "013", "025"];
const studentIdRegex = /^[0-9]{12}$/;

/**
 * Form rendered to a fresh Google sign-up whose email is
 * @student.president.ac.id but who hasn't entered their Student ID yet.
 *
 * The Student ID prefix determines the final role:
 *   - 001 / 012 / 013 / 025 → Computizen (full access)
 *   - anything else        → Guest (read-only)
 *
 * Submitting calls POST /auth/google/complete with the backend JWT we got
 * during the Google sign-in.
 */
export default function CompleteProfileForm({
    email,
    accessToken,
    firstName,
}: {
    email: string;
    accessToken: string;
    firstName?: string;
}) {
    const [studentId, setStudentId] = useState("");
    const [year, setYear] = useState("");
    const [detectedMajor, setDetectedMajor] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const onStudentIdChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const v = e.target.value.replace(/\D/g, "").slice(0, 12);
        setStudentId(v);
        setDetectedMajor(MAJOR_LABELS[v.slice(0, 3)] ?? "");
        setError("");
    }, []);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!studentIdRegex.test(studentId)) {
            setError("Student ID must be exactly 12 digits.");
            return;
        }
        const yearNum = Number(year);
        if (!year || isNaN(yearNum) || yearNum < 2010 || yearNum > 2099) {
            setError("Enter a valid batch year (e.g. 2023).");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`${BASE_URL}/auth/google/complete`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({ student_id: studentId, year }),
            });
            const body = await res.json();
            if (!res.ok || !body.success) {
                setError(body.message || "Could not save your profile.");
                return;
            }

            const isGuest = !CS_PREFIXES.includes(studentId.slice(0, 3));

            await Swal.fire({
                icon: isGuest ? "info" : "success",
                title: isGuest ? "Welcome, Guest!" : "All set!",
                html: isGuest
                    ? `<p style="margin:0 0 8px">Your major is not part of the Faculty of Computer Science.</p>
                       <p style="color:#6b7280;font-size:0.9rem">You can still browse events and news, but features like voting are limited to Computizens.</p>`
                    : `<p style="margin:0 0 8px">Welcome, <strong>${firstName ?? "Computizen"}</strong>!</p>
                       <p style="color:#6b7280;font-size:0.9rem">Your account is now a full Computizen account.</p>`,
                confirmButtonText: "Continue",
                confirmButtonColor: "#3b82f6",
            });

            // Force a session refresh so the JWT picks up the new role_id.
            // The simplest reliable way is a full reload to /dashboard.
            window.location.href = "/dashboard";
        } catch (err) {
            console.error(err);
            setError("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="mx-auto max-w-xl rounded-xl bg-white bg-opacity-90 p-6 shadow-md backdrop-blur-sm">
            <h1 className="text-xl font-semibold text-[#353535]">One more step</h1>
            <p className="mt-1 text-sm text-gray-600">
                Signed in as <strong>{email}</strong>. Tell us your Student ID so we can
                give you the right access level.
            </p>

            <form onSubmit={onSubmit} className="mt-6 space-y-4" noValidate>
                <div>
                    <div className="relative">
                        <input
                            type="text"
                            inputMode="numeric"
                            value={studentId}
                            onChange={onStudentIdChange}
                            maxLength={12}
                            placeholder="Student ID (12 digits)"
                            className="block w-full rounded-lg border bg-white px-5 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
                            required
                        />
                        {detectedMajor && (
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-600">
                                {detectedMajor}
                            </span>
                        )}
                    </div>
                    <p className="mt-1 text-xs text-gray-400">
                        Format: [major 3 digits][batch 4 digits][id 5 digits]
                    </p>
                </div>

                <input
                    type="number"
                    value={year}
                    onChange={(e) => {
                        setYear(e.target.value);
                        setError("");
                    }}
                    min={2010}
                    max={2099}
                    placeholder="Batch Year (e.g. 2023)"
                    className="block w-full rounded-lg border bg-white px-5 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    required
                />

                {error && (
                    <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition hover:bg-blue-600 active:scale-95 disabled:opacity-60"
                >
                    {loading ? (
                        <span className="flex items-center justify-center gap-2">
                            <Spinner size="sm" color="white" /> Saving…
                        </span>
                    ) : (
                        "Finish setup"
                    )}
                </button>

                <button
                    type="button"
                    onClick={() => signOut({ callbackUrl: "/auth/signin" })}
                    className="w-full text-center text-xs text-gray-400 hover:underline"
                >
                    Use a different account
                </button>
            </form>
        </section>
    );
}
