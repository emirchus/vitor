import { Header } from "@/app/(editor)/components/header";
import { WorkspaceProvider } from "@/providers/workspace-provider";

export default async function EditorLayout({ children }: { children: React.ReactNode }) {
  return (
    <WorkspaceProvider>
      <Header />
      <main className="">{children}</main>
    </WorkspaceProvider>
  );
}
