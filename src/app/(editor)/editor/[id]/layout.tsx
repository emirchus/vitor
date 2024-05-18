import { Header } from "@/app/(editor)/components/header";
import { WorkspaceProvider } from "@/providers/project-provider";

export default async function EditorLayout({ children }: { children: React.ReactNode }) {
  return (
    <WorkspaceProvider>
      <Header />
      <main className="w-full h-[calc(100vh-1.25rem)]">{children}</main>
    </WorkspaceProvider>
  );
}
