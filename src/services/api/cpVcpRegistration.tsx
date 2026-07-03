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
  WhitelistMember,
  VerificationAttempt,
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
    const response = await axios.post<VerifyIdentityResponse>(`/api/compregen/verify`, {
        token,
        student_id: studentId,
        campus_email: email,
      });
      return response.data;
    } catch (error: any) {
      console.error("[API] Error verifying identity:", error.message);
      return error.response?.data || { verified: false };
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
// Local Storage Mock Helpers
const getStorageItem = (key: string, defaultValue: any) => {
  if (typeof window === "undefined") return defaultValue;
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : defaultValue;
};

const setStorageItem = (key: string, value: any) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

export async function getRegistrations(accessToken?: string): Promise<AdminRegistrationsResponse> {
  // [MOCK] Return sample registrations for admin UI preview
  if (MOCK_MODE) {
    const defaultRegs = [
      {
        id: "reg-001",
        cabinet_name: "Kabinet Nusantara",
        submitted_at: new Date(Date.now() - 3600000 * 2).toISOString(), // 2 hours ago
        members: {
          cp:   { full_name: "Raka Darmawan",   student_id: "001202400112", major: "Informatics",       phone_number: "081234567890", nationality: "Indonesian", photo_upload_id: "" },
          vcp1: { full_name: "Siti Aulia",      student_id: "001202400118", major: "Information Systems", phone_number: "081322223333", nationality: "Indonesian", photo_upload_id: "" },
          vcp2: { full_name: "Budi Firmansyah", student_id: "001202400125", major: "Informatics",       phone_number: "081455556666", nationality: "Indonesian", photo_upload_id: "" },
        },
        status: "OK",
      },
      {
        id: "reg-002",
        cabinet_name: "Kabinet Gemilang",
        submitted_at: new Date(Date.now() - 3600000 * 5).toISOString(), // 5 hours ago
        members: {
          cp:   { full_name: "Andi Laksono",    student_id: "001202400107", major: "Informatics",       phone_number: "081244445555", nationality: "Indonesian", photo_upload_id: "" },
          vcp1: { full_name: "Nisa Putri",      student_id: "001202400119", major: "Information Systems", phone_number: "081266667777", nationality: "Indonesian", photo_upload_id: "" },
          vcp2: { full_name: "Dian Wulandari",  student_id: "001202400131", major: "Informatics",       phone_number: "081288889999", nationality: "Indonesian", photo_upload_id: "" },
        },
        status: "OK",
      },
      {
        id: "reg-003",
        cabinet_name: "Kabinet Cakrawala",
        submitted_at: new Date(Date.now() - 3600000 * 25).toISOString(), // 25 hours ago
        members: {
          cp:   { full_name: "Maya Hendra",    student_id: "001202400103", major: "Informatics",       phone_number: "081311112222", nationality: "Indonesian", photo_upload_id: "" },
          vcp1: { full_name: "Toni Raharjo",   student_id: "001202400122", major: "Information Systems", phone_number: "081333334444", nationality: "Indonesian", photo_upload_id: "" },
          vcp2: { full_name: "Fina Sari",      student_id: "001202400129", major: "Informatics",       phone_number: "081355556666", nationality: "Indonesian", photo_upload_id: "" },
        },
        status: "Review",
      },
    ];
    
    const regs = getStorageItem("compregen_mock_registrations", defaultRegs);
    setStorageItem("compregen_mock_registrations", regs);
    return { registrations: regs };
  }

  const baseUrl = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_NEXTAUTH_URL || 'http://localhost:3000';
  // Get cookies for SSR
  let cookieHeader = "";
  if (typeof window === "undefined") {
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    cookieHeader = cookieStore.toString();
  }

  const response = await axios.get<AdminRegistrationsResponse>(
    `${baseUrl}/api/admin/compregen/registrations`,
    {
      headers: cookieHeader ? { Cookie: cookieHeader } : {},
    }
  );
  return response.data;
}

/**
 * Generates a new invite token/link (Admin only)
 */
export async function generateInviteLink(adminApiKey?: string): Promise<{ token: string; url: string; created_at?: string; status?: string }> {
  // [MOCK] Return a fake token URL for local preview
  if (MOCK_MODE) {
    const mockToken = `mock-token-${Date.now()}`;
    const url = `${typeof window !== "undefined" ? window.location.origin : "http://localhost:3000"}/compregen/cp-vcp/${mockToken}`;
    const newLink = {
      token: mockToken,
      url,
      created_at: new Date().toISOString(),
      status: "active",
      submissions: 0,
    };
    
    setStorageItem("compregen_mock_active_link", newLink);
    return newLink;
  }

  const response = await axios.post<{ token: string; url: string }>("/api/admin/compregen/links");
  return response.data;
}

/**
 * Gets the current active invite link
 */
export async function getActiveInviteLink(): Promise<{ token: string; url: string; created_at?: string; status?: string; submissions?: number } | null> {
  if (MOCK_MODE) {
    const defaultLink = {
      token: "a3f9b2e1c4d5e6f7",
      url: "compsci.president.ac.id/compregen/cp-vcp/a3f9b2e1c4d5e6f7",
      created_at: new Date(Date.now() - 3600000 * 24).toISOString(), // 1 day ago
      status: "active",
      submissions: 3,
    };
    const activeLink = getStorageItem("compregen_mock_active_link", defaultLink);
    setStorageItem("compregen_mock_active_link", activeLink);
    return activeLink;
  }
  
  try {
    const response = await axios.get("/api/admin/compregen/links/active");
    return response.data;
  } catch (error) {
    return null;
  }
}

/**
 * Closes the invite link
 */
export async function closeInviteLink(token: string): Promise<{ success: boolean }> {
  if (MOCK_MODE) {
    const activeLink = getStorageItem("compregen_mock_active_link", null);
    if (activeLink && activeLink.token === token) {
      activeLink.status = "closed";
      setStorageItem("compregen_mock_active_link", activeLink);
    }
    return { success: true };
  }
  
  const response = await axios.post("/api/admin/compregen/links/close", { token });
  return response.data;
}

/**
 * Fetches Whitelist Members (Admin only)
 */
export async function getWhitelistMembers(): Promise<{ whitelist: WhitelistMember[] }> {
  if (MOCK_MODE) {
    const defaultWhitelist: WhitelistMember[] = [
      { student_id: "001202400112", full_name: "Raka Darmawan", campus_email: "raka@student.president.ac.id", major: "Informatics", registered: true },
      { student_id: "001202400118", full_name: "Siti Aulia", campus_email: "siti@student.president.ac.id", major: "Information Systems", registered: true },
      { student_id: "001202400125", full_name: "Budi Firmansyah", campus_email: "budi@student.president.ac.id", major: "Informatics", registered: true },
      { student_id: "001202400107", full_name: "Andi Laksono", campus_email: "andi@student.president.ac.id", major: "Informatics", registered: true },
      { student_id: "001202400115", full_name: "Gabrielle L.", campus_email: "gabrielle@student.president.ac.id", major: "Information Systems", registered: false },
      { student_id: "001202400131", full_name: "Dian Wulandari", campus_email: "dian@student.president.ac.id", major: "Informatics", registered: true },
      { student_id: "001202400108", full_name: "Fajar Hidayat", campus_email: "fajar@student.president.ac.id", major: "Informatics", registered: false },
      { student_id: "001202400133", full_name: "Rina Puspita", campus_email: "rina@student.president.ac.id", major: "Informatics", registered: false },
    ];
    
    const list = getStorageItem("compregen_mock_whitelist", defaultWhitelist);
    setStorageItem("compregen_mock_whitelist", list);
    return { whitelist: list };
  }

  const response = await axios.get("/api/admin/compregen/whitelist");
  return response.data;
}

/**
 * Adds a Whitelist Member
 */
export async function addWhitelistMember(member: Omit<WhitelistMember, "registered">): Promise<{ success: boolean; member: WhitelistMember }> {
  if (MOCK_MODE) {
    const list = getStorageItem("compregen_mock_whitelist", []);
    const newMember: WhitelistMember = { ...member, registered: false };
    list.push(newMember);
    setStorageItem("compregen_mock_whitelist", list);
    return { success: true, member: newMember };
  }

  const response = await axios.post("/api/admin/compregen/whitelist", member);
  return response.data;
}

/**
 * Import Whitelist Members from CSV
 */
export async function importWhitelistCsv(file: File): Promise<{ success: boolean; importedCount: number }> {
  if (MOCK_MODE) {
    // Mock parsing some CSV rows
    const list = getStorageItem("compregen_mock_whitelist", []);
    const mockImports: WhitelistMember[] = [
      { student_id: "001202400201", full_name: "CSV Import 1", campus_email: "csv1@student.president.ac.id", major: "Informatics", registered: false },
      { student_id: "001202400202", full_name: "CSV Import 2", campus_email: "csv2@student.president.ac.id", major: "Information Systems", registered: false },
    ];
    const newList = [...list, ...mockImports];
    setStorageItem("compregen_mock_whitelist", newList);
    return { success: true, importedCount: mockImports.length };
  }

  const formData = new FormData();
  formData.append("file", file);
  const response = await axios.post("/api/admin/compregen/whitelist/csv", formData);
  return response.data;
}

/**
 * Fetches Verification Attempts (Admin only)
 */
export async function getVerificationAttempts(): Promise<{ attempts: VerificationAttempt[] }> {
  if (MOCK_MODE) {
    const defaultAttempts: VerificationAttempt[] = [
      { id: "att-001", student_id_attempted: "001202400199", email_attempted: "hacker@gmail.com", success: false, attempted_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(), attempts_count: 4 },
      { id: "att-002", student_id_attempted: "001202400144", email_attempted: "unknown@student.president.ac.id", success: false, attempted_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(), attempts_count: 2 },
    ];
    
    const list = getStorageItem("compregen_mock_attempts", defaultAttempts);
    setStorageItem("compregen_mock_attempts", list);
    return { attempts: list };
  }

  const response = await axios.get("/api/admin/compregen/attempts");
  return response.data;
}

/**
 * Resets a Candidate Session/ lockout or submitted registration
 */
export async function resetCandidateSession(registrationId: string): Promise<{ success: boolean }> {
  if (MOCK_MODE) {
    const regs = getStorageItem("compregen_mock_registrations", []);
    const filtered = regs.filter((r: any) => r.id !== registrationId);
    setStorageItem("compregen_mock_registrations", filtered);
    
    // Also reset attempt limits for that session
    localStorage.removeItem("compregen_mock_attempts");
    return { success: true };
  }

  const response = await axios.post("/api/admin/compregen/registrations/reset", { registration_id: registrationId });
  return response.data;
}

