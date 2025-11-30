// src/app/(main)/vote/_components/VotePageClient.tsx

"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { VoteCandidateCard } from "./VoteCandidateCard";
import { VoteModal } from "./VoteModal";
import { VotingBanner } from "./VotingBanner";
import { VoteSuccessModal } from "./VoteSuccessModal";
import { Candidate } from "@/models/candidate";
import { VoteStatus, CanVoteResponse } from "@/models/vote";
import { castVote } from "@/services/api/vote";
import toast from "react-hot-toast";
import { Sparkles, AlertTriangle, CheckCircle2 } from "lucide-react";

interface VotePageClientProps {
  initialCandidates: Candidate[];
  initialVoteStatus: VoteStatus | null;
  initialCanVote: CanVoteResponse | null;
  userMajor: string;
  userYear: string;
  token: string;
  errorMessage: string | null;
}

export default function VotePageClient({
  initialCandidates,
  initialVoteStatus,
  initialCanVote,
  userMajor,
  userYear,
  token,
  errorMessage,
}: VotePageClientProps) {
  const router = useRouter();
  const [candidates, setCandidates] = useState<Candidate[]>(initialCandidates);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [hasVoted, setHasVoted] = useState(initialVoteStatus?.has_voted || false);
  const [votedCandidateId, setVotedCandidateId] = useState<number | undefined>(
    initialVoteStatus?.candidate_id
  );
  const [isVoting, setIsVoting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [canVote, setCanVote] = useState(initialCanVote?.can_vote || false);
  const [canVoteMessage, setCanVoteMessage] = useState(initialCanVote?.message || "");
  const [showConfirmation, setShowConfirmation] = useState(false);
  
  // Sync state with props when they change (fixes navigation bug)
  useEffect(() => {
    setCandidates(initialCandidates);
    setHasVoted(initialVoteStatus?.has_voted || false);
    setVotedCandidateId(initialVoteStatus?.candidate_id);
    setCanVote(initialCanVote?.can_vote || false);
    setCanVoteMessage(initialCanVote?.message || "");
  }, [initialCandidates, initialVoteStatus, initialCanVote]);
     
  const handleVote = async (candidateId: number) => {
    if (hasVoted) {
      toast.error("You have already voted!");
      return;
    }
    
    setIsVoting(true);
    
    try {
      const response = await castVote(candidateId, token);
      
      if (response.success) {
        // Update state
        setHasVoted(true);
        setVotedCandidateId(candidateId);
        setSelectedCandidate(null);
        
        // Show success modal
        setShowSuccessModal(true);
        
        toast.success("Vote cast successfully!");
        
        // Refresh the router to update server-side props and invalidate cache
        router.refresh();
      }
    } catch (error: any) {
      console.error("Error casting vote:", error);
      toast.error(error.message || "Failed to cast vote. Please try again.");
    } finally {
      setIsVoting(false);
    }
  };
  
  // Add this to VotePageClient.ts
  const handleVoteClick = (candidate: Candidate) => {
      setSelectedCandidate(candidate);
      setShowConfirmation(true); // Show confirmation first
  };

  // Error state
  if (errorMessage) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-md p-8 text-center bg-white shadow-xl rounded-2xl">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="mb-2 text-xl font-bold text-gray-900">Error Loading Votes</h3>
          <p className="text-gray-600">{errorMessage}</p>
        </div>
      </div>
    );
  }
  
  // Ineligible to vote (only if NOT voted yet)
  // If they have voted, we skip this block so they see the main interface (read-only)
  if (!canVote && !hasVoted) {
    return (
      <div className="min-h-screen">
        <VotingBanner
          userMajor={userMajor}
          userYear={userYear}
          totalCandidates={candidates.length}
          hasVoted={hasVoted}
        />
        
        <div className="max-w-4xl px-4 py-16 mx-auto">
          <div className="p-8 text-center border shadow-lg bg-amber-50 border-amber-200 rounded-2xl">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-amber-100">
              <AlertTriangle className="w-8 h-8 text-amber-600" />
            </div>
            <h3 className="mb-3 text-2xl font-bold text-gray-900">
              Not Eligible to Vote
            </h3>
            <p className="mb-4 leading-relaxed text-gray-700">
              {canVoteMessage || "You are not eligible to vote at this time."}
            </p>
            <div className="p-4 text-sm text-left bg-white rounded-lg">
              <p className="mb-2 font-semibold text-gray-900">Voting Requirements:</p>
              <ul className="space-y-1 text-gray-600">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className={`h-4 w-4 ${userYear === "2025" ? "text-green-500" : "text-gray-400"}`} />
                  Year must be 2025 {userYear !== "2025" && `(Your year: ${userYear})`}
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className={`h-4 w-4 ${["informatics", "information system"].includes(userMajor) ? "text-green-500" : "text-gray-400"}`} />
                  Valid major (Informatics or Information System)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className={`h-4 w-4 ${!hasVoted ? "text-green-500" : "text-gray-400"}`} />
                  Haven't voted yet
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // No candidates available
  if (candidates.length === 0) {
    return (
      <div className="min-h-screen">
        <VotingBanner
          userMajor={userMajor}
          userYear={userYear}
          totalCandidates={0}
          hasVoted={hasVoted}
        />
        
        <div className="max-w-4xl px-4 py-16 mx-auto">
          <div className="p-8 text-center bg-white shadow-xl rounded-2xl">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full">
              <Sparkles className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-gray-900">
              No Candidates Available
            </h3>
            <p className="text-gray-600">
              There are currently no candidates for your major. Please check back later.
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  // Main voting interface
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Banner */}
      <VotingBanner
        userMajor={userMajor}
        userYear={userYear}
        totalCandidates={candidates.length}
        hasVoted={hasVoted}
      />
      
      {/* Candidates Grid */}
      <div className="max-w-6xl px-4 py-16 mx-auto">
        {hasVoted && (
          <div className="flex items-center gap-3 p-4 mb-8 border border-green-200 bg-green-50 rounded-xl">
            <CheckCircle2 className="flex-shrink-0 w-6 h-6 text-green-600" />
            <p className="font-medium text-green-800">
              Thank you for voting! Your vote has been recorded successfully.
            </p>
          </div>
        )}
        
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {candidates.map((candidate) => (
            <VoteCandidateCard
              key={candidate.id}
              candidate={candidate}
              onCardClick={() => setSelectedCandidate(candidate)}
              hasVoted={hasVoted}
              votedForThisCandidate={votedCandidateId === candidate.id}
              voteCount={candidate.vote_count || 0}
            />
          ))}
        </div>
      </div>
      
      {/* Vote Modal */}
      <VoteModal
        candidate={selectedCandidate}
        isOpen={selectedCandidate !== null}
        onClose={() => setSelectedCandidate(null)}
        onVote={handleVote}
        isVoting={isVoting}
        hasVoted={hasVoted}
      />
      
      {/* Success Modal */}
      <VoteSuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        candidateName={
          candidates.find((c) => c.id === votedCandidateId)?.name || ""
        }
      />
    </div>
  );
}