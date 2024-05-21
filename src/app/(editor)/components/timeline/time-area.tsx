import { cn, parserPixelToTime } from "@/lib/utils";
import { useRef } from "react";
import { GridCellRenderer, AutoSizer, Grid } from "react-virtualized";

interface TimeAreaProps {
  scrollLeft: number;
  scaleCount: number;
  setCursor: (param: { time: number }) => void;
}

export const TimeArea = ({ scrollLeft, scaleCount, setCursor }: TimeAreaProps) => {
  const gridRef = useRef<Grid>(null);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const cellRenderer: GridCellRenderer = ({ columnIndex, key, style: { height, bottom, top, ...style } }) => {
    const isShowScale = columnIndex % 10 === 0;

    return (
      <div
        key={key}
        style={style}
        className={cn("border-r border-border relative box-content bottom-0 top-auto select-none", {
          "h-3": isShowScale,
          "h-2": !isShowScale
        })}
      >
        {isShowScale && (
          <div className="absolute right-0 top-0 translate-x-1/2 -translate-y-full text-muted-foreground text-sm">{columnIndex / 10}</div>
        )}
      </div>
    );
  };

  const getColumnWidth = (data: { index: number }) => {
    switch (data.index) {
      case 0:
        return 20;
      default:
        return 160 / 10;
    }
  };

  const estColumnWidth = getColumnWidth({ index: 1 });

  return (
    <div className="relative h-8 time-area border-border border-b shadow-md">
      <AutoSizer>
        {({ width, height }) => {
          return (
            <>
              <Grid
                ref={gridRef}
                columnCount={scaleCount * 10 + 1}
                columnWidth={getColumnWidth}
                estimatedColumnSize={estColumnWidth}
                rowCount={1}
                rowHeight={height}
                width={width}
                height={height}
                overscanRowCount={0}
                overscanColumnCount={10}
                cellRenderer={cellRenderer}
                scrollLeft={scrollLeft}
              />
              <div
                style={{ width, height }}
                onClick={e => {
                  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                  const position = e.clientX - rect.x;
                  const left = Math.max(position + scrollLeft, 20);

                  if (left > Infinity * 160 + 20 - scrollLeft) return;

                  const time = parserPixelToTime(left, { startLeft: 20, scale: 1, scaleWidth: 160 });

                  setCursor({ time });
                }}
                className="absolute cursor-pointer top-0 left-0 w-full h-full"
              />
            </>
          );
        }}
      </AutoSizer>
    </div>
  );
};
