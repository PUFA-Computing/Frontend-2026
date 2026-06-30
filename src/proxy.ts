// src/proxy.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Pattern: /compregen/cp-vcp/[token]/form
  const formPathRegex = /^\/compregen\/cp-vcp\/([^/]+)\/form$/;
  const match = pathname.match(formPathRegex);

  if (match) {
    const token = match[1];

    // [MOCK] Bypass session check when mock mode is active (local dev only)
    if (process.env.NEXT_PUBLIC_MOCK_COMPREGEN === "true") {
      return NextResponse.next();
    }

    const sessionCookie = request.cookies.get("compregen_session");

    if (!sessionCookie) {
      // Redirect to identity verification page
      const verifyUrl = new URL(`/compregen/cp-vcp/${token}/verify`, request.url);
      return NextResponse.redirect(verifyUrl);
    }
  }

  return NextResponse.next();
}

// Export as middleware for backward compatibility if the router looks for it
export const middleware = proxy;

export const config = {
  matcher: [
    // Match CP/VCP registration form route
    "/compregen/cp-vcp/:token/form",
  ],
};
