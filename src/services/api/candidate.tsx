// src/services/api/candidate.ts

import { Candidate, CandidateResponse } from "@/models/candidate";

// Ensure API_URL always has /api/v1 suffix
const getApiUrl = () => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";
  // If baseUrl doesn't end with /api/v1, append it
  if (!baseUrl.includes('/api/v1')) {
    return `${baseUrl}/api/v1`;
  }
  return baseUrl;
};

const API_URL = getApiUrl();

/**
 * Fetch all candidates with optional filtering
 */
export async function fetchCandidates(params?: {
  major?: string;
  class?: string;
  page?: number;
}): Promise<Candidate[]> {
  try {
    const queryParams = new URLSearchParams();
    if (params?.major) queryParams.append("major", params.major);
    if (params?.class) queryParams.append("class", params.class);
    if (params?.page) queryParams.append("page", params.page.toString());

    const url = `${API_URL}/candidates${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
    console.log("📋 Fetching candidates from:", url);
    
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      console.warn(`⚠️  Candidates endpoint returned ${response.status}: ${response.statusText}`);
      // Return empty array instead of throwing for 404 or other errors
      return [];
    }

    const data: CandidateResponse = await response.json();
    const candidates = Array.isArray(data.data) ? data.data : [];
    console.log(`✅ Fetched ${candidates.length} candidates`);
    return candidates;
  } catch (error: any) {
    console.error("❌ Error fetching candidates:", error.message);
    // Return empty array on any error instead of throwing
    return [];
  }
}

/**
 * Fetch a single candidate by ID
 */
export async function fetchCandidateById(id: number, token?: string): Promise<Candidate | null> {
  try {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };
    
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const url = `${API_URL}/candidates/${id}`;
    console.log("📋 Fetching candidate by ID:", id);
    
    const response = await fetch(url, {
      method: "GET",
      headers,
      cache: "no-store",
    });

    if (!response.ok) {
      console.warn(`⚠️  Candidate endpoint returned ${response.status}: ${response.statusText}`);
      return null;
    }

    const data: CandidateResponse = await response.json();
    const candidate = !Array.isArray(data.data) ? data.data : null;
    if (candidate) {
      console.log(`✅ Fetched candidate: ${candidate.name}`);
    }
    return candidate;
  } catch (error: any) {
    console.error("❌ Error fetching candidate:", error.message);
    return null;
  }
}

/**
 * Create a new candidate (Admin only)
 */
export async function createCandidate(formData: FormData, token: string): Promise<{ success: boolean; message?: string }> {
  try {
    console.log("📝 Creating new candidate...");
    const response = await fetch(`${API_URL}/candidates/create`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      console.warn(`⚠️  Create candidate failed: ${response.status}`);
      return { success: false, message: data.message || "Failed to create candidate" };
    }

    console.log("✅ Candidate created successfully");
    return { success: true, message: data.message };
  } catch (error: any) {
    console.error("❌ Error creating candidate:", error.message);
    return { success: false, message: error.message || "Failed to create candidate" };
  }
}

/**
 * Update an existing candidate (Admin only)
 */
export async function updateCandidate(id: number, formData: FormData, token: string): Promise<{ success: boolean; message?: string }> {
  try {
    console.log("📝 Updating candidate:", id);
    const response = await fetch(`${API_URL}/candidates/${id}/edit`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      console.warn(`⚠️  Update candidate failed: ${response.status}`);
      return { success: false, message: data.message || "Failed to update candidate" };
    }

    console.log("✅ Candidate updated successfully");
    return { success: true, message: data.message };
  } catch (error: any) {
    console.error("❌ Error updating candidate:", error.message);
    return { success: false, message: error.message || "Failed to update candidate" };
  }
}

/**
 * Delete a candidate (Admin only)
 */
export async function deleteCandidate(id: number, token: string): Promise<{ success: boolean; message?: string }> {
  try {
    console.log("🗑️  Deleting candidate:", id);
    const response = await fetch(`${API_URL}/candidates/${id}/delete`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      console.warn(`⚠️  Delete candidate failed: ${response.status}`);
      return { success: false, message: data.message || "Failed to delete candidate" };
    }

    console.log("✅ Candidate deleted successfully");
    return { success: true, message: data.message };
  } catch (error: any) {
    console.error("❌ Error deleting candidate:", error.message);
    return { success: false, message: error.message || "Failed to delete candidate" };
  }
}

/**
 * Fetch candidates for the current user's major
 */
export async function fetchCandidatesForMyMajor(token: string): Promise<Candidate[]> {
  try {
    const url = `${API_URL}/candidates/my-major`;
    console.log("📋 Fetching candidates for user's major from:", url);
    
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      console.warn(`⚠️  Candidates/my-major endpoint returned ${response.status}: ${response.statusText}`);
      // Return empty array instead of throwing for 404 or other errors
      return [];
    }

    const data = await response.json();
    const candidates = Array.isArray(data.data) ? data.data : [];
    console.log(`✅ Fetched ${candidates.length} candidates for user's major`);
    return candidates;
  } catch (error: any) {
    console.error("❌ Error fetching candidates for major:", error.message);
    // Return empty array on any error instead of throwing
    return [];
  }
}