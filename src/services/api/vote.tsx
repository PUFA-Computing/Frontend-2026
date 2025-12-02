// // src/services/api/vote.tsx

// import apiClient from "./apiClient";
// import {
//   Vote,
//   VoteStatus,
//   CastVoteRequest,
//   CastVoteResponse,
//   VoteCountResponse,
//   CanVoteResponse,
//   VoteStatusResponse,
// } from "@/models/vote";

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

// /**
//  * Cast a vote (authenticated, year 2025 only)
//  */
// export async function castVote(
//   candidateId: number,
//   token: string
// ): Promise<CastVoteResponse> {
//   try {
//     const payload: CastVoteRequest = {
//       candidate_id: candidateId,
//     };
    
//     const response = await apiClient.post<CastVoteResponse>(
//       `${API_BASE_URL}/votes/cast`,
//       payload,
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );
    
//     return response.data;
//   } catch (error: any) {
//     console.error("Error casting vote:", error);
    
//     // Extract error message from backend
//     const errorMessage =
//       error.response?.data?.message ||
//       error.message ||
//       "Failed to cast vote";
    
//     throw new Error(errorMessage);
//   }
// }

// /**
//  * Check if user can vote (authenticated)
//  */
// export async function checkCanVote(token: string): Promise<CanVoteResponse> {
//   try {
//     const response = await apiClient.get<CanVoteResponse>(
//       `${API_BASE_URL}/votes/can-vote`,
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );
    
//     return response.data;
//   } catch (error) {
//     console.error("Error checking can vote:", error);
//     throw error;
//   }
// }

// /**
//  * Get vote status (authenticated)
//  */
// export async function getVoteStatus(token: string): Promise<VoteStatus> {
//   try {
//     const response = await apiClient.get<VoteStatusResponse>(
//       `${API_BASE_URL}/votes/status`,
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );
    
//     return response.data.data;
//   } catch (error) {
//     console.error("Error getting vote status:", error);
//     throw error;
//   }
// }

// /**
//  * Get my vote (authenticated)
//  */
// export async function getMyVote(token: string): Promise<Vote | null> {
//   try {
//     const response = await apiClient.get<{ success: boolean; data: Vote }>(
//       `${API_BASE_URL}/votes/my-vote`,
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );
    
//     if (response.data.success) {
//       return response.data.data;
//     }
//     return null;
//   } catch (error: any) {
//     // 404 means user hasn't voted yet
//     if (error.response?.status === 404) {
//       return null;
//     }
//     console.error("Error getting my vote:", error);
//     throw error;
//   }
// }

// /**
//  * Get vote count for a candidate (public)
//  */
// export async function getVoteCountForCandidate(
//   candidateId: number
// ): Promise<number> {
//   try {
//     const response = await apiClient.get<VoteCountResponse>(
//       `${API_BASE_URL}/votes/candidate/${candidateId}/count`
//     );
    
//     if (response.data.success) {
//       return response.data.vote_count;
//     }
//     return 0;
//   } catch (error) {
//     console.error(`Error getting vote count for candidate ${candidateId}:`, error);
//     return 0;
//   }
// }

// src/services/api/vote.tsx

import apiClient from "./apiClient";
import {
  Vote,
  VoteStatus,
  CastVoteRequest,
  CastVoteResponse,
  VoteCountResponse,
  CanVoteResponse,
  VoteStatusResponse,
} from "@/models/vote";

// Ensure API_BASE_URL always has /api/v1 suffix
const getVoteApiUrl = () => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";
  // If baseUrl doesn't end with /api/v1, append it
  if (!baseUrl.includes('/api/v1')) {
    return `${baseUrl}/api/v1`;
  }
  return baseUrl;
};

const API_BASE_URL = getVoteApiUrl();

/**
 * Cast a vote (authenticated, year 2025 only)
 */
export async function castVote(
  candidateId: number,
  token: string
): Promise<CastVoteResponse> {
  try {
    console.log("🗳️  Casting vote for candidate:", candidateId);
    const payload: CastVoteRequest = {
      candidate_id: candidateId,
    };
    
    const response = await apiClient.post<CastVoteResponse>(
      `${API_BASE_URL}/votes/cast`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    
    console.log("✅ Vote cast successfully");
    return response.data;
  } catch (error: any) {
    console.error("❌ Error casting vote:", error.message);
    
    // Extract error message from backend
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Failed to cast vote";
    
    throw new Error(errorMessage);
  }
}

/**
 * Check if user can vote (authenticated)
 */
export async function checkCanVote(token: string): Promise<CanVoteResponse> {
  try {
    const response = await apiClient.get<CanVoteResponse>(
      `${API_BASE_URL}/votes/can-vote`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
    return response.data;
  } catch (error: any) {
    // Handle 404 gracefully - endpoint may not exist
    if (error.response?.status === 404) {
      console.warn("⚠️  Vote can-vote endpoint not available (404), returning default response");
      return {
        success: true,
        can_vote: true,
        message: "Vote endpoint not configured"
      };
    }
    console.error("Error checking can vote:", error.message);
    // Return default allowing vote instead of throwing
    return {
      success: true,
      can_vote: true,
      message: "Unable to verify vote eligibility"
    };
  }
}

/**
 * Get vote status (authenticated)
 */
export async function getVoteStatus(token: string): Promise<VoteStatus> {
  try {
    const response = await apiClient.get<VoteStatusResponse>(
      `${API_BASE_URL}/votes/status`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
    return response.data.data;
  } catch (error: any) {
    // Handle 404 gracefully - endpoint may not exist
    if (error.response?.status === 404) {
      console.warn("⚠️  Vote status endpoint not available (404), returning default response");
      return {
        has_voted: false,
        vote_id: undefined,
        candidate_id: undefined,
        voted_at: undefined
      };
    }
    console.error("Error getting vote status:", error.message);
    // Return default status instead of throwing
    return {
      has_voted: false,
      vote_id: undefined,
      candidate_id: undefined,
      voted_at: undefined
    };
  }
}

/**
 * Get my vote (authenticated)
 */
export async function getMyVote(token: string): Promise<Vote | null> {
  try {
    const response = await apiClient.get<{ success: boolean; data: Vote }>(
      `${API_BASE_URL}/votes/my-vote`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
    if (response.data.success) {
      return response.data.data;
    }
    return null;
  } catch (error: any) {
    // 404 means user hasn't voted yet
    if (error.response?.status === 404) {
      return null;
    }
    console.error("Error getting my vote:", error);
    throw error;
  }
}

/**
 * Get vote count for a candidate (public)
 */
export async function getVoteCountForCandidate(
  candidateId: number
): Promise<number> {
  try {
    const response = await apiClient.get<VoteCountResponse>(
      `${API_BASE_URL}/votes/candidate/${candidateId}/count`
    );
    
    if (response.data.success) {
      return response.data.vote_count;
    }
    return 0;
  } catch (error) {
    console.error(`Error getting vote count for candidate ${candidateId}:`, error);
    return 0;
  }
}