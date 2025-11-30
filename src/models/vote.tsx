// src/models/vote.tsx

export interface Vote {
  id: number;
  voter_id: string;
  candidate_id: number;
  created_at: string;
  updated_at: string;
}

export interface VoteStatus {
  has_voted: boolean;
  vote_id?: number;
  candidate_id?: number;
  voted_at?: string;
}

export interface VoteResponse {
  id: number;
  voter_id: string;
  candidate_id: number;
  candidate_name: string;
  voter_name: string;
  created_at: string;
  updated_at: string;
}

export interface CastVoteRequest {
  candidate_id: number;
}

export interface CastVoteResponse {
  success: boolean;
  message: string;
  data: Vote;
}

export interface VoteCountResponse {
  success: boolean;
  candidate_id: number;
  vote_count: number;
}

export interface CanVoteResponse {
  success: boolean;
  can_vote: boolean;
  message: string;
}

export interface VoteStatusResponse {
  success: boolean;
  data: VoteStatus;
}