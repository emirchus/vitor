"use client";
import React from "react";
import { GridPattern } from "../grid-pattern";
import { useWorkspace } from "@/providers/workspace-provider";
import { Loading } from "@/components/loading";
import { getResolution } from "@/lib/resolutions";
export const Playback = () => {
  const canvas = React.useRef<HTMLCanvasElement>(null);
  const videoElement = React.useRef<HTMLVideoElement>(null);

  const { mounted, project } = useWorkspace();

  if (!project) return null;

  return (
    <div className="w-full h-full relative">
      <GridPattern width={20} height={20} x={-1} y={-1} strokeDasharray={"4 2"} />
      <div className="w-auto h-full flex items-center justify-center p-10 relative">
        {mounted ? (
          <>
            <video ref={videoElement} className="hidden" />
            <canvas
              ref={canvas}
              width={getResolution(project.resolution, project.aspectRatio).width}
              height={getResolution(project.resolution, project.aspectRatio).height}
              className="max-w-full h-fit max-h-full object-contain rounded-md bg-gradient-to-r from-fuchsia-500 to-cyan-500 shadow-md"
            />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Loading />
          </div>
        )}
      </div>
    </div>
  );
};
