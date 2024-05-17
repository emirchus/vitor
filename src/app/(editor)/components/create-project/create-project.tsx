"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { useCreateProject } from "@/hooks/use-projects";
import { useVideosUploadStore } from "@/store/videos-upload.store";
import { usePreview } from "@/hooks/use-image-preview";

export function CreateProjectForm() {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [title, setTitle] = React.useState<string>("");
  const { videos, setVideos } = useVideosUploadStore();

  const [isLoaded, preview] = usePreview(videos[0]);

  const createProject = useCreateProject();

  React.useEffect(() => {
    if (videos.length === 0) {
      router.replace("/");
      return;
    }
    setTimeout(() => {
      setOpen(true);
    }, 1000);
  }, [router, videos.length]);

  return (
    <Dialog
      open={open}
      onOpenChange={open => {
        if (!open) {
          router.replace("/");
          setVideos([]);
        }
      }}
      defaultOpen
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create project</DialogTitle>
          <DialogDescription>Create your new project in one-click.</DialogDescription>
        </DialogHeader>
        <div className="grid w-full items-center gap-4">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="name">title</Label>
            <Input
              name="title"
              value={title}
              onChange={e => {
                setTitle(e.target.value);
              }}
              id="title"
              placeholder="Name of your project"
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            disabled={videos.length === 0 || !title || title?.trim() === "" || !isLoaded}
            onClick={async () => {
              setOpen(false);

              const proyect = await createProject({
                name: title!,
                videos: videos.map((file, index) => ({
                  id: index.toString(),
                  file,
                  start: 0,
                  end: 0,
                  duration: 0,
                  audio: {
                    volume: 1,
                    muted: false
                  }
                })),
                thumbnail: preview
              });

              setTimeout(() => {
                router.replace("/editor/" + proyect);
              }, 1000);
            }}
          >
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
