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
