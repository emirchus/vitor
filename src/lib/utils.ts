import { TimelineAction, TimelineRow } from "@/interfaces/timeline";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatBytes = (bytes: number, decimals: number = 2) => {
  if (!+bytes) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

export const formatTime = (time: number) => {
  const float = (parseInt((time % 1) * 100 + "") + "").padStart(2, "0");
  const min = (parseInt(time / 60 + "") + "").padStart(2, "0");
  const second = (parseInt((time % 60) + "") + "").padStart(2, "0");
  return `${min}:${second}.${float.replace("0.", "")}`;
};

export const MathClamp = (value: number, min: number, max: number) => {
  return Math.min(Math.max(value, min), max);
};

export function parserTimeToPixel(
  data: number,
  param: {
    startLeft: number;
    scale: number;
    scaleWidth: number;
  }
) {
  const { startLeft, scale, scaleWidth } = param;
  return startLeft + (data / scale) * scaleWidth;
}

export function parserPixelToTime(
  data: number,
  param: {
    startLeft: number;
    scale: number;
    scaleWidth: number;
  }
) {
  const { startLeft, scale, scaleWidth } = param;
  return ((data - startLeft) / scaleWidth) * scale;
}

export function parserTransformToTime(
  data: {
    left: number;
    width: number;
  },
  param: {
    startLeft: number;
    scale: number;
    scaleWidth: number;
  }
) {
  const { left, width } = data;
  const start = parserPixelToTime(left, param);
  const end = parserPixelToTime(left + width, param);
  return {
    start,
    end
  };
}

export function parserTimeToTransform(
  data: {
    start: number;
    end: number;
  },
  param: {
    startLeft: number;
    scale: number;
    scaleWidth: number;
  }
) {
  const { start, end } = data;
  const left = parserTimeToPixel(start, param);
  const width = parserTimeToPixel(end, param) - left;
  return {
    left,
    width
  };
}
export function getScaleCountByPixel(
  data: number,
  param: {
    startLeft: number;
    scaleWidth: number;
    scaleCount: number;
  }
) {
  const { startLeft, scaleWidth } = param;
  const count = Math.ceil((data - startLeft) / scaleWidth);
  return Math.max(count + 5, param.scaleCount);
}

export function getScaleCountByRows(data: TimelineRow[], param: { scale: number }) {
  let max = 0;
  data.forEach(row => {
    max = Math.max(max, row.action.end);
  });
  const count = Math.ceil(max / param.scale);
  return count + 5;
}
export function parserActionsToPositions(
  actions: TimelineAction[],
  param: {
    startLeft: number;
    scale: number;
    scaleWidth: number;
  }
) {
  const positions: number[] = [];
  actions.forEach(item => {
    positions.push(parserTimeToPixel(item.start, param));
    positions.push(parserTimeToPixel(item.end, param));
  });
  return positions;
}
