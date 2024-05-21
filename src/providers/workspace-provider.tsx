"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useProject, useUpdateProject } from "@/hooks/use-projects";
import { projectsDB } from "@/data/projects-db";
import { Project } from "@/interfaces/project";
import { Logger } from "@/lib/logger";
import { useTimeline } from "./timeline-provider";

const logger = Logger.create("[Workspace Provider]", ["green"], () => {});

interface WorkspaceState {
  mounted: boolean;
  setMounted: (value: boolean) => void;

  project?: Project;

  saveProject: (saveForce?: boolean, project?: Project) => Promise<void>;

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
  const [mounted, setMounted] = useState(false);
  const { updateData } = useTimeline();

  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [loading, _project] = useProject(+id);
  const update = useUpdateProject();

  const [project, setProject] = useState<Project | undefined>(_project);

  const loadProject = useCallback(
    async (project: Project) => {
      if (!project) return;

      //TODO: Transcode timeline
      updateData(
        project.videos.map(video => ({
          id: video.id,
          action: {
            ...video,
            rowId: video.id
          }
        }))
      );

      setProject(project);
    },
    [updateData]
  );

  useEffect(() => {
    logger.log("Initializing workspace...");

    if (!loading && !_project) {
      router.replace("/");
      return;
    }

    if (!_project) return;
    setMounted(false);
    (async () => {
      await loadProject(_project!);
      setMounted(true);
    })();

    return () => {
      logger.log("Workspace destroyed...");
      setMounted(false);
    };
  }, [_project, loadProject, loading, router]);

  const commitProject = useCallback(
    (newProject?: Project) => {
      projectsDB.projects.put(newProject || project!);
    },
    [project]
  );

  const saveProject = useCallback(
    async (saveForce: boolean = false, newProject?: Project) => {
      if (!project) return;
      if (newProject) setProject(newProject);
      logger.log("Saving project...");

      if (saveForce) {
        commitProject();
      }

      logger.log("Project saved...");
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

  const videoDuration = useMemo(() => project?.videos.map(video => video.end).sort((a, b) => b - a)[0] || 0, [project?.videos]);

  return (
    <WorkspaceContext.Provider
      value={{
        mounted,
        setMounted,
        saveProject,
        project,
        videoDuration
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
};
