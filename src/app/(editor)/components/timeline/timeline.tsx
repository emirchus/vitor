"use client";
import { useTimeline } from "@/providers/timeline-provider";
import { Timeline } from "@xzdarcy/react-timeline-editor";
import React, { useEffect } from "react";

export const TimelineEditor = () => {
  const { timelineRef, setMounted, currentAction, setCurrentAction, timelineRow, setTimelineRow } =
    useTimeline();

  useEffect(() => {
    if (timelineRef) setMounted(true);
  }, [setMounted, timelineRef]);

  return (
    <Timeline
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "hsl(var(--background))",
        fontFamily: "var(--font-sans)"
      }}
      ref={timelineRef as never}
      onChange={setTimelineRow}
      editorData={timelineRow}
      effects={{
        video: {
          id: "video",
          name: "Video",
          source: {
            enter(param) {
              if (currentAction?.id !== param.action.id) {
                setCurrentAction(param.action);
              }
            },
            start(param) {
              if (currentAction?.id !== param.action.id) {
                setCurrentAction(param.action);
              }
            },
            update(param) {
              console.log(param.action.start, param.action.end, param.time);
              if (!param.isPlaying && currentAction?.id !== param.action.id)
                setCurrentAction(param.action);
            }
          }
        }
      }}
      autoScroll
      autoReRender
      gridSnap
      dragLine
    />
  );
};
