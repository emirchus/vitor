"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import { TimelineAction, TimelineRow, TimelineState } from "@xzdarcy/react-timeline-editor";
import { useParams } from "next/navigation";
import { useProject, useUpdateProject } from "@/hooks/use-projects";
import { getVideoDuration } from "@/lib/video-utils";
import { Project, Video, projectsDB } from "@/data/projects-db";

export type EditorTimelineAction = TimelineAction & { file: File };
export type EditorTimelineRow = TimelineRow & { actions: EditorTimelineAction[] };

interface WorkspaceState {
  timelineRef: React.MutableRefObject<TimelineState>;
  mounted: boolean;
  setMounted: (value: boolean) => void;
  isPlaying: boolean;
  time: number;
  currentAction?: EditorTimelineAction;
  setCurrentAction: (value?: EditorTimelineAction) => void;

  project?: Project;

  timelineRow: EditorTimelineRow[];
  setTimelineRow: (value: EditorTimelineRow[]) => void;

  saveProject: (force?: boolean) => void;
  saveAction: (action: EditorTimelineAction) => void;

  videoDuration: number;
}

const WorkspaceContext = createContext<WorkspaceState>({} as WorkspaceState);

export const useWorkspace = () => {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error("useWorkspace must be used within a WorkspaceProvider");
  }
  return context;
};

export const WorkspaceProvider = ({ children }: { children: React.ReactNode }) => {
  const timelineState = useRef<TimelineState>();
  const [mounted, setMounted] = useState(false);
  const [currentTimelineAction, setCurrentTimelineAction] = useState<
    EditorTimelineAction | undefined
  >();

  const [isPlaying, setIsPlaying] = useState(false);

  const [time, setTime] = useState(0);

  const [timelineRow, setTimelineRow] = useState<EditorTimelineRow[]>([]);

  const { id } = useParams<{ id: string }>();
  const [isLoading, _project] = useProject(+id);
  const update = useUpdateProject();

  const [project, setProject] = useState<Project | undefined>(_project);

  const loadProject = useCallback(async (project: Project) => {
    if (!project) return;
    const videos_maps = await Promise.all(
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
              end: video.end || duration
            }
          ]
        };
        return row;
      })
    );
    setProject(project);

    setTimelineRow(videos_maps);
  }, []);

  useEffect(() => {
    if (!timelineState.current || (isLoading && !_project)) return;

    // setProject(_project);

    const engine = timelineState.current!;

    loadProject(_project!).then(() => {
      console.log("mounted");

      setMounted(true);
      engine.listener.on("play", () => setIsPlaying(true));
      engine.listener.on("paused", () => setIsPlaying(false));
      engine.listener.on("afterSetTime", ({ time }) => setTime(time));
      engine.listener.on("setTimeByTick", ({ time }) => {
        setTime(time);

        // timelineState!.current!.setScrollLeft(left);
      });
    });

    return () => {
      if (!engine) return;
      engine.pause();
      engine.listener.offAll();
      setMounted(false);
    };
  }, [_project, isLoading, loadProject]);

  const commitProject = useCallback(
    (newProject?: Project) => {
      projectsDB.projects.put(newProject || project!);
    },
    [project]
  );

  const saveProject = useCallback(
    async (saveForce: boolean = false) => {
      if (!project) return;
      console.log("Saving project...");

      const finalVideos = timelineRow
        .map(row => row.actions[0] as EditorTimelineAction)
        .map<Video>(video => {
          const oldVideo = project.videos.find(v => v.id === video.id);
          return {
            ...oldVideo!,
            start: video.start,
            end: video.end,
            duration: video.end
          };
        });

      setProject({
        ...project!,
        updatedAt: new Date(),
        videos: finalVideos
      });

      if (saveForce) {
        commitProject();
      }

      console.log("Project saved...");
    },
    [commitProject, project, timelineRow]
  );

  const saveAction = useCallback(
    async (action: EditorTimelineAction) => {
      if (!project) return;

      console.log("Saving action...");

      const originalVideo = project.videos.find(video => video.id === action.id);

      if (!originalVideo) return;

      const finalVideos = project.videos.map(video => {
        if (video.id === action.id) {
          return {
            ...video,
            start: action.start,
            end: action.end
          };
        }

        return video;
      });

      const newProject = {
        ...project!,
        updatedAt: new Date(),
        videos: finalVideos
      };
      setProject(newProject);
      commitProject(newProject);
      console.log("Action saved...");
    },
    [commitProject, project]
  );

  useEffect(() => {
    if (!project) return;
    const intervalId = setInterval(
      () => {
        saveProject();
        commitProject();
      },
      1000 * 60 * 3
    );

    return () => {
      clearInterval(intervalId);
    };
  }, [commitProject, id, project, saveProject, update]);

  const videoDuration = useMemo(
    () =>
      timelineRow.length > 0
        ? [...timelineRow].sort(
            (videoA, videoB) => videoB.actions[0].start - videoA.actions[0].start
          )[0].actions[0].end
        : 0,
    [timelineRow]
  );

  return (
    <WorkspaceContext.Provider
      value={{
        timelineRef: timelineState as never,
        mounted,
        setMounted,
        isPlaying,
        time,
        timelineRow,
        setTimelineRow,
        currentAction: currentTimelineAction,
        setCurrentAction: setCurrentTimelineAction,
        saveProject,
        saveAction,
        project,
        videoDuration
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
};
