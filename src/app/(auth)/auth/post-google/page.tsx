import { redirect } from "next/navigation";
import { getSessionServer } from "@/lib/auth";

/**
 * Landing page that runs immediately after a successful Google sign-in.
 *
 * NextAuth's signIn() can't pass arbitrary flags back to the client, so the
 * Google flow always redirects here. We read the freshly-minted session and
 * route to one of:
 *   - /auth/complete-profile  → @student.president.ac.id new sign-up that
 *                               still needs Student ID + batch
 *   - /dashboard              → everyone else
 *   - /auth/signin            → session never materialized (something failed)
 */
export default async function PostGooglePage() {
    const session = await getSessionServer();
    if (!session?.user) {
        return redirect("/auth/signin?error=google");
    }
    if (session.user.needs_completion) {
        return redirect("/auth/complete-profile");
    }
    return redirect("/dashboard");
}
