"use client";

import { Loading } from "@/components/loading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollAreaWithMask } from "@/components/ui/scroll-area";
import { usePreview } from "@/hooks/use-image-preview";
import { formatBytes } from "@/lib/utils";
import { useVideosUploadStore } from "@/store/videos-upload.store";
import { Cross1Icon } from "@radix-ui/react-icons";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Image from "next/image";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

let thumbnailCache: Record<string, string> = {};

export const VideoUploadModal = () => {
  const { addVideo, modal, setModal, removeVideo, videos } = useVideosUploadStore();

  const router = useRouter();

  useEffect(() => {
    if (videos.length === 0) {
      setModal(false);
    }

    return () => {
      thumbnailCache = {};
    };
  }, [setModal, videos]);

  return (
    <Dialog
      open={modal}
      modal
      onOpenChange={open => {
        if (!open) {
          setModal(false);
          videos.forEach((_, index) => removeVideo(index));
        }
      }}
    >
      <DialogContent className="w-screen max-w-[70vw] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Upload videos</DialogTitle>
          <DialogDescription>
            There are {videos.length} ({formatBytes(videos.reduce((prev, curr) => prev + curr.size, 0))}) videos in the queue. You can upload multiple
            videos at once.
          </DialogDescription>
        </DialogHeader>
        <ScrollAreaWithMask className="max-h-[60vh]">
          <div className="w-full grid grid-cols-2 lg:grid-cols-4 gap-4">
            {videos.map((video, index) => (
              <VideoCard key={video.name} video={video} index={index} />
            ))}
            {videos.length <= 10 && (
              <Card className="flex flex-col items-center justify-center h-full">
                <CardHeader>
                  <CardTitle>Upload more videos</CardTitle>
                  <CardDescription>You can upload multiple videos at once.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={() => {
                      const input = document.createElement("input");
                      input.type = "file";
                      input.accept = "video/mp4,video/x-m4v,video/*";
                      input.multiple = true;
                      input.onchange = event => {
                        const files = (event.target as HTMLInputElement).files;
                        if (files) {
                          const newFiles = Array.from(files).filter(file => file.type.includes("video"));
                          newFiles.forEach(file => addVideo(file));
                        }
                      };
                      input.click();
                    }}
                    className="w-full"
                  >
                    Select videos
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </ScrollAreaWithMask>
        <DialogFooter>
          <Button
            onClick={() => {
              videos.forEach((_, index) => removeVideo(index));
              setModal(false);
            }}
            variant="outline"
            className="mr-2"
            disabled={videos.length === 0}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              setModal(false);
              router.push("/editor");
            }}
            disabled={videos.length === 0}
          >
            Upload
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const VideoCard = ({ video, index }: { video: File; index: number }) => {
  const [isLoaded, imageUrl] = usePreview(video);
  const removeVideo = useVideosUploadStore(state => state.removeVideo);

  useEffect(() => {
    if (!thumbnailCache[video.name] && isLoaded && imageUrl) {
      thumbnailCache[video.name] = imageUrl;
    }
  }, [imageUrl, isLoaded, video.name]);

  return (
    <Card className="relative">
      <Button onClick={() => removeVideo(index)} className="absolute -right-2 -top-2" size={"icon"} variant={"outline"}>
        <span className="sr-only">Remove video</span>
        <Cross1Icon />
      </Button>
      <CardHeader>
        <AspectRatio ratio={16 / 9} className="w-full h-full flex items-center justify-center rounded-sm overflow-hidden mb-2 bg-muted/40">
          {isLoaded ? (
            imageUrl && <Image src={imageUrl} alt={video.name} width={1280} height={720} className="object-cover w-full h-auto" />
          ) : (
            <Loading />
          )}
        </AspectRatio>

        <CardTitle>{video.name}</CardTitle>
        <CardDescription>
          {formatBytes(video.size)} - {video.type}
        </CardDescription>
      </CardHeader>
    </Card>
  );
};
