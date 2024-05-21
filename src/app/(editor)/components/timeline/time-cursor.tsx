import { RowDnd, RowRndApi } from "@/components/row-rnd";
import { cn, parserPixelToTime, parserTimeToPixel } from "@/lib/utils";
import React, { RefObject, useEffect, useRef } from "react";
import { ScrollSync } from "react-virtualized";

export type TimeCursorProps = {
  scrollLeft: number;
  setCursor: (param: { left?: number; time?: number }) => void;
  areaRef: RefObject<HTMLDivElement>;
  deltaScrollLeft: (delta: number) => void;
  scrollSync: RefObject<ScrollSync>;
  cursorTime: number;
  onCursorDragStart: (time: number) => void;
  onCursorDragEnd: (time: number) => void;
  onCursorDrag: (time: number) => void;
  timelineWidth: number;
  startLeft: number;
};

export const TimeCursor = ({
  cursorTime,
  setCursor,
  startLeft,
  timelineWidth,
  scrollLeft,
  scrollSync,
  areaRef,
  deltaScrollLeft,
  onCursorDragStart,
  onCursorDrag,
  onCursorDragEnd
}: TimeCursorProps) => {
  const rowRnd = useRef<RowRndApi>(null);
  const draggingLeft = useRef<number | undefined>();

  useEffect(() => {
    if (typeof draggingLeft.current === "undefined") {
      rowRnd.current?.updateLeft(parserTimeToPixel(cursorTime, { startLeft, scaleWidth: 160, scale: 1 }) - scrollLeft);
    }
  }, [cursorTime, scrollLeft, startLeft]);

  return (
    <RowDnd
      start={startLeft}
      ref={rowRnd}
      parentRef={areaRef}
      bounds={{
        left: 0,
        right: Math.min(timelineWidth, Infinity * 160 + startLeft - scrollLeft)
      }}
      deltaScrollLeft={deltaScrollLeft}
      enableDragging
      enableResizing={false}
      onDragStart={() => {
        onCursorDragStart && onCursorDragStart(cursorTime);
        draggingLeft.current = parserTimeToPixel(cursorTime, { startLeft, scaleWidth: 160, scale: 1 }) - scrollLeft;
        rowRnd.current?.updateLeft(draggingLeft.current);
      }}
      onDragEnd={() => {
        const time = parserPixelToTime(draggingLeft.current! + scrollLeft, { startLeft, scale: 1, scaleWidth: 160 });
        setCursor({ time });
        onCursorDragEnd && onCursorDragEnd(time);
        draggingLeft.current = undefined;
      }}
      onDrag={({ left }, scroll = 0) => {
        const scrollLeft = scrollSync.current!.state.scrollLeft;

        if (scroll === undefined || scrollLeft === 0) {
          if (left < startLeft - scrollLeft) draggingLeft.current = startLeft - scrollLeft;
          else draggingLeft.current = left;
        } else {
          if (draggingLeft.current! < startLeft - scrollLeft - scroll) {
            draggingLeft.current = startLeft - scrollLeft - scroll;
          }
        }

        rowRnd.current?.updateLeft(draggingLeft.current!);
        const time = parserPixelToTime(draggingLeft.current! + scrollLeft, { startLeft, scale: 1, scaleWidth: 160 });
        setCursor({ time });
        onCursorDrag && onCursorDrag(time);
        return false;
      }}
    >
      <div
        className={cn("cursor-ew-resize absolute top-[2rem] h-[calc(100%-32px)] box-border border-x border-blue-600 text-blue-600 z-0", {
          "transition-all duration-100 ease-in-out": typeof draggingLeft.current === "undefined"
        })}
      >
        <svg className={"absolute top-0 left-1/2 -translate-x-1/2 m-auto fill-blue-600 w-2"} width="8" height="12" viewBox="0 0 8 12" fill="none">
          <path
            d="M0 1C0 0.447715 0.447715 0 1 0H7C7.55228 0 8 0.447715 8 1V9.38197C8 9.76074 7.786 10.107 7.44721 10.2764L4.44721 11.7764C4.16569 11.9172 3.83431 11.9172 3.55279 11.7764L0.552786 10.2764C0.214002 10.107 0 9.76074 0 9.38197V1Z"
            fill="current"
          />
        </svg>
        <div className={"w-2 h-full cursor-ew-resize absolute top-0 -left-1/2 -translate-x-1/2"} />
      </div>
    </RowDnd>
  );
};
