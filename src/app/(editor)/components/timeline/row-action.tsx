import { TimelineRow, TimelineAction, DragLineData } from "@/interfaces/timeline";
import { RefObject } from "react";
import { TimeAction } from ".";
import { cn } from "@/lib/utils";

interface TimeRowProps {
  areaRef: RefObject<HTMLDivElement>;
  rowData?: TimelineRow;
  style?: React.CSSProperties;
  scrollLeft: number;
  scaleCount: number;
  setScaleCount: (count: number) => void;
  setTimelineRow: (row: TimelineRow) => void;
  onActionMoveStart?: (params: { action: TimelineAction; row: TimelineRow }) => void;

  onActionMoving?: (params: { action: TimelineAction; row: TimelineRow; start: number; end: number }) => void | boolean;

  onActionMoveEnd?: (params: { action: TimelineAction; row: TimelineRow; start: number; end: number }) => void;

  onActionResizeStart?: (params: { action: TimelineAction; row: TimelineRow; dir: "right" | "left" }) => void;

  onActionResizing?: (params: { action: TimelineAction; row: TimelineRow; start: number; end: number; dir: "right" | "left" }) => void | boolean;

  onActionResizeEnd?: (params: { action: TimelineAction; row: TimelineRow; start: number; end: number; dir: "right" | "left" }) => void;

  deltaScrollLeft: (delta: number) => void;
  dragLineData: DragLineData;
}

export const RowAction = ({ areaRef, rowData, style, scaleCount, setScaleCount, setTimelineRow, ...props }: TimeRowProps) => {
  const setTimelineAction = (action: TimelineAction) => {
    rowData && setTimelineRow({ ...rowData, action });
  };

  return (
    <div style={style} className={cn("edit-row flex flex-row box-border", {
      "after:absolute after:w-full after:h-[60px] hover:after:bg-border/20 z-0": rowData
    })}>
      {rowData && (
        <TimeAction
          row={rowData}
          action={rowData.action}
          areaRef={areaRef}
          startLeft={20}
          scaleCount={scaleCount}
          setScaleCount={setScaleCount}
          setTimelineAction={setTimelineAction}
          {...props}
        />
      )}
    </div>
  );
};
