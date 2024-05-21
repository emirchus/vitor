"use client";
import React from "react";

import {
  CursorArrowIcon,
  CursorTextIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
  MagicWandIcon,
  PauseIcon,
  PlayIcon,
  ScissorsIcon,
  StopIcon
} from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { formatTime } from "@/lib/utils";
import { useWorkspace } from "@/providers/workspace-provider";
import { Loading } from "@/components/loading";
import { Timeline } from "../timeline";
import { useTimeline } from "@/providers/timeline-provider";

export const Toolbox = () => {
  const { mounted, videoDuration } = useWorkspace();
  const { time } = useTimeline();

  if (!mounted)
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Loading />
      </div>
    );

  return (
    <div className="w-full h-full grid grid-rows-3 grid-cols-1">
      <div className="grid grid-cols-3 grid-rows-1 bg-muted/20 p-2 row-end-1">
        <div className="flex flex-row items-center justify-start space-x-2">
          <Button variant="ghost" size="icon">
            <CursorArrowIcon className=" h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <CursorTextIcon className=" h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <ScissorsIcon className=" h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <MagicWandIcon className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center justify-center space-x-2 w-full">
          <Button
            variant={"ghost"}
            size={"icon"}
            onClick={() => {
              //TODO: Implement redo video
            }}
          >
            <DoubleArrowLeftIcon className="h-4 w-4" />
          </Button>{" "}
          <Button
            variant={"ghost"}
            size={"icon"}
            onClick={() => {
              //TODO: Implement pause video
            }}
          >
            <PauseIcon className="h-4 w-4" />
          </Button>
          <Button
            variant={"ghost"}
            size={"icon"}
            onClick={() => {
              //TODO: Implement play video
            }}
          >
            <PlayIcon className="h-4 w-4" />
          </Button>
          <Button
            variant={"ghost"}
            size={"icon"}
            onClick={() => {
              //TODO: Implement stop video
            }}
          >
            <StopIcon className="h-4 w-4" />
          </Button>
          <Button
            variant={"ghost"}
            size={"icon"}
            onClick={() => {
              //TODO: Implement forward video
            }}
          >
            <DoubleArrowRightIcon className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center justify-end">
          {
            // TODO: Implement current time
          }
          <span>{formatTime(time)}</span>
          <span>/</span>
          <span>{formatTime(videoDuration)}</span>
        </div>
      </div>
      <div className="row-start-1 row-end-4 w-full h-full">
        <Timeline />
      </div>
    </div>
  );
};
