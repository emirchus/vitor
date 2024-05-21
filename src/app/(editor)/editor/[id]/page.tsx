"use client";

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Sidebar } from "@/app/(editor)/components/sidebar";
import { Playback } from "@/app/(editor)/components/playback";
import { Toolbox } from "@/app/(editor)/components/toolbox";
import { ImperativePanelHandle } from "react-resizable-panels";
import { useEffect, useRef } from "react";
import { useEditorStore } from "@/store/editor.store";
import { EditProjectForm } from "@/app/(editor)/components/edit-project";

export default function EditorPage() {
  const panelLeftRef = useRef<ImperativePanelHandle>(null);
  const panelBottomRef = useRef<ImperativePanelHandle>(null);
  const { panelLeft, setPanelLeft, timeline, setTimeline } = useEditorStore();

  useEffect(() => {
    if (panelLeft) {
      panelLeftRef.current?.collapse();
    } else {
      panelLeftRef.current?.expand();
    }

    if (timeline) {
      panelBottomRef.current?.collapse();
    } else {
      panelBottomRef.current?.expand();
    }
  }, [panelLeft, timeline]);

  return (
    <>
      <EditProjectForm />
      <ResizablePanelGroup direction="vertical" className="w-full h-full">
        <ResizablePanel defaultSize={70} collapsible={false}>
          <ResizablePanelGroup direction="horizontal" className="w-full h-full">
            <ResizablePanel
              defaultSize={20}
              maxSize={40}
              collapsedSize={0}
              minSize={15}
              collapsible
              className="bg-background"
              onCollapse={() => setPanelLeft(true)}
              onExpand={() => setPanelLeft(false)}
              ref={panelLeftRef}
            >
              <Sidebar />
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={80}>
              <Playback />
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel
          ref={panelBottomRef}
          collapsedSize={0}
          minSize={5}
          defaultSize={30}
          maxSize={70}
          collapsible
          onCollapse={() => setTimeline(true)}
          onExpand={() => setTimeline(false)}
          className="h-full"
        >
          <Toolbox />
        </ResizablePanel>
      </ResizablePanelGroup>
    </>
  );
}
