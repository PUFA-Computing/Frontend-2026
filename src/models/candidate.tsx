// src/models/candidate.tsx

export interface Candidate {
  id: number;
  name: string;
  vision: string | null;
  mission: string | null;
  class: string | null;
  user_id: string | null;
  major: "informatics" | "information system";
  profile_picture: string | null;
  vote_count?: number;
  created_at: string;
  updated_at: string;
}

export interface CandidateResponse {
  success: boolean;
  data: Candidate[] | Candidate;
  message?: string;
}

export interface CreateCandidateRequest {
  name: string;
  vision?: string;
  mission?: string;
  class?: string;
  user_id?: string;
  major: "informatics" | "information system";
  profile_picture?: string;
}