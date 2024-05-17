"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { TimelineAction, TimelineRow, TimelineState } from "@xzdarcy/react-timeline-editor";
import { useParams } from "next/navigation";
import { useProject } from "@/hooks/use-projects";
import { getVideoDuration } from "@/lib/video-utils";
import { projectsDB } from "@/data/projects-db";

export type EditorTimelineAction = TimelineAction & { file: File };
export type EditorTimelineRow = TimelineRow & { actions: EditorTimelineAction[] };

interface TimelineProviderState {
  timelineRef: React.MutableRefObject<TimelineState>;
  mounted: boolean;
  setMounted: (value: boolean) => void;
  isPlaying: boolean;
  time: number;
  currentAction?: EditorTimelineAction;
  setCurrentAction: (value?: EditorTimelineAction) => void;

  timelineRow: EditorTimelineRow[];
  setTimelineRow: (value: EditorTimelineRow[]) => void;
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
  const [currentTimelineAction, setCurrentTimelineAction] = useState<
    EditorTimelineAction | undefined
  >();

  const [isPlaying, setIsPlaying] = useState(false);

  const [time, setTime] = useState(0);

  const [timelineRow, setTimelineRow] = useState<EditorTimelineRow[]>([]);
  const { id } = useParams<{ id: string }>();
  const [isLoading, project] = useProject(+id);

  useEffect(() => {
    if (!mounted) return;
    const engine = timelineState.current!;
    engine.listener.on("play", () => setIsPlaying(true));
    engine.listener.on("paused", () => setIsPlaying(false));
    engine.listener.on("afterSetTime", ({ time }) => setTime(time));
    engine.listener.on("setTimeByTick", ({ time }) => {
      // setTime(time);

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
    if (!project) return;
    const intervalId = setInterval(() => {
      timelineRow.forEach(row => {
        const video = row.actions[0];
        if (video) {
          projectsDB.projects.update(project.id!, {
            updatedAt: new Date(),
            id: project.id,
            videos: project.videos.map(v => {
              if (v.id === video.id) {
                return {
                  ...v,
                  start: video.start,
                  end: video.end
                };
              }
              return v;
            })
          });
        }
      });
    }, 4000);

    return () => {
      clearInterval(intervalId);
    };
  }, [currentTimelineAction, project, timelineRow]);

  useEffect(() => {
    if (!isLoading && project) {
      const videos_maps = Promise.all(
        project.videos.map(async (video, index) => {
          const duration = await getVideoDuration(video.file);

          const row: EditorTimelineRow = {
            id: index.toString(),
            actions: [
              {
                effectId: "video",
                file: video.file,
                id: video.id,
                start: video.start,
                end: video.end || duration,
                maxEnd: duration,
              }
            ]
          };

          await projectsDB.projects.update(project.id!, {
            updatedAt: new Date(),
            id: project.id,
            videos: project.videos.map(v => {
              return {
                ...v,
                start: row.actions[0].start,
                end: row.actions[0].end,
                duration: duration
              };
            })
          });
          return row;
        })
      );

      videos_maps.then(async videos => {
        const trimmedVideos = videos.map((video, index) => {
          const sliber = videos[index - 1];

          if (sliber) {
            video.actions[0].start = sliber.actions[0].end;
            video.actions[0].end = video.actions[0].start + video.actions[0].end;
          }

          return video;
        });

        if (
          !project.updatedAt ||
          Date.now() - (project.updatedAt! as Date).getTime() > 1000 * 60 * 3
        ) {
          const videos = trimmedVideos.map(video => video.actions[0]);

          await projectsDB.projects.update(project.id!, {
            updatedAt: new Date(),
            id: project.id,
            videos: project.videos.map(v => {
              return {
                ...v,
                start: videos.find(video => video.id === v.id)!.start,
                end: videos.find(video => video.id === v.id)!.end,
                duration: videos.find(video => video.id === v.id)!.end
              };
            })
          });
        }

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
