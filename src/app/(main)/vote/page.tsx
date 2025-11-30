

// import { redirect } from "next/navigation";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth";
// import { fetchCandidatesForMyMajor } from "@/services/api/candidate";
// import { getVoteStatus, checkCanVote } from "@/services/api/vote";
// import VotePageClient from "./_components/VotePageClient";
// import type { Metadata } from "next";

// export const metadata: Metadata = {
//   title: "Vote for Major Leader | PUFA Computer Science",
//   description: "Cast your vote for the next Major Leader of your program",
// };

// export const revalidate = 0;
// export const dynamic = "force-dynamic";

// export default async function VotePage() {
//   console.log("=".repeat(80));
//   console.log("🗳️  VOTE PAGE - SERVER SIDE RENDERING");
//   console.log("=".repeat(80));
  
//   // Check authentication
//   const session = await getServerSession(authOptions);
  
//   console.log("📋 Session status:", session ? "✅ Authenticated" : "❌ Not authenticated");
  
//   if (!session || !session.user) {
//     console.log("❌ No session found, redirecting to signin");
//     console.log("=".repeat(80));
//     redirect("/auth/signin");
//   }
  
//   const user = session.user;
//   const token = user.access_token;
  
//   console.log("👤 User Information:");
//   console.log("   - ID:", user.id);
//   console.log("   - Username:", user.username);
//   console.log("   - Email:", user.email);
//   console.log("   - Major:", user.major);
//   console.log("   - Year:", user.year);
//   console.log("   - Token (first 20 chars):", token?.substring(0, 20) + "...");
  
//   // Fetch initial data server-side
//   let candidates = [];
//   let voteStatus = null;
//   let canVoteData = null;
//   let errorMessage = null;
  
//   try {
//     console.log("\n📊 Fetching candidates for user's major...");
//     console.log("   - User's major:", user.major);
//     console.log("   - API endpoint: /candidates/my-major");
    
//     // Fetch candidates for user's major
//     candidates = await fetchCandidatesForMyMajor(token);
//     console.log(`✅ Candidates fetched: ${candidates.length} candidates found`);
    
//     if (candidates.length > 0) {
//       console.log("📋 Candidate list:");
//       candidates.forEach((c, idx) => {
//         console.log(`   ${idx + 1}. ${c.name} (${c.major}) - ID: ${c.id}`);
//       });
//     } else {
//       console.warn("⚠️  No candidates found for major:", user.major);
//     }
    
//     // Check vote status
//     try {
//       console.log("\n🔍 Checking vote status...");
//       voteStatus = await getVoteStatus(token);
//       console.log("✅ Vote status:", JSON.stringify(voteStatus, null, 2));
//     } catch (error: any) {
//       console.error("⚠️  Error fetching vote status:", error.message);
//     }
    
//     // Check if user can vote
//     try {
//       console.log("\n🔍 Checking if user can vote...");
//       canVoteData = await checkCanVote(token);
//       console.log("✅ Can vote data:", JSON.stringify(canVoteData, null, 2));
//     } catch (error: any) {
//       console.error("⚠️  Error checking can vote:", error.message);
//     }
//   } catch (error: any) {
//     console.error("\n❌ ERROR fetching vote page data:");
//     console.error("   - Error type:", error.constructor.name);
//     console.error("   - Message:", error.message);
//     console.error("   - Response status:", error.response?.status);
//     console.error("   - Response data:", JSON.stringify(error.response?.data, null, 2));
//     console.error("   - Stack:", error.stack);
//     errorMessage = error.response?.data?.message || error.message || "Failed to load voting data. Please try again later.";
//   }
  
//   console.log("\n📦 Final data summary:");
//   console.log("   - Candidates:", candidates.length);
//   console.log("   - Vote status:", voteStatus ? "Available" : "Not available");
//   console.log("   - Can vote data:", canVoteData ? "Available" : "Not available");
//   console.log("   - Error message:", errorMessage || "None");
//   console.log("=".repeat(80));
  
//   return (
//     <VotePageClient
//       initialCandidates={candidates}
//       initialVoteStatus={voteStatus}
//       initialCanVote={canVoteData}
//       userMajor={user.major}
//       userYear={user.year}
//       token={token}
//       errorMessage={errorMessage}
//     />
//   );
// }

import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { fetchCandidatesForMyMajor } from "@/services/api/candidate";
import { getVoteStatus, checkCanVote } from "@/services/api/vote";
import VotePageClient from "./_components/VotePageClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vote for Major Leader | PUFA Computer Science",
  description: "Cast your vote for the next Major Leader of your program",
};

export const revalidate = 0;
export const dynamic = "force-dynamic";

export default async function VotePage() {
  console.log("=".repeat(80));
  console.log("🗳️  VOTE PAGE - SERVER SIDE RENDERING");
  console.log("=".repeat(80));
  
  // Check authentication
  const session = await getServerSession(authOptions);
  
  console.log("📋 Session status:", session ? "✅ Authenticated" : "❌ Not authenticated");
  
  if (!session || !session.user) {
    console.log("❌ No session found, redirecting to signin");
    console.log("=".repeat(80));
    redirect("/auth/signin");
  }
  
  const user = session.user;
  const token = user.access_token;
  
  console.log("👤 User Information:");
  console.log("   - ID:", user.id);
  console.log("   - Username:", user.username);
  console.log("   - Email:", user.email);
  console.log("   - Major:", user.major);
  console.log("   - Year:", user.year);
  
  // Fetch initial data server-side
  let candidates = [];
  let voteStatus = null;
  let canVoteData = null;
  let errorMessage = null;
  
  try {
    console.log("\n📊 Fetching candidates for user's major...");
    console.log("   - User's major:", user.major);
    
    // Fetch candidates for user's major
    candidates = await fetchCandidatesForMyMajor(token);
    console.log(`✅ Candidates fetched: ${candidates.length} candidates found`);
    
    if (candidates.length > 0) {
      console.log("📋 Candidate list:");
      candidates.forEach((c, idx) => {
        console.log(`   ${idx + 1}. ${c.name} (${c.major}) - ID: ${c.id}`);
      });
    } else {
      console.warn("⚠️  No candidates found for major:", user.major);
    }
    
    // Check vote status
    try {
      console.log("\n🔍 Checking vote status...");
      voteStatus = await getVoteStatus(token);
      console.log("✅ Vote status:", voteStatus);
    } catch (error: any) {
      console.error("⚠️  Error fetching vote status:", error.message);
    }
    
    // Check if user can vote
    try {
      console.log("\n🔍 Checking if user can vote...");
      canVoteData = await checkCanVote(token);
      console.log("✅ Can vote data:", canVoteData);
    } catch (error: any) {
      console.error("⚠️  Error checking can vote:", error.message);
    }
  } catch (error: any) {
    console.error("\n❌ ERROR fetching vote page data:");
    console.error("   - Error type:", error.constructor.name);
    console.error("   - Message:", error.message);
    console.error("   - Response status:", error.response?.status);
    console.error("   - Response data:", error.response?.data);
    errorMessage = error.response?.data?.message || error.message || "Failed to load voting data. Please try again later.";
  }
  
  console.log("\n📦 Final data summary:");
  console.log("   - Candidates:", candidates.length);
  console.log("   - Vote status:", voteStatus ? "Available" : "Not available");
  console.log("   - Can vote data:", canVoteData ? "Available" : "Not available");
  console.log("   - Error message:", errorMessage || "None");
  console.log("=".repeat(80));
  
  return (
    <VotePageClient
      initialCandidates={candidates}
      initialVoteStatus={voteStatus}
      initialCanVote={canVoteData}
      userMajor={user.major}
      userYear={user.year}
      token={token}
      errorMessage={errorMessage}
    />
  );
}