// src/components/compregen/AttemptCounter.tsx
import React from "react";

interface AttemptCounterProps {
  attemptsRemaining: number;
  maxAttempts?: number;
}

export default function AttemptCounter({
  attemptsRemaining,
  maxAttempts = 5,
}: AttemptCounterProps) {
  // Safe bounds check
  const safeAttemptsRemaining = Math.max(0, Math.min(maxAttempts, attemptsRemaining));
  const usedAttempts = maxAttempts - safeAttemptsRemaining;

  return (
    <div className="flex items-center justify-center gap-2 py-2">
      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mr-1">
        Attempts:
      </span>
      <div className="flex items-center gap-1.5">
        {Array.from({ length: maxAttempts }).map((_, index) => {
          const isUsed = index < usedAttempts;
          return (
            <span
              key={index}
              className={`h-3 w-3 rounded-full transition-all duration-300 ${
                isUsed
                  ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)] scale-110"
                  : "bg-gray-300"
              }`}
              title={isUsed ? "Attempt used" : "Attempt remaining"}
            />
          );
        })}
      </div>
    </div>
  );
}
