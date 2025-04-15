import Login from "@/services/api/auth";
import { GetUser, GetUserProfile } from "@/services/api/user";
import { UserType } from "@/types/next-auth";
import { AxiosError } from "axios";
import { NextAuthOptions, getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

interface Credentials extends Record<"username" | "password", string> {
    passcode?: string;
}

export const authOptions: NextAuthOptions = {
    session: {
        strategy: "jwt",
    },
    providers: [
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
                    const response = await Login(
                        credentials.username,
                        credentials.password,
                        credentials.passcode
                    );
                    console.log("Login response:", JSON.stringify(response, null, 2));
                    
                    // Check if user_id or access_token is null
                    if (!response.data.user_id || !response.data.access_token) {
                        console.error("Missing user_id or access_token in response:", response);
                        throw new Error("Invalid response from server");
                    }
                    
                    const user = await GetUserProfile(
                        response.data.user_id,
                        response.data.access_token
                    );
                    console.log("User profile:", JSON.stringify(user, null, 2));
                    
                    return {
                        id: response.data.user_id,
                        access_token: response.data.access_token,
                        ...user,
                    };
                } catch (err) {
                    console.error("Authorization error:", err);
                    if (err instanceof AxiosError) {
                        console.error("Response data:", err.response?.data);
                        throw new Error(
                            err.response?.data.message || err.message
                        );
                    }
                    throw err;
                }
            }
        }),
    ],
    callbacks: {
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
                            // Prioritaskan data dari API, tetapi pertahankan token
                            session.user = { 
                                ...formattedData,
                                id: session.user.id, // Pastikan ID tetap sama
                                access_token: session.user.access_token // Pastikan token tetap sama
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
};

export async function getSessionServer() {
    const session = await getServerSession(authOptions);
    return session;
}
