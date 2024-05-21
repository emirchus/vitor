"use client";

import { TimelineRow } from "@/interfaces/timeline";
import { ReactNode, RefObject, createContext, useContext, useRef, useState } from "react";
import { ScrollSync } from "react-virtualized";

interface TimelineProviderProps {
  data?: TimelineRow[];
  updateData: (data?: TimelineRow[]) => void;
  scrollSync: RefObject<ScrollSync>;
  width: number;
  setWidth: (width: number) => void;
  time: number;
  setTime: (time: number) => void;
  cursorTime: number;
  setCursorTime: (time: number) => void;
  scaleCount: number;
  setScaleCount: (count: number) => void;
}

const TimelineContext = createContext<TimelineProviderProps>({} as TimelineProviderProps);

export const useTimeline = () => {
  const context = useContext(TimelineContext);

  if (!context) {
    throw new Error("useTimeline must be used within a TimelineProvider");
  }

  return context;
};

export const TimelineProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<TimelineRow[] | undefined>();
  const scrollSync = useRef<ScrollSync | null>(null);

  const [width, setWidth] = useState(0);
  const [scaleCount, setScaleCount] = useState(0);
  const [time, setTime] = useState(0);
  const [cursorTime, setCursorTime] = useState(0);

  return (
    <TimelineContext.Provider
      value={{
        data,
        updateData: setData,
        scrollSync,
        width,
        setWidth,
        time,
        setTime,
        cursorTime,
        setCursorTime,
        scaleCount,
        setScaleCount
      }}
    >
      {children}
    </TimelineContext.Provider>
  );
};
