"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useCreateProject } from "@/hooks/use-projects";
import { useVideosUploadStore } from "@/store/videos-upload.store";
import { usePreview } from "@/hooks/use-image-preview";
import { getVideoDuration } from "@/lib/video-utils";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AspectRatio, Framerate, Resolution } from "@/interfaces/project";
import { TikTokLogo, InstagramIcon, XIcon, YoutubeIcon, FacebookIcon } from "@/components/icons";

export function CreateProjectForm() {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [title, setTitle] = React.useState<string>("");
  const { videos, setVideos } = useVideosUploadStore();
  const [resolution, setResolution] = React.useState<Resolution>(720);
  const [framerate, setFramerate] = React.useState<Framerate>(60);
  const [aspectRatio, setAspectRatio] = React.useState<AspectRatio>("16:9");

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
            <Label htmlFor="name">Title</Label>
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
          <div className="flex flex-col space-y-1.5 w-full">
            <Label>Preset</Label>
            <Select
              onValueChange={() => {
                // setResolution(parseInt(value) as Resolution);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Custom" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Social media</SelectLabel>
                  <SelectItem value="tiktok">
                    <div className="flex flex-row items-center justify-start space-x-2">
                      <TikTokLogo size={16} className="fill-secondary-foreground" />
                      <span>TikTok</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="x">
                    <div className="flex flex-row items-center justify-start space-x-2">
                      <XIcon className="fill-secondary-foreground w-4 h-4" />
                      <span>Twitter (X)</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="facebook">
                    <div className="flex flex-row items-center justify-start space-x-2">
                      <FacebookIcon className="fill-secondary-foreground w-4 h-4" />
                      <span>Facebook</span>
                    </div>
                  </SelectItem>
                  <SelectLabel>Instagram</SelectLabel>
                  <SelectItem value="instagram">
                    <div className="flex flex-row items-center justify-start space-x-2">
                      <InstagramIcon className="fill-secondary-foreground w-4 h-4" />
                      <span>Instagram</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="instagram-story">
                    <div className="flex flex-row items-center justify-start space-x-2">
                      <InstagramIcon className="fill-secondary-foreground w-4 h-4" />
                      <span>Instagram Story</span>
                    </div>
                  </SelectItem>
                  <SelectLabel>Youtube</SelectLabel>
                  <SelectItem value="yt">
                    <div className="flex flex-row items-center justify-start space-x-2">
                      <YoutubeIcon className="fill-secondary-foreground w-4 h-4" />
                      <span>Youtube</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="yt-short">
                    <div className="flex flex-row items-center justify-start space-x-2">
                      <YoutubeIcon className="fill-secondary-foreground w-4 h-4" />
                      <span>Youtube Short</span>
                    </div>
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="flex w-full flex-row justify-between space-x-2">
            <div className="flex flex-col space-y-1.5 w-full">
              <Label htmlFor="resolution">Resolution</Label>
              <Select
                defaultValue={resolution.toString()}
                onValueChange={value => {
                  setResolution(parseInt(value) as Resolution);
                }}
              >
                <SelectTrigger name="resolution" id="resolution">
                  <SelectValue placeholder="Resolution" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Full HD</SelectLabel>
                    <SelectItem value="2160">3840x2160</SelectItem>
                    <SelectItem value="1440">2560x1440</SelectItem>
                    <SelectItem value="1080">1920x1080</SelectItem>
                    <SelectLabel>HD</SelectLabel>
                    <SelectItem value="720">1280x720</SelectItem>
                    <SelectItem value="480">854x480</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col space-y-1.5 w-full">
              <Label htmlFor="framerate">Framerate</Label>
              <Select
                defaultValue={framerate.toString()}
                onValueChange={value => {
                  setFramerate(parseInt(value) as Framerate);
                }}
              >
                <SelectTrigger name="framerate" id="framerate">
                  <SelectValue placeholder="Frame rate" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="60">60 FPS</SelectItem>
                    <SelectItem value="30">30 FPS</SelectItem>
                    <SelectItem value="24">24 FPS</SelectItem>
                    <SelectItem value="15">15 FPS</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="aspect-ratio">Aspect ratio</Label>
            <Select
              defaultValue={aspectRatio}
              onValueChange={value => {
                setAspectRatio(value as AspectRatio);
              }}
            >
              <SelectTrigger name="aspect-ratio" id="aspect-ratio">
                <SelectValue placeholder="Aspect ratio" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Landscape</SelectLabel>
                  <SelectItem value="16:9">16:9</SelectItem>
                  <SelectItem value="4:3">4:3</SelectItem>
                  <SelectLabel>Portrait</SelectLabel>
                  <SelectItem value="9:16">9:16</SelectItem>
                  <SelectLabel>Square</SelectLabel>
                  <SelectItem value="1:1">1:1</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            disabled={videos.length === 0 || (title && title?.trim().length === 0) || !isLoaded}
            onClick={async () => {
              setOpen(false);
              let videosDuration = await Promise.all(
                videos.map(async (file, index) => {
                  const { duration, thumbnail } = await getVideoDuration(file);

                  return {
                    id: index.toString(),
                    file,
                    start: 0,
                    end: duration,
                    duration: duration,
                    thumbnail: thumbnail,
                    audio: {
                      volume: 1,
                      muted: false
                    }
                  };
                })
              );

              //Sort videos from the longest to the shortest
              videosDuration = videosDuration.sort((a, b) => b.duration - a.duration);

              //Format videos by appending the start and end time from the previous video
              videosDuration = videosDuration.map((video, index) => ({
                ...video,
                start: index === 0 ? 0 : videosDuration[index - 1].end,
                end: (index === 0 ? 0 : videosDuration[index - 1].end) + video.end
              }));

              const proyect = await createProject({
                name: title || `Project ${new Date().toLocaleDateString()}`,
                videos: videosDuration,
                thumbnail: preview,
                aspectRatio,
                framerate,
                resolution
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
