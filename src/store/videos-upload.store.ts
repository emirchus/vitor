import { create } from "zustand";

export interface VideosUploadStore {
  videos: File[];
  setVideos: (videos: File[]) => void;
  addVideo: (video: File) => void;
  removeVideo: (index: number) => void;
  modal: boolean;
  setModal: (modal: boolean) => void;
}

export const useVideosUploadStore = create<VideosUploadStore>(set => ({
  videos: [],
  setVideos: videos => set({ videos }),
  addVideo: video => set(state => ({ videos: [...state.videos, video] })),
  removeVideo: index => set(state => ({ videos: state.videos.filter((_, i) => i !== index) })),
  modal: false,
  setModal: modal => set({ modal }),
}));
