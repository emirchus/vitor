"use client";
import { useWorkspace } from "@/providers/workspace-provider";
import { Timeline } from "@xzdarcy/react-timeline-editor";
import React from "react";

export const TimelineEditor = () => {
  const {
    timelineRef,
    currentAction,
    setCurrentAction,
    timelineRow,
    setTimelineRow,
    saveAction
  } = useWorkspace();

  return (
    <Timeline
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "hsl(var(--background))",
        fontFamily: "var(--font-sans)"
      }}
      ref={timelineRef as never}
      onChange={setTimelineRow as never}
      editorData={timelineRow}
      effects={{
        video: {
          id: "video",
          name: "Video",
          source: {
            enter(param) {
              if (currentAction?.id !== param.action.id) {
                setCurrentAction(param.action as never);
              }
            },
            start(param) {
              if (currentAction?.id !== param.action.id) {
                setCurrentAction(param.action as never);
              }
            },
            update(param) {
              console.log(param.action.start, param.action.end, param.time);
              if (!param.isPlaying && currentAction?.id !== param.action.id)
                setCurrentAction(param.action as never);
            },
            leave(param) {
              if (currentAction?.id === param.action.id) setCurrentAction();
            }
          }
        }
      }}
      onContextMenuAction={(e, { action, row, time }) => {
        console.log(action, row, time);
        e.preventDefault();
      }}
      onActionMoveEnd={action => {
        saveAction(action.action as never);
      }}
      onActionResizeEnd={action => {
        saveAction(action.action as never);
      }}
      autoScroll
      gridSnap
      dragLine
    />
  );
};
