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
import { TimelineEditor } from "../timeline";
import { Loading } from "@/components/loading";
import { useTimeline } from "@/providers/timeline-provider";

export const Toolbox = () => {

  const { timelineRef, mounted, isPlaying } = useTimeline();



  const timeRender = (time: number) => {
    const float = (parseInt((time % 1) * 100 + "") + "").padStart(2, "0");
    const min = (parseInt(time / 60 + "") + "").padStart(2, "0");
    const second = (parseInt((time % 60) + "") + "").padStart(2, "0");
    return <>{`${min}:${second}.${float.replace("0.", "")}`}</>;
  };

  return (
    <div className="w-full h-full grid grid-rows-3 grid-cols-1">
      <div className="grid grid-cols-3 grid-rows-1 bg-muted/20 p-2 row-end-1">
        {mounted ? (
          <>
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
                  const time = timelineRef?.current.getTime();
                  timelineRef?.current.setTime(time - 1);
                }}
              >
                <DoubleArrowLeftIcon className="h-4 w-4" />
              </Button>
              {isPlaying ? (
                <Button
                  variant={"ghost"}
                  size={"icon"}
                  onClick={() => {
                    timelineRef?.current.pause();
                  }}
                >
                  <PauseIcon className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  variant={"ghost"}
                  size={"icon"}
                  onClick={() => {
                    timelineRef?.current.play({});
                  }}
                >
                  <PlayIcon className="h-4 w-4" />
                </Button>
              )}

              <Button
                variant={"ghost"}
                size={"icon"}
                onClick={() => {
                  timelineRef?.current.setTime(0);
                  timelineRef?.current.pause();
                }}
              >
                <StopIcon className="h-4 w-4" />
              </Button>
              <Button
                variant={"ghost"}
                size={"icon"}
                onClick={() => {
                  const time = timelineRef?.current.getTime();
                  timelineRef?.current.setTime(time + 1);
                }}
              >
                <DoubleArrowRightIcon className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center justify-end">
              <span>{timeRender(timelineRef!.current.getTime())}</span>
              <span>/</span>
              <span>00:12:14</span>
            </div>
          </>
        ) : (
          <Loading />
        )}
      </div>
      <div className="row-start-1 row-end-4 w-full h-full">
        <TimelineEditor />
      </div>
    </div>
  );
};