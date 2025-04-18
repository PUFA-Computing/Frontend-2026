import GetVersion from "@/services/api/version";
import ClientMainLayout from "./_components/ClientMainLayout";

export default async function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const version = await GetVersion();

    return <ClientMainLayout version={version}>{children}</ClientMainLayout>;
}
