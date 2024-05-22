import { DragLineData, TimelineAction, TimelineRow } from "@/interfaces/timeline";
import { parserActionsToPositions, parserTimeToTransform } from "@/lib/utils";
import { useState } from "react";

export function useDragLine() {
  const [dragLineData, setDragLineData] = useState<DragLineData>({ isMoving: false, movePositions: [], assistPositions: [] });

  const defaultGetAssistPosition = (data: {
    editorData: TimelineRow[];
    assistActionIds?: string[];
    action: TimelineAction;
    row: TimelineRow;
    startLeft: number;
    scale: number;
    scaleWidth: number;
    hideCursor: boolean;
    cursorLeft: number;
  }) => {
    const { editorData, assistActionIds, action, row, scale, scaleWidth, startLeft, cursorLeft, hideCursor } = data;
    const otherActions: TimelineAction[] = [];
    if (assistActionIds) {
      editorData.forEach(rowItem => {
        if (assistActionIds.includes(rowItem.action.id)) otherActions.push(rowItem.action);
      });
    } else {
      editorData.forEach(rowItem => {
        if (rowItem.id !== row.id) {
          otherActions.push(rowItem.action);
        } else {
          if (rowItem.action.id !== action.id) otherActions.push(rowItem.action);
        }
      });
    }

    const positions = parserActionsToPositions(otherActions, {
      startLeft,
      scale,
      scaleWidth
    });
    if (!hideCursor) positions.push(cursorLeft);

    return positions;
  };

  const defaultGetMovePosition = (data: {
    start: number;
    end: number;
    dir?: "right" | "left";
    startLeft: number;
    scale: number;
    scaleWidth: number;
  }) => {
    const { start, end, dir, scale, scaleWidth, startLeft } = data;
    const { left, width } = parserTimeToTransform({ start, end }, { startLeft, scaleWidth, scale });
    if (!dir) return [left, left + width];
    return dir === "right" ? [left + width] : [left];
  };

  const initDragLine = (data: { movePositions?: number[]; assistPositions?: number[] }) => {
    const { movePositions, assistPositions } = data;

    setDragLineData({
      isMoving: true,
      movePositions: movePositions || [],
      assistPositions: assistPositions || []
    });
  };

  const updateDragLine = (data: { movePositions?: number[]; assistPositions?: number[] }) => {
    const { movePositions, assistPositions } = data;
    setDragLineData(pre => ({
      ...pre,
      movePositions: movePositions || pre.movePositions,
      assistPositions: assistPositions || pre.assistPositions
    }));
  };

  const disposeDragLine = () => {
    setDragLineData({ isMoving: false, movePositions: [], assistPositions: [] });
  };

  return {
    initDragLine,
    updateDragLine,
    disposeDragLine,
    dragLineData,
    defaultGetAssistPosition,
    defaultGetMovePosition
  };
}
