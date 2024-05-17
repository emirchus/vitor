import { Project, projectsDB } from "@/data/projects-db";
import { useEffect, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";

export const useProjects = (search: string = "", page: number = 1) => {
  const limit = 8;
  return useLiveQuery(
    () =>
      projectsDB.projects
        .filter(project => project.name.toLowerCase().includes(search.toLowerCase()))
        .offset(limit * (page - 1))
        .limit(limit)
        .reverse()
        .sortBy("createdAt"),
    [search, page]
  );
};

export const useProjectsCount = (search: string = "") => {
  return useLiveQuery(
    () =>
      projectsDB.projects
        .filter(project => project.name.toLowerCase().includes(search.toLowerCase()))
        .count(),
    [search],
    0
  );
};
export const useProject = (id: number): [boolean, Project?] => {
  const [project, setProject] = useState<Project | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isNaN(id)) {
      return;
    }

    projectsDB.projects.get(id).then(project => {
      setProject(project);
      setLoading(false);
    });

    return () => {
      setProject(undefined);
      setLoading(true);
    };
  }, [id]);

  return [loading, project];
};

export const useCreateProject = () => {
  return async (project: Omit<Omit<Omit<Project, "updatedAt">, "createdAt">, "id">) => {
    return projectsDB.projects.add({ ...project, createdAt: new Date() });
  };
};

export const useUpdateProject = () => {
  return async (id: number, project: Partial<Project>) => {
    return projectsDB.projects.update(id, { ...project, updatedAt: new Date() });
  };
};

export const useDeleteProject = () => {
  return async (id: number) => {
    return projectsDB.projects.delete(id);
  };
};
