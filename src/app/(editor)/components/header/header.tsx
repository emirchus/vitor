"use client";

import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { DialogHeader } from "@/components/ui/dialog";
import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger
} from "@/components/ui/menubar";
import { useFfmpeg } from "@/hooks/use-ffmpeg";
import { formatTime } from "@/lib/utils";
import { useWorkspace } from "@/providers/workspace-provider";
import { useEditorStore } from "@/store/editor.store";
import { fetchFile } from "@ffmpeg/util";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ArrowLeftIcon, Share2Icon } from "@radix-ui/react-icons";
import { Progress } from "@/components/ui/progress";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { Loading } from "@/components/loading";

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { project, saveProject } = useWorkspace();
  const { panelLeft, setPanelLeft, timeline, setTimeline, setExportProcess, setIsExporting, isExporting, exportProcess } = useEditorStore();
  const { load, loaded, ffmpegRef, setAbortSignal, abortSignal } = useFfmpeg();

  const exportVideo = async () => {
    setIsExporting(true);
    setExportProcess(1);
    if (!loaded) {
      await load();
    }
    const abortSignal = new AbortController();
    setAbortSignal(abortSignal);

    const ffmpeg = ffmpegRef.current;

    ffmpeg.on("progress", progress => {
      setExportProcess(progress.progress >= 0 ? Math.abs(progress.progress) * 100 : (Math.abs(progress.progress) / progress.time) * 100);
    });

    await Promise.all(
      project!.videos
        .sort((videoA, videoB) => {
          return videoA.start - videoB.start;
        })
        .map(async video => {
          await ffmpeg.writeFile(video.file.name, await fetchFile(video.file), {
            signal: abortSignal?.signal
          });
          await ffmpeg.exec(
            [
              "-i",
              video.file.name,
              "-t",
              formatTime(video.end - video.start),
              "-ss",
              formatTime(video.start),
              "-vf",
              `scale=${1280}:${720}`,
              video.file.name.split(".")[0].concat("-resized.mp4")
            ],
            undefined,
            {
              signal: abortSignal?.signal
            }
          );
        })
    );

    const concatList = "concat_list.txt";
    let concatContent = "";

    for (const video of project!.videos) {
      concatContent += `file '${video.file.name.split(".")[0].concat("-resized.mp4")}'\n`;
    }

    const blobFile = new Blob([concatContent], { type: "text/plain" });
    const file = new File([blobFile], concatList, { type: "text/plain" });

    await ffmpeg.writeFile(concatList, await fetchFile(file), {
      signal: abortSignal?.signal
    });

    await ffmpeg.exec(["-f", "concat", "-safe", "0", "-i", concatList, "output.mp4"]);
    const data = await ffmpeg.readFile("output.mp4", undefined, {
      signal: abortSignal?.signal
    });

    const blob = new Blob([data], { type: "video/mp4" });
    setIsExporting(false);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "output.mp4";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      {isExporting && (
        <Dialog
          open={isExporting}
          defaultOpen={false}
          onOpenChange={isOpen => {
            if (!isOpen) {
              setExportProcess(0);
              setIsExporting(false);
              abortSignal?.abort();
            }
          }}
        >
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
      )}
      <header className="w-screen h-12 bg-background border-b border-border grid grid-cols-3 grid-rows-1 px-5 gap-2">
        <div className="col-span-1 flex flex-row items-center justify-start space-x-2 overflow-clip">
          <Button
            variant="outline"
            size={"icon"}
            onClick={() => {
              router.replace("/");
            }}
          >
            <ArrowLeftIcon className="w-4 h-4" />
          </Button>
          <Menubar className="border-none shadow-none">
            <MenubarMenu>
              <MenubarTrigger>File</MenubarTrigger>
              <MenubarContent>
                <MenubarItem>New Project</MenubarItem>
                <MenubarItem
                  onClick={() => {
                    router.replace(`${pathname}/?edit`);
                  }}
                >
                  Edit Project
                </MenubarItem>
                <MenubarItem>About Project</MenubarItem>
                <MenubarSeparator />
                <MenubarItem onClick={() => saveProject(true)}>Save project</MenubarItem>
              </MenubarContent>
            </MenubarMenu>
            <MenubarMenu>
              <MenubarTrigger>Edit</MenubarTrigger>
              <MenubarContent>
                <MenubarItem>
                  Undo <MenubarShortcut>⌘Z</MenubarShortcut>
                </MenubarItem>
                <MenubarItem>
                  Redo <MenubarShortcut>⇧⌘Z</MenubarShortcut>
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>
            <MenubarMenu>
              <MenubarTrigger>View</MenubarTrigger>
              <MenubarContent>
                <MenubarItem
                  inset
                  onClick={() => {
                    if (!document.fullscreenElement) {
                      document.documentElement.requestFullscreen();
                    } else {
                      document.exitFullscreen();
                    }
                  }}
                >
                  Toggle Fullscreen
                </MenubarItem>
                <MenubarSeparator />
                <MenubarCheckboxItem
                  onClick={() => {
                    setPanelLeft(!panelLeft);
                  }}
                  checked={panelLeft}
                >
                  Hide Sidebar
                </MenubarCheckboxItem>{" "}
                <MenubarCheckboxItem
                  onClick={() => {
                    setTimeline(!timeline);
                  }}
                  checked={timeline}
                >
                  Hide Timeline
                </MenubarCheckboxItem>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
        </div>
        <div className="col-span-1 flex flex-row items-center justify-center w-full text-center max-w-md overflow-clip">
          {project && <h3 className="text-ellipsis text-nowrap ">{project.name}</h3>}
        </div>
        <div className=" col-span-1 flex flex-row items-center justify-end overflow-hidden">
          <ModeToggle />
          <Button variant="outline" className="ml-2" onClick={exportVideo} disabled={!project}>
            Export <Share2Icon className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </header>
    </>
  );
};

export default Header;
