// src/models/cpVcpRegistration.tsx

export type TokenStatus = "active" | "used" | "expired" | "not_found";

export interface TokenStatusResponse {
  status: TokenStatus;
}

export interface VerifyIdentityRequest {
  token: string;
  student_id: string;
  campus_email: string;
}

export interface VerifyIdentityResponse {
  verified: boolean;
  reason?: "not_in_whitelist" | "email_mismatch" | string;
  attempts_remaining?: number;
  error?: string;
  retry_after?: number | null;
}

export interface CandidateMember {
  full_name: string;
  student_id: string;
  major: string;
  phone_number: string;
  nationality: string;
  photo_upload_id: string;
}

export interface RegistrationPayload {
  token: string;
  cabinet_name: string;
  consent_accepted: boolean;
  members: {
    cp: CandidateMember;
    vcp1: CandidateMember;
    vcp2: CandidateMember;
  };
}

export interface RegistrationRecord {
  id: string;
  cabinet_name: string;
  submitted_at: string;
  members: {
    cp: CandidateMember;
    vcp1: CandidateMember;
    vcp2: CandidateMember;
  };
}

export interface AdminRegistrationsResponse {
  registrations: RegistrationRecord[];
}

export interface PhotoUploadResponse {
  photo_upload_id: string;
}
