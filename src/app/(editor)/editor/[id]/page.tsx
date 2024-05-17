import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Sidebar } from "@/app/(editor)/components/sidebar";
import { Playback } from "@/app/(editor)/components/playback";
import { Toolbox } from "@/app/(editor)/components/toolbox";

export default function EditorPage() {
  return (
    <ResizablePanelGroup direction="vertical" className="w-full h-full">
      <ResizablePanel defaultSize={70} collapsible={false}>
        <ResizablePanelGroup direction="horizontal" className="w-full h-full">
          <ResizablePanel defaultSize={20} maxSize={40} className="bg-background">
            <Sidebar />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={80}>
            <Playback />
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={30} maxSize={70} collapsible className="h-full">
        <Toolbox />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
