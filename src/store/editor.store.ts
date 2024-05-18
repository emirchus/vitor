import { create } from "zustand";

export interface EditorStore {
  panelLeft: boolean;
  setPanelLeft: (panelLeft: boolean) => void;
  timeline: boolean;
  setTimeline: (timeline: boolean) => void;
  exportProcess: number;
  setExportProcess: (exportProcess: number) => void;
  isExporting: boolean;
  setIsExporting: (isExporting: boolean) => void;
}

export const useEditorStore = create<EditorStore>(set => ({
  panelLeft: false,
  setPanelLeft: panelLeft => set({ panelLeft }),
  timeline: false,
  setTimeline: timeline => set({ timeline }),
  exportProcess: 0,
  setExportProcess: exportProcess => set({ exportProcess }),
  isExporting: false,
  setIsExporting: isExporting => set({ isExporting })
}));
