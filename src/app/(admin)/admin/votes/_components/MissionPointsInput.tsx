"use client";

import React from "react";
import { Plus, X } from "lucide-react";

interface MissionPointsInputProps {
  points: string[];
  onChange: (points: string[]) => void;
}

export default function MissionPointsInput({
  points,
  onChange,
}: MissionPointsInputProps) {
  const handleAddPoint = () => {
    onChange([...points, ""]);
  };

  const handleRemovePoint = (index: number) => {
    const newPoints = points.filter((_, i) => i !== index);
    onChange(newPoints.length > 0 ? newPoints : [""]);
  };

  const handlePointChange = (index: number, value: string) => {
    const newPoints = [...points];
    newPoints[index] = value;
    onChange(newPoints);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-300">
          Mission Points
        </label>
        <button
          type="button"
          onClick={handleAddPoint}
          className="flex items-center gap-1 px-3 py-1 bg-blue-600/20 hover:bg-blue-600/40 
            text-blue-400 rounded-lg text-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Point
        </button>
      </div>

      <div className="space-y-2">
        {points.map((point, index) => (
          <div key={index} className="flex items-start gap-2">
            <div className="flex-shrink-0 w-6 h-10 flex items-center justify-center">
              <span className="text-gray-400 font-medium">{index + 1}.</span>
            </div>
            <textarea
              value={point}
              onChange={(e) => handlePointChange(index, e.target.value)}
              placeholder={`Mission point ${index + 1}`}
              rows={2}
              className="flex-1 px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg 
                text-white placeholder-gray-400 focus:outline-none focus:ring-2 
                focus:ring-blue-500 focus:border-transparent resize-none"
            />
            {points.length > 1 && (
              <button
                type="button"
                onClick={() => handleRemovePoint(index)}
                className="flex-shrink-0 p-2 bg-red-600/20 hover:bg-red-600/40 
                  text-red-400 rounded-lg transition-colors"
                title="Remove point"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-400">
        Each point will be displayed as a separate bullet in the vote modal
      </p>
    </div>
  );
}
