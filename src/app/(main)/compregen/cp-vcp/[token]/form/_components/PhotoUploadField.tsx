// src/app/(main)/compregen/cp-vcp/[token]/form/_components/PhotoUploadField.tsx
"use client";

import React, { useState, useRef } from "react";
import { uploadPhoto } from "@/services/api/cpVcpRegistration";
import { Upload, X, Check, AlertTriangle } from "lucide-react";

interface Props {
  role: "cp" | "vcp1" | "vcp2";
  token: string;
  onUploadSuccess: (uploadId: string) => void;
  label: string;
  hint: string;
}

export default function PhotoUploadField({ role, token, onUploadSuccess, label, hint }: Props) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndUpload(e.target.files[0]);
    }
  };

  const validateAndUpload = async (selectedFile: File) => {
    setErrorMsg("");
    setIsSuccess(false);

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(selectedFile.type)) {
      setErrorMsg("Only JPG, PNG, and WebP formats are allowed.");
      return;
    }
    if (selectedFile.size > 5 * 1024 * 1024) {
      setErrorMsg("Image size exceeds the 5MB limit.");
      return;
    }

    setPreviewUrl(URL.createObjectURL(selectedFile));
    setIsUploading(true);

    try {
      const res = await uploadPhoto(selectedFile, role, token);
      if (res.photo_upload_id) {
        onUploadSuccess(res.photo_upload_id);
        setIsSuccess(true);
      } else {
        setErrorMsg("Upload failed — server did not return an ID.");
      }
    } catch (error: any) {
      setErrorMsg(error.response?.data?.message || "Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    setPreviewUrl(null);
    setIsSuccess(false);
    setErrorMsg("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    /*
     * Layout:
     *   mobile  → flex-row  : thumbnail on left (fixed 72px wide), info + button on right
     *   md+     → flex-col  : portrait card (original 3-column layout)
     */
    <div className="flex flex-row items-center gap-3 rounded-xl border border-gray-100 bg-gray-50/50 p-3 transition hover:bg-gray-50 md:flex-col md:items-stretch md:gap-2 md:p-4">

      {/* ── Thumbnail / Upload Zone ───────────────────────────────────── */}
      <div className="relative flex-shrink-0 w-[72px] md:w-full">
        {previewUrl ? (
          /* Preview image */
          <div className="group relative aspect-[3/4] w-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
            <img
              src={previewUrl}
              alt={`${label} preview`}
              className="h-full w-full object-cover"
            />
            {/* Remove overlay:
                mobile  → always visible (opacity-100)
                desktop → only on hover (md:opacity-0 md:group-hover:opacity-100)
            */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 transition opacity-100 md:opacity-0 md:group-hover:opacity-100">
              <button
                type="button"
                onClick={handleRemove}
                disabled={isUploading}
                className="flex h-7 w-7 items-center justify-center rounded-full bg-red-600 text-white shadow transition hover:bg-red-700 active:scale-95 disabled:opacity-50"
                title="Remove photo"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            {/* Upload spinner */}
            {isUploading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/60 text-white text-[10px] font-medium">
                <div className="h-4 w-4 rounded-full border-2 border-t-transparent border-white animate-spin" />
                <span>Uploading…</span>
              </div>
            )}
          </div>
        ) : (
          /* Drop / click zone */
          <div
            onClick={() => fileInputRef.current?.click()}
            className="flex aspect-[3/4] w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-white transition hover:border-blue-400 hover:bg-blue-50/20"
          >
            <Upload className="h-5 w-5 text-gray-400 md:h-6 md:w-6" />
            <span className="mt-1 text-[9px] font-bold text-blue-600 md:text-[10px]">Select</span>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
            />
          </div>
        )}
      </div>

      {/* ── Label + hint + status ──────────────────────────────────────── */}
      <div className="flex min-w-0 flex-1 flex-col justify-center gap-1 md:w-full md:flex-none md:justify-start">
        {/* Label row */}
        <div className="flex items-center justify-between gap-1">
          <span className="text-xs font-extrabold uppercase tracking-wide text-gray-800">
            {label}
          </span>
          {isSuccess && (
            <span className="flex items-center gap-0.5 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-600">
              <Check className="h-3 w-3" /> Done
            </span>
          )}
        </div>

        {/* Hint text */}
        <p className="text-[10px] leading-snug text-gray-500">{hint}</p>

        {/* File type note — shown on mobile in the right column; hidden on md+ (it's in the drop zone) */}
        <p className="text-[9px] text-gray-400 md:hidden">JPG / PNG / WebP · max 5MB</p>



        {/* Error message */}
        {errorMsg && (
          <div className="mt-1 flex items-start gap-1 text-[10px] font-semibold leading-snug text-red-600">
            <AlertTriangle className="mt-0.5 h-3 w-3 flex-shrink-0 text-red-500" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>
    </div>
  );
}
