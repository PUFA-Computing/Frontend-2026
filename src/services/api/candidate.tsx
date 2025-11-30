// src/services/api/candidate.ts

import { Candidate, CandidateResponse } from "@/models/candidate";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

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
    
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch candidates: ${response.statusText}`);
    }

    const data: CandidateResponse = await response.json();
    return Array.isArray(data.data) ? data.data : [];
  } catch (error) {
    console.error("Error fetching candidates:", error);
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

    const response = await fetch(`${API_URL}/candidates/${id}`, {
      method: "GET",
      headers,
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch candidate: ${response.statusText}`);
    }

    const data: CandidateResponse = await response.json();
    return !Array.isArray(data.data) ? data.data : null;
  } catch (error) {
    console.error("Error fetching candidate:", error);
    return null;
  }
}

/**
 * Create a new candidate (Admin only)
 */
export async function createCandidate(formData: FormData, token: string): Promise<{ success: boolean; message?: string }> {
  try {
    const response = await fetch(`${API_URL}/candidates/create`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to create candidate");
    }

    return { success: true, message: data.message };
  } catch (error: any) {
    console.error("Error creating candidate:", error);
    return { success: false, message: error.message || "Failed to create candidate" };
  }
}

/**
 * Update an existing candidate (Admin only)
 */
export async function updateCandidate(id: number, formData: FormData, token: string): Promise<{ success: boolean; message?: string }> {
  try {
    const response = await fetch(`${API_URL}/candidates/${id}/edit`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to update candidate");
    }

    return { success: true, message: data.message };
  } catch (error: any) {
    console.error("Error updating candidate:", error);
    return { success: false, message: error.message || "Failed to update candidate" };
  }
}

/**
 * Delete a candidate (Admin only)
 */
export async function deleteCandidate(id: number, token: string): Promise<{ success: boolean; message?: string }> {
  try {
    const response = await fetch(`${API_URL}/candidates/${id}/delete`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to delete candidate");
    }

    return { success: true, message: data.message };
  } catch (error: any) {
    console.error("Error deleting candidate:", error);
    return { success: false, message: error.message || "Failed to delete candidate" };
  }
}

/**
 * Fetch candidates for the current user's major
 */
export async function fetchCandidatesForMyMajor(token: string): Promise<Candidate[]> {
  try {
    const response = await fetch(`${API_URL}/candidates/my-major`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch candidates: ${response.statusText}`);
    }

    const data = await response.json();
    return Array.isArray(data.data) ? data.data : [];
  } catch (error) {
    console.error("Error fetching candidates for major:", error);
    return [];
  }
}