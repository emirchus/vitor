import { Header } from "@/app/(editor)/components/header";
import { TimelineProvider } from "@/providers/timeline-provider";
import { WorkspaceProvider } from "@/providers/workspace-provider";

export default async function EditorLayout({ children }: { children: React.ReactNode }) {
  return (
    <TimelineProvider>
      <WorkspaceProvider>
        <Header />
        <main>{children}</main>
      </WorkspaceProvider>
    </TimelineProvider>
  );
}
