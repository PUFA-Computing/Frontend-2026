"use client";
import React, { useState, useCallback } from "react";
import { Register, RegisterUserType } from "@/services/api/auth";
import Swal from "sweetalert2";
import { AxiosError } from "axios";
import Link from "next/link";
import { Spinner } from "@nextui-org/spinner";

// ─── Types ────────────────────────────────────────────────────────────────────
type ErrorResponse = {
    success: boolean;
    message: string;
    data: Record<string, unknown>;
};

type FieldErrors = {
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    studentId?: string;
    batch?: string;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const ALLOWED_PREFIXES = ["001", "012", "013", "025"] as const;
const EMAIL_SUFFIX = "@student.president.ac.id";

const MAJOR_LABELS: Record<string, string> = {
    "001": "Informatics",
    "012": "Information System",
    "013": "Visual Communication Design",
    "025": "Interior Design",
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// min 8 chars, at least 1 letter + 1 digit
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
const studentIdRegex = /^[0-9]{12}$/;

// ─── Component ────────────────────────────────────────────────────────────────
export default function RegisterForm() {
    const [selectedRole, setSelectedRole] = useState<"Student" | "Institution">("Student");
    const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
    const [globalError, setGlobalError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Live-detect major from student ID prefix
    const [detectedMajor, setDetectedMajor] = useState("");

    const clearFieldError = (field: keyof FieldErrors) => {
        setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    };

    const handleStudentIdChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const val = e.target.value.replace(/\D/g, "").slice(0, 12);
            e.target.value = val;
            clearFieldError("studentId");
            const prefix = val.slice(0, 3);
            setDetectedMajor(MAJOR_LABELS[prefix] ?? "");
        },
        []
    );

    // ── Inline validation ──────────────────────────────────────────────────────
    const validate = (formData: FormData): FieldErrors => {
        const errors: FieldErrors = {};
        const firstName = (formData.get("firstName") as string).trim();
        const lastName = (formData.get("lastName") as string).trim();
        const email = (formData.get("email") as string).trim().toLowerCase();
        const password = formData.get("password") as string;
        const studentId = (formData.get("studentId") as string ?? "").trim();
        const batch = (formData.get("batch") as string ?? "").trim();

        if (!firstName) errors.firstName = "First name is required.";
        if (!lastName) errors.lastName = "Last name is required.";

        if (!email) {
            errors.email = "Email is required.";
        } else if (!emailRegex.test(email)) {
            errors.email = "Enter a valid email address.";
        } else if (!email.endsWith(EMAIL_SUFFIX)) {
            errors.email = `Only ${EMAIL_SUFFIX} emails are accepted.`;
        }

        if (!password) {
            errors.password = "Password is required.";
        } else if (!passwordRegex.test(password)) {
            errors.password =
                "Password must be ≥ 8 characters and include at least one letter and one number.";
        }

        if (selectedRole === "Student") {
            if (!studentIdRegex.test(studentId)) {
                errors.studentId = "Student ID must be exactly 12 digits.";
            } else if (!ALLOWED_PREFIXES.includes(studentId.slice(0, 3) as typeof ALLOWED_PREFIXES[number])) {
                errors.studentId =
                    "Your major is not part of the Faculty of Computer Science.";
            } else if (studentId.slice(3, 7) < "2010") {
                errors.studentId = "You are not eligible to register an account.";
            }

            const batchNum = parseInt(batch, 10);
            if (!batch || isNaN(batchNum) || batchNum < 2010 || batchNum > 2099) {
                errors.batch = "Enter a valid batch year (e.g. 2023).";
            }
        }

        return errors;
    };

    // ── Submit ─────────────────────────────────────────────────────────────────
    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setGlobalError("");

        const formData = new FormData(e.target as HTMLFormElement);
        const errors = validate(formData);

        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            return;
        }
        setFieldErrors({});

        const firstName = (formData.get("firstName") as string).trim();
        const lastName = (formData.get("lastName") as string).trim();
        const email = (formData.get("email") as string).trim().toLowerCase();
        const password = formData.get("password") as string;
        const studentId = (formData.get("studentId") as string ?? "").trim();
        const batch = (formData.get("batch") as string ?? "").trim();

        const user: RegisterUserType = {
            username: `${firstName}.${lastName}`.toLowerCase(),
            first_name: firstName,
            last_name: lastName,
            email,
            password,
            student_id: studentId,
            year: batch,
            role_id: 2,
            student_id_verified: false,
        };

        setIsLoading(true);

        try {
            // Show "creating account" toast while request is in-flight
            Swal.fire({
                title: "Creating your account…",
                text: "This will only take a moment.",
                allowOutsideClick: false,
                allowEscapeKey: false,
                didOpen: () => Swal.showLoading(),
            });

            await Register(user);

            await Swal.fire({
                icon: "success",
                title: "Account Created!",
                html: `
                    <p style="margin:0 0 8px">You're all set, <strong>${firstName}</strong>!</p>
                    <p style="color:#6b7280;font-size:0.9rem">
                        Your account has been activated immediately.
                    </p>`,
                confirmButtonText: "Go to Sign In",
                confirmButtonColor: "#3b82f6",
                timer: 4000,
                timerProgressBar: true,
            });

            window.location.href = "/auth/signin";
        } catch (error) {
            Swal.close();

            if (error instanceof AxiosError) {
                if (error.code === "ERR_NETWORK") {
                    setGlobalError("Network error —> please check your connection and try again.");
                    return;
                }

                const errData = error?.response?.data as ErrorResponse;
                const msg = errData?.message ?? "Registration failed. Please try again.";

                if (msg.includes("Email already exists")) {
                    setFieldErrors({ email: "This email is already registered. Try signing in instead." });
                } else if (msg.includes("Student ID already exists")) {
                    setFieldErrors({ studentId: "This Student ID is already registered. Contact pufa.computing@president.ac.id if you think this is an error." });
                } else if (msg.includes("email") || msg.includes("invalid")) {
                    setFieldErrors({ email: msg });
                } else {
                    setGlobalError(msg);
                }
            } else {
                setGlobalError("An unexpected error occurred. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    // ─── Render ───────────────────────────────────────────────────────────────
    return (
        <section className="mx-auto max-w-6xl rounded-xl bg-white bg-opacity-40 p-6 shadow-md backdrop-blur-sm">
            {/* Header */}
            <div className="flex flex-col items-center justify-between md:flex-row">
                <div className="mb-4 text-[#353535] md:mb-0 md:mr-10">
                    <p className="text-center text-base font-normal md:text-left md:text-lg">
                        Hello, Computizens!
                    </p>
                    <p className="text-lg font-semibold md:text-lg">
                        Let's Create an Account
                    </p>
                    <p className="mt-1 text-xs text-emerald-600 font-medium">
                        ✓ Account activated instantly
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

            <form onSubmit={handleRegister} className="w-full max-w-md" noValidate>
                {/* Name */}
                <div className="mb-4 md:flex md:space-x-2">
                    <div className="md:w-1/2">
                        <input
                            type="text"
                            className={`mt-2 block w-full rounded-lg border bg-white px-5 py-3 text-gray-700 transition focus:outline-none focus:ring-2 ${fieldErrors.firstName ? "border-red-400 focus:ring-red-300" : "focus:ring-blue-300"}`}
                            placeholder="First Name"
                            name="firstName"
                            required
                            onChange={() => clearFieldError("firstName")}
                        />
                        {fieldErrors.firstName && (
                            <p className="mt-1 text-xs text-red-500">{fieldErrors.firstName}</p>
                        )}
                    </div>
                    <div className="md:w-1/2">
                        <input
                            type="text"
                            className={`mt-2 block w-full rounded-lg border bg-white px-5 py-3 text-gray-700 transition focus:outline-none focus:ring-2 ${fieldErrors.lastName ? "border-red-400 focus:ring-red-300" : "focus:ring-blue-300"}`}
                            placeholder="Last Name"
                            name="lastName"
                            required
                            onChange={() => clearFieldError("lastName")}
                        />
                        {fieldErrors.lastName && (
                            <p className="mt-1 text-xs text-red-500">{fieldErrors.lastName}</p>
                        )}
                    </div>
                </div>

                {/* Email */}
                <div className="mb-4">
                    <div className="relative">
                        <input
                            type="email"
                            className={`mt-2 block w-full rounded-lg border bg-white px-5 py-3 text-gray-700 transition focus:outline-none focus:ring-2 ${fieldErrors.email ? "border-red-400 focus:ring-red-300" : "focus:ring-blue-300"}`}
                            placeholder={`yourname${EMAIL_SUFFIX}`}
                            name="email"
                            required
                            onChange={() => clearFieldError("email")}
                        />
                    </div>
                    {fieldErrors.email ? (
                        <p className="mt-1 text-xs text-red-500">{fieldErrors.email}</p>
                    ) : (
                        <p className="mt-1 text-xs text-gray-400">
                            Only <span className="font-medium text-gray-600">@student.president.ac.id</span> emails are accepted
                        </p>
                    )}
                </div>

                {/* Password */}
                <div className="mb-4">
                    <input
                        type="password"
                        className={`mt-2 block w-full rounded-lg border bg-white px-5 py-3 text-gray-700 transition focus:outline-none focus:ring-2 ${fieldErrors.password ? "border-red-400 focus:ring-red-300" : "focus:ring-blue-300"}`}
                        placeholder="Password"
                        name="password"
                        required
                        onChange={() => clearFieldError("password")}
                    />
                    {fieldErrors.password ? (
                        <p className="mt-1 text-xs text-red-500">{fieldErrors.password}</p>
                    ) : (
                        <p className="mt-1 text-xs text-gray-400">
                            Min. 8 characters · at least 1 letter and 1 number
                        </p>
                    )}
                </div>

                {/* Role selector */}
                <div className="relative mt-4 flex items-center justify-center gap-2">
                    {(["Student", "Institution"] as const).map((role) => (
                        <div key={role} className="flex-grow">
                            <input
                                type="radio"
                                name="RoleOption"
                                value={role}
                                id={role}
                                className="peer hidden"
                                checked={selectedRole === role}
                                onChange={() => setSelectedRole(role)}
                                disabled={role === "Institution"}
                            />
                            <label
                                htmlFor={role}
                                className={`flex cursor-pointer items-center justify-center rounded-md border px-5 py-3 text-sm font-medium transition-colors
                                    ${role === "Institution" ? "cursor-not-allowed text-gray-400 bg-white border-gray-100" : ""}
                                    peer-checked:border-blue-500 peer-checked:bg-blue-500 peer-checked:text-white
                                    ${selectedRole !== role && role !== "Institution" ? "border-gray-100 bg-white text-gray-900 hover:border-gray-300" : ""}
                                `}
                            >
                                {role === "Student" ? "Computizen" : "Institution"}
                                {role === "Institution" && (
                                    <span className="ml-2 rounded bg-gray-100 px-1 text-xs text-gray-400">soon</span>
                                )}
                            </label>
                        </div>
                    ))}
                </div>

                {/* Student fields */}
                {selectedRole === "Student" && (
                    <div className="mt-3 space-y-3">
                        {/* Student ID */}
                        <div>
                            <div className="relative">
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    className={`mt-2 block w-full rounded-lg border bg-white px-5 py-3 text-gray-700 transition focus:outline-none focus:ring-2 ${fieldErrors.studentId ? "border-red-400 focus:ring-red-300" : "focus:ring-blue-300"}`}
                                    placeholder="Student ID (12 digits)"
                                    name="studentId"
                                    required
                                    maxLength={12}
                                    onChange={handleStudentIdChange}
                                />
                                {detectedMajor && (
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 mt-1 rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-600">
                                        {detectedMajor}
                                    </span>
                                )}
                            </div>
                            {fieldErrors.studentId ? (
                                <p className="mt-1 text-xs text-red-500">{fieldErrors.studentId}</p>
                            ) : (
                                <p className="mt-1 text-xs text-gray-400">
                                    Format: [major 3 digits][batch 4 digits][id 5 digits]
                                </p>
                            )}
                        </div>

                        {/* Batch */}
                        <div>
                            <input
                                type="number"
                                className={`mt-2 block w-full rounded-lg border bg-white px-5 py-3 text-gray-700 transition focus:outline-none focus:ring-2 ${fieldErrors.batch ? "border-red-400 focus:ring-red-300" : "focus:ring-blue-300"}`}
                                placeholder="Batch Year (e.g. 2023)"
                                name="batch"
                                required
                                min={2010}
                                max={2099}
                                onChange={() => clearFieldError("batch")}
                            />
                            {fieldErrors.batch && (
                                <p className="mt-1 text-xs text-red-500">{fieldErrors.batch}</p>
                            )}
                        </div>
                    </div>
                )}

                {/* Institution field */}
                {selectedRole !== "Student" && (
                    <div className="mt-3">
                        <input
                            type="text"
                            className="mt-2 block w-full rounded-lg border bg-white px-5 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
                            placeholder="Institution Name"
                            required
                            name="institution"
                        />
                    </div>
                )}

                {/* Global error */}
                {globalError && (
                    <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                        <p className="text-sm text-red-600">{globalError}</p>
                    </div>
                )}

                {/* Submit */}
                <div className="mt-6">
                    <button
                        type="submit"
                        className="w-full transform rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium capitalize tracking-wide text-white transition-all duration-200 hover:bg-blue-600 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <span className="flex items-center justify-center gap-2">
                                <Spinner size="sm" color="white" />
                                Creating account…
                            </span>
                        ) : (
                            "Create Account"
                        )}
                    </button>
                </div>

                <p className="pt-3 text-center text-sm text-[#475467]">
                    Already have an account?{" "}
                    <Link href="/auth/signin" className="text-[#02ABF3] hover:underline font-medium">
                        Sign In
                    </Link>
                </p>
            </form>
        </section>
    );
}
