"use client";
import React, { useState } from "react";
import Swal from "sweetalert2";
import Link from "next/link";
import { Spinner } from "@nextui-org/spinner";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Eye, EyeOff } from "lucide-react";

// ─── Error map ─────────────────────────────────────────────────────────────────
// Maps raw backend messages to user-friendly copy
const friendlyError = (raw: string): string => {
    const r = raw.toLowerCase();
    if (r.includes("invalid credentials") || r.includes("invalid credentials"))
        return "Incorrect email/username or password. Please try again.";
    if (r.includes("two factor"))
        return "Two-Factor Authentication is required.";
    if (r.includes("not found"))
        return "No account found with that email or username.";
    if (r.includes("network") || r.includes("fetch"))
        return "Network error — please check your connection.";
    return raw || "Login failed. Please try again.";
};

// ─── Component ─────────────────────────────────────────────────────────────────
export default function LoginForm() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPwd, setShowPwd] = useState(false);
    const [fieldError, setFieldError] = useState<{ username?: string; password?: string }>({});
    const [globalError, setGlobalError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    // ── Inline validation ──────────────────────────────────────────────────────
    const validate = (): boolean => {
        const errors: typeof fieldError = {};
        if (!username.trim()) errors.username = "Email or username is required.";
        if (!password) errors.password = "Password is required.";
        setFieldError(errors);
        return Object.keys(errors).length === 0;
    };

    // ── Submit ─────────────────────────────────────────────────────────────────
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setGlobalError("");

        if (!validate()) return;

        setIsLoading(true);

        try {
            const res = await signIn("credentials", {
                username: username.trim().toLowerCase(),
                password,
                redirect: false,
            });

            if (!res) {
                setGlobalError("Something went wrong. Please try again.");
                return;
            }

            if (res.error) {
                // 2FA redirect
                if (res.error.includes("Two Factor Authentication Required")) {
                    sessionStorage.setItem("username", username);
                    sessionStorage.setItem("password", password);
                    router.push("/auth/verify-2fa");
                    return;
                }

                const msg = friendlyError(res.error);
                setGlobalError(msg);

                // Show a subtle Swal only for error (not blocking – auto-closes)
                Swal.fire({
                    icon: "error",
                    title: "Sign‑in Failed",
                    text: msg,
                    showConfirmButton: true,
                    confirmButtonText: "Try Again",
                    confirmButtonColor: "#3b82f6",
                    timer: 6000,
                    timerProgressBar: true,
                });
                return;
            }

            if (res.ok) {
                // Brief success toast then navigate
                await Swal.fire({
                    icon: "success",
                    title: "Welcome!!!",
                    text: "You are now signed in.",
                    showConfirmButton: false,
                    timer: 1800,
                    timerProgressBar: true,
                });
                window.location.href = "/dashboard";
            }
        } catch (err: any) {
            const msg = err?.response?.data?.message ?? "Login failed. Please try again.";
            setGlobalError(friendlyError(msg));
        } finally {
            setIsLoading(false);
        }
    };

    // ─── Render ────────────────────────────────────────────────────────────────
    return (
        <section className="mx-auto max-w-6xl rounded-xl bg-white bg-opacity-40 p-6 shadow-md backdrop-blur-sm">
            {/* Header */}
            <div className="flex flex-col items-center justify-between md:flex-row">
                <div className="mb-4 text-[#353535] md:mb-0 md:mr-10">
                    <p className="text-base font-normal md:text-lg">
                        Hello, Computizens!
                    </p>
                    <p className="text-lg font-semibold md:text-2xl">
                        Let's Sign In Folks
                    </p>
                </div>
                <div className="flex space-x-2">
                    <img
                        src="../logo/PUFA_Computing.png"
                        alt="PUFA Computing Logo"
                        className="h-12 w-12 md:h-16 md:w-16"
                    />
                    <img
                        src="../PU.png"
                        alt="PU Logo"
                        className="h-12 w-12 md:h-16 md:w-16"
                    />
                </div>
            </div>

            <div className="my-4 border-t border-[#D1D5DB]" />

            <form onSubmit={handleLogin} noValidate>
                {/* Username / email */}
                <div className="mt-4">
                    <input
                        id="login-username"
                        type="text"
                        className={`block w-full rounded-lg border bg-white px-6 py-3 text-gray-700 transition focus:outline-none focus:ring-2 ${fieldError.username ? "border-red-400 focus:ring-red-300" : "focus:ring-blue-300 focus:border-blue-400"} md:px-10`}
                        placeholder="Username or Email"
                        value={username}
                        onChange={(e) => {
                            setUsername(e.target.value);
                            setFieldError((p) => ({ ...p, username: undefined }));
                            setGlobalError("");
                        }}
                        autoComplete="username"
                    />
                    {fieldError.username && (
                        <p className="mt-1 text-xs text-red-500">{fieldError.username}</p>
                    )}
                </div>

                {/* Password */}
                <div className="mt-4">
                    <div className="relative">
                        <input
                            id="login-password"
                            type={showPwd ? "text" : "password"}
                            className={`block w-full rounded-lg border bg-white px-6 py-3 pr-12 text-gray-700 transition focus:outline-none focus:ring-2 ${fieldError.password ? "border-red-400 focus:ring-red-300" : "focus:ring-blue-300 focus:border-blue-400"} md:px-10 md:pr-14`}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                setFieldError((p) => ({ ...p, password: undefined }));
                                setGlobalError("");
                            }}
                            autoComplete="current-password"
                        />
                        <button
                            type="button"
                            tabIndex={-1}
                            onClick={() => setShowPwd((v) => !v)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                            aria-label={showPwd ? "Hide password" : "Show password"}
                        >
                            {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                    {fieldError.password && (
                        <p className="mt-1 text-xs text-red-500">{fieldError.password}</p>
                    )}
                </div>

                {/* Global error banner */}
                {globalError && (
                    <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                        <p className="text-sm text-red-600">{globalError}</p>
                    </div>
                )}

                {/* Submit */}
                <div className="mt-6">
                    <button
                        id="login-submit"
                        type="submit"
                        className="w-full transform rounded-lg border border-[#6B7280] bg-white px-6 py-3 text-sm font-medium capitalize tracking-wide text-[#6B7280] transition-all duration-200 hover:bg-[#6B7280] hover:text-white active:scale-95 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <span className="flex items-center justify-center gap-2">
                                <Spinner size="sm" />
                                Signing in…
                            </span>
                        ) : (
                            "Sign In"
                        )}
                    </button>
                </div>

                <div className="mt-3 flex flex-col items-center gap-1 text-sm">
                    <p className="text-[#475467]">
                        Don't have an account?{" "}
                        <Link href="/auth/signup" className="text-[#02ABF3] font-medium hover:underline">
                            Sign Up
                        </Link>
                    </p>
                    <Link
                        href="/auth/forgot-password"
                        className="text-[#ef5151] hover:underline"
                    >
                        Forgot password?
                    </Link>
                </div>
            </form>
        </section>
    );
}
