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
  consent_accepted: boolean;
  members: {
    cp: CandidateMember;
    vcp1: CandidateMember;
    vcp2: CandidateMember;
  };
}

export interface RegistrationRecord {
  id: string;
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

export interface WhitelistMember {
  student_id: string;
  full_name: string;
  campus_email: string;
  major: string;
  registered: boolean;
}

export interface VerificationAttempt {
  id: string;
  student_id_attempted: string;
  email_attempted: string;
  success: boolean;
  attempted_at: string;
  attempts_count: number;
  full_name?: string;
}

