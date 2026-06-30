// src/app/(main)/compregen/cp-vcp/[token]/form/_components/RegistrationForm.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import PhotoUploadField from "./PhotoUploadField";
import { submitRegistration } from "@/services/api/cpVcpRegistration";
import { AlertCircle, CheckCircle2, User, Phone, BookOpen, Hash } from "lucide-react";

interface Props {
  token: string;
}

interface MemberState {
  full_name: string;
  student_id: string;
  major: string;
  phone_number: string;
  photo_upload_id: string;
}

export default function RegistrationForm({ token }: Props) {
  const router = useRouter();

  const [cabinetName, setCabinetName] = useState("");
  const [consentAccepted, setConsentAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Members State
  const [cp, setCp] = useState<MemberState>({
    full_name: "",
    student_id: "",
    major: "Informatics",
    phone_number: "",
    photo_upload_id: "",
  });

  const [vcp1, setVcp1] = useState<MemberState>({
    full_name: "",
    student_id: "",
    major: "Informatics",
    phone_number: "",
    photo_upload_id: "",
  });

  const [vcp2, setVcp2] = useState<MemberState>({
    full_name: "",
    student_id: "",
    major: "Informatics",
    phone_number: "",
    photo_upload_id: "",
  });

  // Validation & Error States
  const [errorMsg, setErrorMsg] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const updateMember = (
    role: "cp" | "vcp1" | "vcp2",
    field: keyof MemberState,
    value: string
  ) => {
    // Clear existing error for this specific field
    const fieldKey = `members.${role}.${field}`;
    if (fieldErrors[fieldKey]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[fieldKey];
        return next;
      });
    }

    const setter = role === "cp" ? setCp : role === "vcp1" ? setVcp1 : setVcp2;
    setter((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = (): boolean => {
    setErrorMsg("");
    const errors: Record<string, string> = {};

    if (!cabinetName.trim()) {
      errors["cabinet_name"] = "Cabinet Name is required.";
    }

    const checkMember = (role: "cp" | "vcp1" | "vcp2", data: MemberState, label: string) => {
      if (!data.full_name.trim()) errors[`members.${role}.full_name`] = `${label} Full Name is required.`;
      if (!data.student_id.trim()) errors[`members.${role}.student_id`] = `${label} Student ID is required.`;
      if (!data.phone_number.trim()) {
        errors[`members.${role}.phone_number`] = `${label} Phone Number is required.`;
      } else if (!/^\d+$/.test(data.phone_number.trim())) {
        errors[`members.${role}.phone_number`] = `${label} Phone Number must be numeric.`;
      }
      if (!data.photo_upload_id) errors[`members.${role}.photo_upload_id`] = `${label} Photo is required.`;
    };

    checkMember("cp", cp, "Chairperson");
    checkMember("vcp1", vcp1, "Vice Chairperson 1");
    checkMember("vcp2", vcp2, "Vice Chairperson 2");

    if (!consentAccepted) {
      setErrorMsg("You must accept the participation consent to submit.");
      return false;
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      setErrorMsg("Please correct the errors in the form before submitting.");
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        cabinet_name: cabinetName.trim(),
        consent_accepted: consentAccepted,
        members: { cp, vcp1, vcp2 },
      };

      const res = await submitRegistration(token, payload);

      if (res.success) {
        router.push(`/compregen/cp-vcp/${token}/success`);
      } else {
        setErrorMsg(res.error || "Form submission failed. Please try again.");
        if (res.fields) {
          setFieldErrors(res.fields);
        }
      }
    } catch (err) {
      setErrorMsg("An unexpected server error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Error Banner */}
      {errorMsg && (
        <div className="flex gap-2.5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 shadow-sm animate-pulse">
          <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-600" />
          <div>
            <p className="font-bold">Submission Error</p>
            <p className="mt-0.5 leading-relaxed">{errorMsg}</p>
          </div>
        </div>
      )}

      {/* 1. Cabinet Name Section */}
      <div className="bg-blue-50/30 rounded-2xl p-5 border border-blue-100/50 space-y-3">
        <h2 className="text-base font-bold text-gray-800 uppercase tracking-wider flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs text-white">1</span>
          Cabinet Details
        </h2>
        <div className="space-y-1">
          <label htmlFor="cabinet-name" className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            Cabinet Name
          </label>
          <Input
            id="cabinet-name"
            type="text"
            placeholder="e.g. Aurascendia Cabinet"
            value={cabinetName}
            onChange={(e) => setCabinetName(e.target.value)}
            disabled={isLoading}
            className={`h-11 bg-white border ${fieldErrors["cabinet_name"] ? "border-red-400 focus-visible:ring-red-400" : "border-gray-200"}`}
          />
          {fieldErrors["cabinet_name"] && (
            <p className="text-xs text-red-500 font-semibold">{fieldErrors["cabinet_name"]}</p>
          )}
        </div>
      </div>

      {/* 2. Members Details */}
      <div className="space-y-6">
        <h2 className="text-base font-bold text-gray-800 uppercase tracking-wider flex items-center gap-2 border-b border-gray-100 pb-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs text-white">2</span>
          Candidate Profile
        </h2>

        {/* Layout grid: stacks on mobile, columns on desktop */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* CP Form */}
          <MemberFormFields
            role="cp"
            label="Chairperson (CP)"
            data={cp}
            updateField={updateMember}
            errors={fieldErrors}
            disabled={isLoading}
          />

          {/* VCP 1 Form */}
          <MemberFormFields
            role="vcp1"
            label="Vice Chairperson 1"
            data={vcp1}
            updateField={updateMember}
            errors={fieldErrors}
            disabled={isLoading}
          />

          {/* VCP 2 Form */}
          <MemberFormFields
            role="vcp2"
            label="Vice Chairperson 2"
            data={vcp2}
            updateField={updateMember}
            errors={fieldErrors}
            disabled={isLoading}
          />
        </div>
      </div>

      {/* 3. Photo Uploads Row — stacks on mobile, 3 columns on md+ */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs text-white">3</span>
          Half-body Photo Uploads
        </h2>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-4">
          <PhotoUploadField
            role="cp"
            token={token}
            label="CP"
            hint="PDH/Uniform half-body"
            onUploadSuccess={(id) => updateMember("cp", "photo_upload_id", id)}
          />
          <PhotoUploadField
            role="vcp1"
            token={token}
            label="VCP 1"
            hint="PDH/Uniform half-body"
            onUploadSuccess={(id) => updateMember("vcp1", "photo_upload_id", id)}
          />
          <PhotoUploadField
            role="vcp2"
            token={token}
            label="VCP 2"
            hint="Formal attire/PDH"
            onUploadSuccess={(id) => updateMember("vcp2", "photo_upload_id", id)}
          />
        </div>
        {(fieldErrors["members.cp.photo_upload_id"] ||
          fieldErrors["members.vcp1.photo_upload_id"] ||
          fieldErrors["members.vcp2.photo_upload_id"]) && (
            <p className="text-xs text-red-500 font-semibold text-center mt-2">
              Please make sure photos are uploaded for all 3 members.
            </p>
          )}
      </div>

      {/* 4. Consent Checkbox */}
      <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-4 space-y-3">
        <div className="flex items-start gap-3">
          <input
            id="consent-checkbox"
            type="checkbox"
            checked={consentAccepted}
            onChange={(e) => setConsentAccepted(e.target.checked)}
            disabled={isLoading}
            className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
          />
          <label htmlFor="consent-checkbox" className="text-xs md:text-sm text-gray-600 cursor-pointer select-none">
            I agree to participate in the entire Compregen 2027 event series and confirm that the details provided are correct and match eligibility.
          </label>
        </div>
      </div>

      {/* Submit Button */}
      <Button
        id="registration-submit"
        type="submit"
        disabled={isLoading || !consentAccepted}
        className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm tracking-wide rounded-xl shadow-lg transition active:scale-98 disabled:bg-gray-400 disabled:cursor-not-allowed"
        style={{ backgroundColor: consentAccepted && !isLoading ? "#2563eb" : "#9ca3af", color: "#ffffff" }}
      >
        {isLoading ? (
          "Submitting Registration..."
        ) : (
          <span className="flex items-center justify-center gap-1.5">
            Submit Registration <CheckCircle2 className="h-4.5 w-4.5" />
          </span>
        )}
      </Button>
    </form>
  );
}

/* Helper Member Form Fields Sub-Component */
interface MemberFormFieldsProps {
  role: "cp" | "vcp1" | "vcp2";
  label: string;
  data: MemberState;
  updateField: (role: "cp" | "vcp1" | "vcp2", field: keyof MemberState, value: string) => void;
  errors: Record<string, string>;
  disabled: boolean;
}

function MemberFormFields({ role, label, data, updateField, errors, disabled }: MemberFormFieldsProps) {
  return (
    <div className="border border-gray-200 bg-white rounded-xl p-4 shadow-sm space-y-4">
      <h3 className="font-bold text-sm text-gray-900 border-b border-gray-100 pb-1.5 flex items-center gap-1.5">
        <User className="h-4.5 w-4.5 text-blue-500" />
        {label}
      </h3>

      {/* Full Name */}
      <div className="space-y-1">
        <label htmlFor={`${role}-name`} className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
          Full Name
        </label>
        <div className="relative">
          <Input
            id={`${role}-name`}
            type="text"
            placeholder="Full Name"
            value={data.full_name}
            onChange={(e) => updateField(role, "full_name", e.target.value)}
            disabled={disabled}
            className={`h-9 bg-white border text-sm ${errors[`members.${role}.full_name`] ? "border-red-400" : "border-gray-200"}`}
          />
        </div>
        {errors[`members.${role}.full_name`] && (
          <p className="text-[10px] text-red-500 font-semibold">{errors[`members.${role}.full_name`]}</p>
        )}
      </div>

      {/* Student ID */}
      <div className="space-y-1">
        <label htmlFor={`${role}-id`} className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
          Student ID
        </label>
        <div className="relative">
          <Input
            id={`${role}-id`}
            type="text"
            placeholder="Student ID"
            value={data.student_id}
            onChange={(e) => updateField(role, "student_id", e.target.value)}
            disabled={disabled}
            className={`h-9 bg-white border text-sm ${errors[`members.${role}.student_id`] ? "border-red-400" : "border-gray-200"}`}
          />
        </div>
        {errors[`members.${role}.student_id`] && (
          <p className="text-[10px] text-red-500 font-semibold">{errors[`members.${role}.student_id`]}</p>
        )}
      </div>

      {/* Major Dropdown */}
      <div className="space-y-1">
        <label htmlFor={`${role}-major`} className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
          Major
        </label>
        <select
          id={`${role}-major`}
          value={data.major}
          onChange={(e) => updateField(role, "major", e.target.value)}
          disabled={disabled}
          className="flex h-9 w-full rounded-md border border-gray-200 bg-white px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 text-gray-700"
        >
          <option value="Informatics">Informatics</option>
          <option value="Information System">Information System</option>
        </select>
      </div>

      {/* Phone Number */}
      <div className="space-y-1">
        <label htmlFor={`${role}-phone`} className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
          Phone Number
        </label>
        <div className="relative">
          <Input
            id={`${role}-phone`}
            type="text"
            placeholder="e.g. 08123456789"
            value={data.phone_number}
            onChange={(e) => updateField(role, "phone_number", e.target.value)}
            disabled={disabled}
            className={`h-9 bg-white border text-sm ${errors[`members.${role}.phone_number`] ? "border-red-400" : "border-gray-200"}`}
          />
        </div>
        {errors[`members.${role}.phone_number`] && (
          <p className="text-[10px] text-red-500 font-semibold">{errors[`members.${role}.phone_number`]}</p>
        )}
      </div>
    </div>
  );
}
