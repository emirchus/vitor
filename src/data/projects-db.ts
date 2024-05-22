import { Project } from "@/interfaces/project";
import Dexie, { Table } from "dexie";

export class ProjectsDB extends Dexie {
  projects!: Table<Project, number>;

  constructor() {
    super("ProjectsDB");
    this.version(1).stores({
      projects: "++id, name, videos, createdAt, updatedAt, thumbnail"
    });
  }
}

export const projectsDB = new ProjectsDB();
