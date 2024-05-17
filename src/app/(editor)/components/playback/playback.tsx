"use client";
import React from "react";
import { GridPattern } from "../grid-pattern";
import { useProject } from "@/hooks/use-projects";
import { useParams } from "next/navigation";
import { useTimeline } from "@/providers/timeline-provider";

export const Playback = () => {
  const canvas = React.useRef<HTMLCanvasElement>(null);
  const { id } = useParams<{ id: string }>();
  const [isLoading, project] = useProject(+id);
  const { timelineRef, mounted, currentAction } = useTimeline();

  const renderRoundedRect = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number
  ) => {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  };

  React.useEffect(() => {
    if (mounted && !isLoading && canvas.current && project && currentAction) {
      const canvasCtx = canvas.current;
      const ctx = canvasCtx.getContext("2d")!;
      const video = document.createElement("video");
      console.log(project);

      video.src = URL.createObjectURL(currentAction.file);

      video.crossOrigin = "anonymous";
      video.load();

      timelineRef.current.listener.on("play", () => video.play());
      timelineRef.current.listener.on("paused", () => video.pause());

      const padding = 30;
      const loop = () => {
        ctx.save();
        ctx.clearRect(0, 0, canvasCtx.width, canvasCtx.height);
        renderRoundedRect(
          ctx,
          padding,
          padding,
          canvasCtx.width - padding * 2,
          canvasCtx.height - padding * 2,
          40
        );
        ctx.clip();
        ctx.drawImage(
          video,
          padding,
          padding,
          canvasCtx.width - padding * 2,
          canvasCtx.height - padding * 2
        );
        ctx.restore();
        requestAnimationFrame(loop);
      };

      timelineRef.current.listener.on("beforeSetTime", time => {
        loop();
      });

      const onSeeked = () => {
        loop();
      };

      video.addEventListener("play", onSeeked);
      video.addEventListener("seeked", onSeeked);

      const onLoadMetadata = () => (video.currentTime = 0);

      video.addEventListener("loadedmetadata", onLoadMetadata);

      return () => {
        video.removeEventListener("loadedmetadata", onLoadMetadata);
        video.pause();
        video.src = "";
      };
    }
  }, [currentAction, project, timelineRef, isLoading, mounted]);

  return (
    <div className="w-full h-full relative">
      <GridPattern width={20} height={20} x={-1} y={-1} strokeDasharray={"4 2"} />
      <div className="w-auto h-full flex items-center justify-center p-10 relative">
        <canvas
          ref={canvas}
          width={1920}
          height={1080}
          className="max-w-full h-fit max-h-full object-contain rounded-md bg-gradient-to-r from-fuchsia-500 to-cyan-500 shadow-md"
        />
      </div>
    </div>
  );
};
