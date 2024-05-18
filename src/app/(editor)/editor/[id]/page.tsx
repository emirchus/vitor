"use client";

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Sidebar } from "@/app/(editor)/components/sidebar";
import { Playback } from "@/app/(editor)/components/playback";
import { Toolbox } from "@/app/(editor)/components/toolbox";
import { ImperativePanelHandle } from "react-resizable-panels";
import { useEffect, useRef } from "react";
import { useEditorStore } from "@/store/editor.store";
import {
  Dialog,
  DialogTitle,
  DialogDescription,
  DialogHeader,
  DialogContent
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Loading } from "@/components/loading";
import { AnimatePresence, motion } from "framer-motion";

export default function EditorPage() {
  const panelLeftRef = useRef<ImperativePanelHandle>(null);
  const panelBottomRef = useRef<ImperativePanelHandle>(null);
  const { panelLeft, setPanelLeft, timeline, setTimeline, isExporting, exportProcess } =
    useEditorStore();

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
      <Dialog open={isExporting} defaultOpen={false}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Exporting Video</DialogTitle>
            <DialogDescription>Exporting video to MP4 format</DialogDescription>
          </DialogHeader>
          <AnimatePresence>
            {exportProcess < 100 ? (
              <Progress value={exportProcess} />
            ) : (
              <motion.div
                initial={{
                  y: 20,
                  opacity: 0
                }}
                animate={{
                  y: 0,
                  opacity: 1
                }}
                exit={{
                  y: 20,
                  opacity: 0
                }}
                transition={{
                  duration: 0.3
                }}
                className="w-full flex items-center justify-center space-y-2 flex-col"
              >
                <Loading />
                <p>We are writing your file...</p>
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
      <ResizablePanelGroup direction="vertical" className="w-full h-full">
        <ResizablePanel defaultSize={70} collapsible={false}>
          <ResizablePanelGroup direction="horizontal" className="w-full h-full">
            <ResizablePanel
              defaultSize={20}
              maxSize={40}
              collapsedSize={0}
              minSize={10}
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
          minSize={1}
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
