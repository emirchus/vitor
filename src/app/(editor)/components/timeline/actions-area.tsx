import { useDragLine } from "@/hooks/use-dragline";
import { TimelineRow, TimelineAction } from "@/interfaces/timeline";
import { parserTimeToPixel } from "@/lib/utils";
import { useRef, useLayoutEffect, useEffect, useImperativeHandle, forwardRef, MutableRefObject } from "react";
import { OnScrollParams, GridCellRenderer, AutoSizer, Grid } from "react-virtualized";
import { RowAction } from "./row-action";

interface ActionsAreaProps {
  scrollLeft: number;
  scrollTop: number;
  onScroll: (params: OnScrollParams) => void;
  timelineRows: TimelineRow[];
  setTimelineRow: (row: TimelineRow) => void;
  scaleCount: number;
  setScaleCount: (count: number) => void;
  cursorTime: number;
  deltaScrollLeft: (delta: number) => void;
}

export const ActionsArea = forwardRef<{ domRef: MutableRefObject<HTMLDivElement | null> }, ActionsAreaProps>(
  ({ onScroll, scrollLeft, scrollTop, setTimelineRow, timelineRows, scaleCount, setScaleCount, deltaScrollLeft, cursorTime }, ref) => {
    const editAreaRef: MutableRefObject<HTMLDivElement | null> = useRef<HTMLDivElement | null>(null);
    const gridRef = useRef<Grid>(null);
    const heightRef = useRef(-1);
    const { dragLineData, initDragLine, updateDragLine, disposeDragLine, defaultGetAssistPosition, defaultGetMovePosition } = useDragLine();

    useImperativeHandle(ref, () => ({
      get domRef() {
        return editAreaRef;
      }
    }));

    const handleInitDragLine = (data: { action: TimelineAction; row: TimelineRow }) => {
      const cursorLeft = parserTimeToPixel(cursorTime, { scaleWidth: 160, scale: 1, startLeft: 20 });

      const assistPositions = defaultGetAssistPosition({
        editorData: timelineRows,
        assistActionIds: undefined,
        action: data.action,
        row: data.row,
        scale: 1,
        scaleWidth: 160,
        startLeft: 20,
        hideCursor: false,
        cursorLeft
      });

      initDragLine({ assistPositions });
    };

    const handleUpdateDragLine = (data: { action: TimelineAction; row: TimelineRow; start: number; end: number }) => {
      const movePositions = defaultGetMovePosition({
        ...data,
        startLeft: 20,
        scaleWidth: 160,
        scale: 1
      });
      updateDragLine({ movePositions });
    };

    const cellRenderer: GridCellRenderer = ({ rowIndex, key, style }) => {
      const row = timelineRows[rowIndex];

      return (
        <RowAction
          deltaScrollLeft={deltaScrollLeft}
          scaleCount={scaleCount}
          setScaleCount={setScaleCount}
          setTimelineRow={setTimelineRow}
          key={key}
          areaRef={editAreaRef}
          rowData={row}
          style={{
            ...style,
            backgroundPositionX: `0, 20px`,
            backgroundSize: `20px, 160px`
          }}
          scrollLeft={scrollLeft}
          dragLineData={dragLineData}
          onActionMoveStart={data => {
            handleInitDragLine(data);
          }}
          onActionResizeStart={data => {
            handleInitDragLine(data);
          }}
          onActionMoving={data => {
            handleUpdateDragLine(data);
          }}
          onActionResizing={data => {
            handleUpdateDragLine(data);
          }}
          onActionResizeEnd={() => {
            disposeDragLine();
          }}
          onActionMoveEnd={() => {
            disposeDragLine();
          }}
        />
      );
    };
    useLayoutEffect(() => {
      gridRef.current?.scrollToPosition({ scrollTop, scrollLeft });
    }, [scrollTop, scrollLeft]);

    useEffect(() => {
      gridRef.current?.recomputeGridSize();
    }, [timelineRows]);

    return (
      <div className="overflow-hidden relative edit-area" ref={editAreaRef}>
        <AutoSizer>
          {({ width, height }) => {
            const totalHeight = timelineRows.length * 60;

            const heights = new Array(Math.ceil(totalHeight / 60)).fill(60);

            if (totalHeight < height) {
              heights.push(height - totalHeight);
              if (heightRef.current !== height && heightRef.current >= 0) {
                setTimeout(() =>
                  gridRef.current?.recomputeGridSize({
                    rowIndex: heights.length - 1
                  })
                );
              }
            }

            heightRef.current = height;

            return (
              <Grid
                columnCount={1}
                rowCount={heights.length}
                ref={gridRef}
                cellRenderer={cellRenderer}
                columnWidth={Math.max(scaleCount * 160 + 20, width)}
                width={width}
                height={height}
                rowHeight={({ index }) => heights[index] || 60}
                overscanRowCount={10}
                overscanColumnCount={0}
                onScroll={onScroll}
              />
            );
          }}
        </AutoSizer>

        <div className={"absolute h-full top-0 left-0"}>
          {dragLineData.isMoving &&
            dragLineData.movePositions
              .filter(item => dragLineData.assistPositions.includes(item))
              .map((linePos, index) => {
                return (
                  <div
                    key={index}
                    className="w-0 absolute top-0 h-[99%] border-r border-dashed border-red-600 dark:border-red-300"
                    style={{ left: linePos - scrollLeft }}
                  />
                );
              })}
        </div>
      </div>
    );
  }
);

ActionsArea.displayName = "ActionsArea";
