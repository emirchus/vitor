import Dexie, { Table } from "dexie";

export interface Video {
  id: string;
  file: File;
  thumbnail: string;
  start: number;
  end: number;
  duration: number;
  audio: {
    volume: number;
    muted: boolean;
  };
}

export interface Project {
  id?: number;
  name: string;
  videos: Video[];
  thumbnail?: string;
  createdAt: Date;
  updatedAt?: Date;
}

export class ProjectsDB extends Dexie {
  projects!: Table<Project, number>;

  constructor() {
    super("ProjectsDB");
    this.version(1).stores({
      projects: "++id, name, videos, createdAt, updatedAt, thumbnail",
    });
  }
}

export const projectsDB = new ProjectsDB();
