import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSessionServer } from "@/lib/auth";
import CompleteProfileForm from "./_components/CompleteProfileForm";

export const metadata: Metadata = {
    title: "Complete Your Profile",
};

export default async function CompleteProfilePage() {
    const session = await getSessionServer();
    if (!session?.user) return redirect("/auth/signin");
    // If they don't actually need to complete, ship them straight to the dashboard.
    if (!session.user.needs_completion) return redirect("/dashboard");

    return (
        <div
            className="bg-cover bg-center"
            style={{ backgroundImage: `url('/doodle.svg')` }}
        >
            <div className="container mx-auto flex min-h-screen items-center justify-center px-6">
                <div className="mx-auto max-w-lg">
                    <CompleteProfileForm
                        email={session.user.email}
                        accessToken={session.user.access_token}
                        firstName={session.user.first_name}
                    />
                </div>
            </div>
        </div>
    );
}
