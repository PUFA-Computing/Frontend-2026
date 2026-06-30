// src/services/api/cpVcpRegistration.tsx

import axios from "axios";
import apiClient from "./apiClient";
import {
  TokenStatusResponse,
  VerifyIdentityRequest,
  VerifyIdentityResponse,
  RegistrationPayload,
  PhotoUploadResponse,
  AdminRegistrationsResponse,
} from "@/models/cpVcpRegistration";

// Base API route prefix for CP/VCP registration
const API_PREFIX = "/compregen";

// ─── Mock Mode ──────────────────────────────────────────────────────────────
// Set NEXT_PUBLIC_MOCK_COMPREGEN=true in .env.local to bypass the real backend.
// Remove or set to false before pushing to staging/production.
const MOCK_MODE = process.env.NEXT_PUBLIC_MOCK_COMPREGEN === "true";

/**
 * Validates the invite link/token status
 */
export async function validateToken(token: string): Promise<TokenStatusResponse> {
  // [MOCK] Always return active so the landing page redirects to /verify
  if (MOCK_MODE) return { status: "active" };

  try {
    const response = await apiClient.get<TokenStatusResponse>(`${API_PREFIX}/links/${token}`);
    return response.data;
  } catch (error: any) {
    console.error(`[API] Error validating token ${token}:`, error.message);
    return { status: "not_found" };
  }
}

/**
 * Verifies identity against whitelist
 * This call sets the httpOnly session cookie on success
 */
export async function verifyIdentity(
  token: string,
  studentId: string,
  email: string
): Promise<VerifyIdentityResponse> {
  // [MOCK] Any non-empty student ID + valid-format email is accepted
  if (MOCK_MODE) {
    if (studentId.trim() && email.includes("@")) {
      return { verified: true };
    }
    return { verified: false, reason: "not_in_whitelist", attempts_remaining: 4 };
  }

  try {
    const payload: VerifyIdentityRequest = {
      token,
      student_id: studentId,
      campus_email: email,
    };
    const response = await apiClient.post<VerifyIdentityResponse>(`${API_PREFIX}/verify`, payload);
    return response.data;
  } catch (error: any) {
    console.error("[API] Error verifying identity:", error.message);
    if (error.response) {
      return error.response.data;
    }
    return { verified: false, error: "Network error occurred" };
  }
}

/**
 * Submits the complete CP/VCP/VCP2 registration
 */
export async function submitRegistration(
  token: string,
  payload: Omit<RegistrationPayload, "token">
): Promise<{ success: boolean; registration_id?: string; error?: string; fields?: Record<string, string> }> {
  // [MOCK] Always succeeds — redirects to /success
  if (MOCK_MODE) return { success: true, registration_id: "mock-reg-001" };

  try {
    const fullPayload: RegistrationPayload = { token, ...payload };
    const response = await apiClient.post(`${API_PREFIX}/register`, fullPayload);
    return { success: true, registration_id: response.data.registration_id };
  } catch (error: any) {
    console.error("[API] Error submitting registration:", error.message);
    if (error.response) {
      return {
        success: false,
        error: error.response.data.error,
        fields: error.response.data.fields,
      };
    }
    return { success: false, error: "Network error occurred" };
  }
}

/**
 * Uploads a candidate photo and returns an upload id
 */
export async function uploadPhoto(
  file: File,
  role: "cp" | "vcp1" | "vcp2",
  token: string
): Promise<PhotoUploadResponse> {
  // [MOCK] Return a fake upload ID immediately — no real network call
  if (MOCK_MODE) return { photo_upload_id: `mock-photo-${role}-${Date.now()}` };

  const formData = new FormData();
  formData.append("file", file);
  formData.append("role", role);
  formData.append("token", token);

  const response = await apiClient.post<PhotoUploadResponse>(`${API_PREFIX}/upload/photo`, formData);
  return response.data;
}

/**
 * Fetches all registrations (Admin only)
 */
export async function getRegistrations(adminApiKey?: string): Promise<AdminRegistrationsResponse> {
  // [MOCK] Return sample registrations for admin UI preview
  if (MOCK_MODE) {
    return {
      registrations: [
        {
          id: "mock-reg-001",
          cabinet_name: "Synergy Cabinet",
          submitted_at: new Date().toISOString(),
          members: {
            cp:   { full_name: "Budi Santoso",  student_id: "001202300001", major: "Informatics",       phone_number: "081234567890", nationality: "Indonesian", photo_upload_id: "" },
            vcp1: { full_name: "Dewi Rahayu",   student_id: "001202300002", major: "Information System", phone_number: "081234567891", nationality: "Indonesian", photo_upload_id: "" },
            vcp2: { full_name: "Andi Wijaya",   student_id: "001202300003", major: "Informatics",       phone_number: "081234567892", nationality: "Indonesian", photo_upload_id: "" },
          },
        },
      ],
    };
  }

  const response = await axios.get<AdminRegistrationsResponse>("/api/admin/compregen/registrations");
  return response.data;
}

/**
 * Generates a new invite token/link (Admin only)
 */
export async function generateInviteLink(adminApiKey?: string): Promise<{ token: string; url: string }> {
  // [MOCK] Return a fake token URL for local preview
  if (MOCK_MODE) {
    const mockToken = `mock-token-${Date.now()}`;
    return { token: mockToken, url: `http://localhost:3000/compregen/cp-vcp/${mockToken}` };
  }

  const response = await axios.post<{ token: string; url: string }>("/api/admin/compregen/links");
  return response.data;
}
