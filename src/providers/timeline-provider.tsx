"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { TimelineAction, TimelineRow, TimelineState } from "@xzdarcy/react-timeline-editor";
import { useParams } from "next/navigation";
import { useProject } from "@/hooks/use-projects";
import { getVideoDuration } from "@/lib/video-utils";
interface TimelineProviderState {
  timelineRef: React.MutableRefObject<TimelineState>;
  mounted: boolean;
  setMounted: (value: boolean) => void;
  isPlaying: boolean;
  time: number;
  currentAction?: TimelineAction;
  setCurrentAction: (value?: TimelineAction) => void;

  timelineRow: TimelineRow[];
  setTimelineRow: (value: TimelineRow[]) => void;
}

const TimelineContext = createContext<TimelineProviderState>({} as TimelineProviderState);

export const useTimeline = () => {
  const context = useContext(TimelineContext);
  if (!context) {
    throw new Error("useTimeline must be used within a TimelineProvider");
  }
  return context;
};

export const TimelineProvider = ({ children }: { children: React.ReactNode }) => {
  const timelineState = useRef<TimelineState>();
  const [mounted, setMounted] = useState(false);
  const [currentTimelineAction, setCurrentTimelineAction] = useState<TimelineAction | undefined>();

  const [isPlaying, setIsPlaying] = useState(false);

  const [time, setTime] = useState(0);

  const [timelineRow, setTimelineRow] = useState<TimelineRow[]>([]);
  const { id } = useParams<{ id: string }>();
  const [isLoading, project] = useProject(+id);

  useEffect(() => {
    if (!mounted) return;
    const engine = timelineState.current!;
    engine.listener.on("play", () => setIsPlaying(true));
    engine.listener.on("paused", () => setIsPlaying(false));
    engine.listener.on("afterSetTime", ({ time }) => setTime(time));
    engine.listener.on("setTimeByTick", ({ time }) => {
      setTime(time);

      const autoScrollFrom = 500;
      const left = time * (160 / 5) + 20 - autoScrollFrom;
      timelineState!.current!.setScrollLeft(left);
    });

    return () => {
      if (!engine) return;
      engine.pause();
      engine.listener.offAll();
    };
  }, [mounted]);

  useEffect(() => {
    if (timelineState.current) setMounted(true);

    return () => {
      setMounted(false);
    };
  }, [timelineState]);

  useEffect(() => {
    if (!isLoading && project) {
      const videos_maps = Promise.all(
        project.videos.map(async (video, index) => {
          const duration = await getVideoDuration(video);
          const row: TimelineRow = {
            id: index.toString(),
            actions: [
              {
                effectId: "video",
                id: index.toString(),
                start: 0,
                end: duration
              }
            ]
          };

          return row;
        })
      );

      videos_maps.then(videos => {
        const trimmedVideos = videos.map((video, index) => {
          const sliber = videos[index - 1];

          if (sliber) {
            video.actions[0].start = sliber.actions[0].end;
            video.actions[0].end = video.actions[0].start + video.actions[0].end;
          }

          return video;
        });

        setTimelineRow(trimmedVideos);
      });
    }
  }, [isLoading, project]);

  return (
    <TimelineContext.Provider
      value={{
        timelineRef: timelineState as never,
        mounted,
        setMounted,
        isPlaying,
        time,
        timelineRow,
        setTimelineRow,
        currentAction: currentTimelineAction,
        setCurrentAction: setCurrentTimelineAction
      }}
    >
      {children}
    </TimelineContext.Provider>
  );
};
