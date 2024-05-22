"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AspectRatio, Framerate, Resolution } from "@/interfaces/project";
import { useWorkspace } from "@/providers/workspace-provider";
import { Loading } from "@/components/loading";

export function EditProjectForm() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const { project, saveProject, mounted } = useWorkspace();
  const [title, setTitle] = React.useState<string | undefined>(project?.name);
  const [resolution, setResolution] = React.useState<Resolution | undefined>(project?.resolution);
  const [framerate, setFramerate] = React.useState<Framerate | undefined>(project?.framerate);
  const [aspectRatio, setAspectRatio] = React.useState<AspectRatio | undefined>(project?.aspectRatio);

  const [hasChanged, setHasChanged] = React.useState(false);

  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    if (!project) return;

    if (
      (project!.name !== title && title?.trim().length !== 0) ||
      project!.resolution !== resolution ||
      project!.framerate !== framerate ||
      project!.aspectRatio !== aspectRatio
    ) {
      setHasChanged(true);
    } else {
      setHasChanged(false);
    }
  }, [aspectRatio, framerate, project, resolution, title]);

  React.useEffect(() => {
    if (project) {
      setTitle(project.name);
      setResolution(project.resolution);
      setFramerate(project.framerate);
      setAspectRatio(project.aspectRatio);
    }
  }, [project]);

  if (!mounted) return null;

  return (
    <Dialog
      modal
      open={params.get("edit") !== null}
      onOpenChange={open => {
        if (!open && !isLoading) {
          if (project) {
            setTitle(project.name);
            setResolution(project.resolution);
            setFramerate(project.framerate);
            setAspectRatio(project.aspectRatio);
          }
          router.replace(pathname);
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit project</DialogTitle>
        </DialogHeader>
        <div className="grid w-full items-center gap-4">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="title">Title</Label>
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
          <div className="flex w-full flex-row justify-between space-x-2">
            <div className="flex flex-col space-y-1.5 w-full">
              <Label htmlFor="resolution">Resolution</Label>
              <Select
                defaultValue={resolution?.toString()}
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
                defaultValue={framerate?.toString()}
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
            <Button disabled={isLoading} variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button
            disabled={!hasChanged || isLoading}
            onClick={async () => {
              setIsLoading(true);
              await saveProject(true, {
                ...project!,
                name: title || project!.name,
                resolution: resolution || project!.resolution,
                framerate: framerate || project!.framerate,
                aspectRatio: aspectRatio || project!.aspectRatio
              });
              setIsLoading(false);
              router.replace(pathname);
            }}
          >
            {isLoading ? <Loading /> : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
