"use client";

import { TimelineRow } from "@/interfaces/timeline";
import { getScaleCountByRows, parserPixelToTime, parserTimeToPixel } from "@/lib/utils";
import { MutableRefObject, useCallback, useEffect, useLayoutEffect, useRef } from "react";
import { ScrollSync } from "react-virtualized";
import { ActionsArea, TimeArea, TimeCursor } from ".";
import { useTimeline } from "@/providers/timeline-provider";

export const Timeline = () => {
  const domRef: MutableRefObject<HTMLDivElement | null> = useRef<HTMLDivElement | null>(null);
  const editAreaRef: MutableRefObject<HTMLDivElement | null> = useRef<HTMLDivElement | null>(null);

  const { cursorTime, scaleCount, scrollSync, setCursorTime, setScaleCount, setTime, width, setWidth, data, updateData } = useTimeline();

  useEffect(() => {
    if (editAreaRef.current) {
      const resizeObserver = new ResizeObserver(() => {
        if (!editAreaRef.current) return;
        setWidth(editAreaRef.current.getBoundingClientRect().width);
      });
      resizeObserver.observe(editAreaRef.current!);
      return () => {
        resizeObserver && resizeObserver.disconnect();
      };
    }
  }, [setWidth]);

  const handleSetScaleCount = useCallback(
    (value: number) => {
      const data = Math.min(Infinity, Math.max(20, value));
      setScaleCount(data);
    },
    [setScaleCount]
  );

  useLayoutEffect(() => {
    if (!data) return;
    handleSetScaleCount(getScaleCountByRows(data, { scale: 1 }));
  }, [data, handleSetScaleCount]);

  const handleSetTimelineRow = (row: TimelineRow) => {
    updateData(data?.map(item => (item.id === row.id ? row : item)) || []);
  };

  const handleSetCursor = (param: { left?: number; time?: number }) => {
    let { left, time } = param;
    if (typeof left === "undefined" && typeof time === "undefined") return;

    if (typeof time === "undefined") {
      if (typeof left === "undefined") left = parserTimeToPixel(0, { startLeft: 20, scale: 1, scaleWidth: 160 });
      time = parserPixelToTime(left, { startLeft: 20, scale: 1, scaleWidth: 160 });
    }

    setTime(time);
    setCursorTime(time);
  };

  const handleDeltaScrollLeft = (delta: number) => {
    const data = (scrollSync.current?.state.scrollLeft || 0) + delta;
    if (data > scaleCount * (160 - 1) + 20 - width) return;
    scrollSync.current && scrollSync.current.setState({ scrollLeft: Math.max(scrollSync.current.state.scrollLeft + delta, 0) });
  };

  return (
    <div ref={domRef} className="w-full h-full timeline flex flex-col overflow-hidden text-sm pt-2 relative">
      <ScrollSync ref={scrollSync}>
        {({ onScroll, scrollLeft, scrollTop }) => {
          return (
            <>
              <TimeArea scrollLeft={scrollLeft} scaleCount={scaleCount} setCursor={handleSetCursor} />
              <ActionsArea
                scrollTop={scrollTop}
                ref={ref => {
                  if (ref) {
                    editAreaRef.current = ref.domRef.current;
                  }
                }}
                timelineRows={data || []}
                setTimelineRow={handleSetTimelineRow}
                scaleCount={scaleCount}
                setScaleCount={setScaleCount}
                onScroll={onScroll}
                scrollLeft={scrollLeft}
                cursorTime={cursorTime}
                deltaScrollLeft={handleDeltaScrollLeft}
              />
              <TimeCursor
                scrollLeft={scrollLeft}
                setCursor={handleSetCursor}
                areaRef={editAreaRef}
                deltaScrollLeft={handleDeltaScrollLeft}
                scrollSync={scrollSync}
                cursorTime={cursorTime}
                onCursorDragStart={() => {}}
                onCursorDragEnd={() => {}}
                onCursorDrag={() => {}}
                timelineWidth={width}
                startLeft={20}
              />
            </>
          );
        }}
      </ScrollSync>
    </div>
  );
};
