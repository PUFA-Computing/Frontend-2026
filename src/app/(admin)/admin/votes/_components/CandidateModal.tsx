"use client";

import React, { useState, useEffect } from "react";
import { Candidate } from "@/models/candidate";
import { updateCandidate } from "@/services/api/candidate";
import MissionPointsInput from "./MissionPointsInput";
import { X, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

interface CandidateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  candidate: Candidate | null;
  accessToken: string;
}

export default function CandidateModal({
  isOpen,
  onClose,
  onSuccess,
  candidate,
  accessToken,
}: CandidateModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    class: "",
    vision: "",
  });
  const [missionPoints, setMissionPoints] = useState<string[]>([""]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load candidate data when editing
  useEffect(() => {
    if (candidate) {
      setFormData({
        name: candidate.name,
        class: candidate.class || "",
        vision: candidate.vision || "",
      });

      // Convert mission from paragraph to points
      if (candidate.mission) {
        const points = candidate.mission.split("\n").filter((p) => p.trim());
        setMissionPoints(points.length > 0 ? points : [""]);
      } else {
        setMissionPoints([""]);
      }
    }
  }, [candidate, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!candidate) {
      toast.error("No candidate selected for editing");
      return;
    }

    // Validation
    if (!formData.name.trim()) {
      toast.error("Please enter candidate name");
      return;
    }

    // Convert mission points to paragraph (join with newlines)
    const mission = missionPoints
      .filter((p) => p.trim())
      .join("\n");

    // Prepare form data
    const submitData = new FormData();
    const candidateData = {
      name: formData.name,
      class: formData.class || undefined,
      vision: formData.vision || undefined,
      mission: mission || undefined,
    };

    submitData.append("data", JSON.stringify(candidateData));

    setIsSubmitting(true);

    try {
      const result = await updateCandidate(candidate.id, submitData, accessToken);

      if (result.success) {
        toast.success("Candidate updated successfully");
        onSuccess();
      } else {
        toast.error(result.message || "Update failed");
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !candidate) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-3xl bg-gray-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-white">
            Edit Candidate
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            disabled={isSubmitting}
          >
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Enter candidate name"
              required
              className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg 
                text-white placeholder-gray-400 focus:outline-none focus:ring-2 
                focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Class */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Class
            </label>
            <input
              type="text"
              value={formData.class}
              onChange={(e) =>
                setFormData({ ...formData, class: e.target.value })
              }
              placeholder="e.g., 2024"
              className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg 
                text-white placeholder-gray-400 focus:outline-none focus:ring-2 
                focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Vision */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Vision
            </label>
            <textarea
              value={formData.vision}
              onChange={(e) =>
                setFormData({ ...formData, vision: e.target.value })
              }
              placeholder="Enter candidate's vision"
              rows={3}
              className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg 
                text-white placeholder-gray-400 focus:outline-none focus:ring-2 
                focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Mission Points */}
          <MissionPointsInput
            points={missionPoints}
            onChange={setMissionPoints}
          />

          {/* Submit Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-700">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg 
                transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 
                hover:from-blue-700 hover:to-purple-700 text-white font-semibold 
                rounded-lg shadow-lg transition-all duration-200 disabled:opacity-50 
                flex items-center gap-2"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {isSubmitting ? "Saving..." : "Update Candidate"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
