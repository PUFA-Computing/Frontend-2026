import { GetUserProfile } from "@/services/api/user";
import { UserType } from "@/types/next-auth";
import { AxiosError } from "axios";
import { NextAuthOptions, getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

// BACKEND_URL is a runtime env var (not NEXT_PUBLIC_), so it works inside Docker
// where localhost would refer to the container itself, not the backend.
// Local:       BACKEND_URL=http://backend-dev:8080/api/v1
// Production:  BACKEND_URL=<same as NEXT_PUBLIC_API_URL or left unset>
const getBackendUrl = () => process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

interface Credentials extends Record<"username" | "password", string> {
    passcode?: string;
}

export const authOptions: NextAuthOptions = {
    session: {
        strategy: "jwt",
    },
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID ?? "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
            // We need the ID token to forward to the Go backend for verification.
            authorization: { params: { prompt: "select_account", access_type: "offline" } },
        }),
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                username: {
                    label: "Username",
                    type: "text",
                    placeholder: "jsmith",
                },
                password: { label: "Password", type: "password" },
                passcode: { label: "Passcode", type: "text" },
            },
            async authorize(credentials, req) {
                if (!credentials) {
                    throw new Error("No credentials provided");
                }
                try {
                    const backendUrl = getBackendUrl();
                    console.log(`[Auth] Using backend URL: ${backendUrl}`);

                    const body: Record<string, string> = {
                        username: credentials.username,
                        password: credentials.password,
                    };
                    if (credentials.passcode) body.passcode = credentials.passcode;

                    const res = await fetch(`${backendUrl}/auth/login`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(body),
                    });

                    const response = await res.json();
                    console.log("Login response:", JSON.stringify(response, null, 2));

                    if (!res.ok || !response.success) {
                        console.error("Login failed:", response);
                        throw new Error(response.message || "Invalid Credentials");
                    }

                    if (!response.data?.user_id || !response.data?.access_token) {
                        console.error("Missing user_id or access_token in response:", response);
                        throw new Error("Invalid response from server - missing user_id or access_token");
                    }

                    const userRes = await fetch(`${backendUrl}/user/${response.data.user_id}`, {
                        headers: { Authorization: `Bearer ${response.data.access_token}` },
                    });
                    const userBody = await userRes.json();
                    const user = userBody?.data;
                    console.log("User profile:", JSON.stringify(user, null, 2));

                    return {
                        id: response.data.user_id,
                        access_token: response.data.access_token,
                        ...user,
                    };
                } catch (err) {
                    console.error("Authorization error:", err);
                    throw err;
                }
            }
        }),
    ],
    callbacks: {
        // signIn fires *before* jwt/session. We use it to exchange Google's
        // id_token for our backend JWT, then attach the result onto the
        // `user` object so the jwt() callback below can hoist it into the
        // NextAuth token. Returning false here aborts the sign-in.
        async signIn({ user, account, profile }) {
            if (account?.provider !== "google") return true;

            const idToken = (account as any).id_token as string | undefined;
            if (!idToken) {
                console.error("[Auth][google] No id_token in account");
                return false;
            }

            try {
                const backendUrl = getBackendUrl();
                const res = await fetch(`${backendUrl}/auth/google`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id_token: idToken }),
                });
                const body = await res.json();
                if (!res.ok || !body.success) {
                    console.error("[Auth][google] backend rejected:", body);
                    return false;
                }

                // Stuff backend payload into `user`. NextAuth merges this into
                // the JWT via the jwt() callback below.
                const data = body.data;
                Object.assign(user as any, {
                    id: data.user_id,
                    access_token: data.access_token,
                    email: data.email ?? user.email,
                    role_id: data.role_id,
                    needs_completion: data.needs_completion,
                    profile_completed: !data.needs_completion,
                    auth_provider: data.was_linked ? "both" : "google",
                });
                return true;
            } catch (err) {
                console.error("[Auth][google] exchange failed:", err);
                return false;
            }
        },

        async session({ token, session }) {
            if (token) {
                session.user = token;
            }

            // Pastikan sesi tetap valid meskipun terjadi error saat mengambil data pengguna
            try {
                // Log session user untuk debugging
                console.log("Session token:", token);
                console.log("Session user before update:", session.user);

                // Hanya coba update jika user ID dan access token tersedia
                if (session.user?.id && session.user?.access_token) {
                    try {
                        console.log("Fetching user profile with ID:", session.user.id);

                        // Ambil data pengguna dari API
                        const result = await GetUserProfile(
                            session.user.id,
                            session.user.access_token
                        );

                        console.log("User profile result:", result);

                        if (result) {
                            // Hapus password dari hasil jika ada
                            const { password, ...userData } = result;

                            // Format date_of_birth jika ada
                            let formattedData = { ...userData };
                            if (userData.date_of_birth) {
                                formattedData.date_of_birth = typeof userData.date_of_birth === 'string'
                                    ? userData.date_of_birth
                                    : String(userData.date_of_birth);
                            }

                            // Gabungkan dengan session.user yang sudah ada
                            // Prioritaskan data dari API, tetapi pertahankan token + needs_completion
                            session.user = {
                                ...formattedData,
                                id: session.user.id, // Pastikan ID tetap sama
                                access_token: session.user.access_token, // Pastikan token tetap sama
                                // Preserve Google-flow flags that the backend's
                                // GET /user/:id doesn't include in the legacy response.
                                needs_completion: session.user.needs_completion ?? !(formattedData as any).profile_completed,
                                profile_completed: (formattedData as any).profile_completed ?? session.user.profile_completed,
                                auth_provider: (formattedData as any).auth_provider ?? session.user.auth_provider,
                            };

                            console.log("Session user after update:", session.user);
                        }
                    } catch (profileErr) {
                        console.error("Error fetching user profile:", profileErr);
                        // Biarkan session.user tetap seperti semula jika gagal mengambil profil
                    }
                } else {
                    console.warn("Cannot update user profile: missing id or access_token");
                }
            } catch (err) {
                console.error("Session callback error:", err);
                // Jangan throw error, biarkan sesi tetap valid
            }

            return session;
        },
        // @ts-ignore
        async jwt({ token, user }) {
            return { ...token, ...user };
        },
    },
    // Make sure the secret is set
    secret: process.env.NEXTAUTH_SECRET,
};

export async function getSessionServer() {
    const session = await getServerSession(authOptions);
    return session;
}
