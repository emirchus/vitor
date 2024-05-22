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

export type Resolution = 2160 | 1440 | 1080 | 720 | 480;

export type Framerate = 15 | 24 | 30 | 60;

export type AspectRatio = "16:9" | "4:3" | "1:1" | "9:16";

export interface Project {
  id?: number;
  name: string;
  videos: Video[];
  thumbnail?: string;
  createdAt: Date;
  updatedAt?: Date;
  resolution: Resolution;
  framerate: Framerate;
  aspectRatio: AspectRatio;
}
