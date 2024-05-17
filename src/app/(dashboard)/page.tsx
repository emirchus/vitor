import { Suspense } from "react";
import { DragVideoZone } from "./components/drag-video-zone";
import { VideoUploadModal } from "./components/video-upload-modal";
import { VideoListSSR } from "./components/videos-list";
interface Props {
  searchParams?: {
    search?: string;
    page?: number;
  };
}

export default function Dashboard({ searchParams }: Props) {
  return (
    <main className="flex flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <VideoUploadModal />

      <DragVideoZone>
        <div className="flex flex-col items-center justify-center gap-1 text-center w-full flex-1 h-[20vh]">
          <h3 className="text-1xl font-bold tracking-tight text-muted-foreground">
            Drag and drop your video files here or click to upload
          </h3>
        </div>
      </DragVideoZone>
      <Suspense fallback={<p>xd</p>}>
        <VideoListSSR search={searchParams?.search || ""} page={Number(searchParams?.page || 1)} />
      </Suspense>
    </main>
  );
}
