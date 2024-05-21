import {
  RowRndApi,
  RndDragStartCallback,
  RndDragCallback,
  RndDragEndCallback,
  RndResizeStartCallback,
  RndResizeCallback,
  RndResizeEndCallback,
  RowDnd
} from "@/components/row-rnd";
import { TimelineAction, TimelineRow, DragLineData } from "@/interfaces/timeline";
import { parserTimeToPixel, parserTimeToTransform, getScaleCountByPixel, parserTransformToTime } from "@/lib/utils";
import { RefObject, useRef, useState, useEffect } from "react";

interface TimeActionProps {
  action: TimelineAction;
  row: TimelineRow;
  areaRef: RefObject<HTMLDivElement>;
  startLeft: number;
  setTimelineAction: (action: TimelineAction) => void;
  scaleCount: number;
  setScaleCount: (count: number) => void;
  onActionMoveStart?: (params: { action: TimelineAction; row: TimelineRow }) => void;

  onActionMoving?: (params: { action: TimelineAction; row: TimelineRow; start: number; end: number }) => void | boolean;

  onActionMoveEnd?: (params: { action: TimelineAction; row: TimelineRow; start: number; end: number }) => void;

  onActionResizeStart?: (params: { action: TimelineAction; row: TimelineRow; dir: "right" | "left" }) => void;

  onActionResizing?: (params: { action: TimelineAction; row: TimelineRow; start: number; end: number; dir: "right" | "left" }) => void | boolean;

  onActionResizeEnd?: (params: { action: TimelineAction; row: TimelineRow; start: number; end: number; dir: "right" | "left" }) => void;

  dragLineData: DragLineData;
  deltaScrollLeft: (delta: number) => void;
}

export const TimeAction = ({
  action,
  row,
  areaRef,
  startLeft,
  scaleCount,
  setScaleCount,
  setTimelineAction,
  dragLineData,
  onActionMoveEnd,
  onActionMoveStart,
  onActionMoving,
  onActionResizeEnd,
  onActionResizeStart,
  onActionResizing,
  deltaScrollLeft
}: TimeActionProps) => {
  const rowRnd = useRef<RowRndApi>(null);
  const isDragWhenClick = useRef(false);
  const { start, end } = action;

  const rightLimit = Math.min(
    Infinity * 160 + startLeft,
    parserTimeToPixel(Number.MAX_VALUE, {
      startLeft,
      scale: 1,
      scaleWidth: 160
    })
  );

  const [transform, setTransform] = useState<{ left: number; width: number }>(() => {
    return parserTimeToTransform({ start, end }, { startLeft, scale: 1, scaleWidth: 160 });
  });

  useEffect(() => {
    setTransform(parserTimeToTransform({ start, end }, { startLeft, scale: 1, scaleWidth: 160 }));
  }, [end, start, startLeft]);

  const gridSize = 160 / 10;

  const handleScaleCount = (left: number, width: number) => {
    const curScaleCount = getScaleCountByPixel(left + width, {
      startLeft,
      scaleCount,
      scaleWidth: 160
    });
    if (curScaleCount !== scaleCount) setScaleCount(curScaleCount);
  };
  const handleDragStart: RndDragStartCallback = () => {
    onActionMoveStart && onActionMoveStart({ action, row });
  };

  const handleDrag: RndDragCallback = ({ left, width }) => {
    isDragWhenClick.current = true;
    if (onActionMoving) {
      const { start, end } = parserTransformToTime({ left, width }, { scaleWidth: 160, scale: 1, startLeft });
      const result = onActionMoving({ action, row, start, end });
      if (result === false) return false;
    }
    setTransform({ left, width });
    handleScaleCount(left, width);
  };

  const handleDragEnd: RndDragEndCallback = ({ left, width }) => {
    const { start, end } = parserTransformToTime({ left, width }, { scaleWidth: 160, scale: 1, startLeft });

    setTimelineAction({ ...action, start, end });
    if (onActionMoveEnd) onActionMoveEnd({ action, row, start, end });
  };

  const handleResizeStart: RndResizeStartCallback = dir => {
    //TODO: Implement resize start
    onActionResizeStart && onActionResizeStart({ action, row, dir });
  };

  const handleResizing: RndResizeCallback = (dir, { left, width }) => {
    isDragWhenClick.current = true;
    if (onActionResizing) {
      const { start, end } = parserTransformToTime({ left, width }, { scaleWidth: 160, scale: 1, startLeft });
      const result = onActionResizing({ action, row, start, end, dir });
      if (result === false) return false;
    }
    setTransform({ left, width });

    handleScaleCount(left, width); //TODO: Implement resize
  };

  const handleResizeEnd: RndResizeEndCallback = (dir, { left, width }) => {
    const { start, end } = parserTransformToTime({ left, width }, { scaleWidth: 160, scale: 1, startLeft });
    setTimelineAction({ ...action, start, end });
    if (onActionResizeEnd) onActionResizeEnd({ action, row, start, end, dir });
  };

  return (
    <RowDnd
      ref={rowRnd}
      parentRef={areaRef}
      start={startLeft}
      left={transform.left}
      width={transform.width}
      grid={1}
      adsorptionDistance={Math.max(gridSize / 2, 8)}
      adsorptionPositions={dragLineData.assistPositions}
      deltaScrollLeft={deltaScrollLeft}
      bounds={{
        left: 20,
        right: rightLimit
      }}
      edges={{
        left: `.action-left-stretch`,
        right: `.action-right-stretch`
      }}
      enableDragging
      enableResizing
      onDragStart={handleDragStart}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
      onResizeStart={handleResizeStart}
      onResize={handleResizing}
      onResizeEnd={handleResizeEnd}
    >
      <div
        onMouseDown={() => {
          isDragWhenClick.current = false;
        }}
        className={
          "action absolute left-0 top-1/2 -translate-y-1/2 bg-green-600/20 border-green-600 border rounded z-[1] h-[40px] box-border bg-repeat-x  "
        }
        style={{
          backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="40" fill-opacity="0.4"><image width="40" height="40" xlink:href="${action.thumbnail}" /></svg>')`,
          backgroundSize: "contain",
          backgroundPosition: "center"
        }}
      >
        <div className="action-left-stretch z-[2] cursor-e-resize absolute top-1/2 w-1 left-0 -translate-x-1/2 -translate-y-1/2 h-[70%] bg-green-600 border border-green-600 rounded-md" />
        <div className="action-right-stretch z-[2] cursor-e-resize absolute top-1/2 w-1 right-0 translate-x-1/2 -translate-y-1/2 h-[70%] bg-green-600 border border-green-600 rounded-md" />
      </div>
    </RowDnd>
  );
};
