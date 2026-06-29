// src/app/(main)/compregen/cp-vcp/[token]/page.tsx
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { validateToken } from "@/services/api/cpVcpRegistration";
import { Spinner } from "@/components/ui/Spinner";

interface Props {
  params: {
    token: string;
  };
}

export default async function TokenLandingPage({ params }: Props) {
  const { token } = params;

  // Validate token status from backend
  const { status } = await validateToken(token);

  if (status === "active") {
    // If the token is active, check if the session cookie exists
    const hasSession = cookies().has("compregen_session");
    if (hasSession) {
      redirect(`/compregen/cp-vcp/${token}/form`);
    } else {
      redirect(`/compregen/cp-vcp/${token}/verify`);
    }
  } else {
    // If used, expired, or invalid token
    redirect(`/compregen/cp-vcp/${token}/invalid`);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FBFBFB]">
      <div className="text-center">
        <Spinner size="large" />
        <p className="mt-4 text-sm text-gray-500 font-medium">Validating invite link...</p>
      </div>
    </div>
  );
}
