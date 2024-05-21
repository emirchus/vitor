import { Resolution, AspectRatio } from "@/interfaces/project";

export const resolutions: Record<Resolution, { width: number; height: number }> = {
  "1080": { width: 1280, height: 720 },
  "720": { width: 1280, height: 720 },
  "480": { width: 640, height: 360 },
  "1440": { width: 2560, height: 1440 },
  "2160": { width: 3840, height: 2160 }
};

export const getResolution = (resolution: Resolution, modifier: AspectRatio) => {
  const { width } = resolutions[resolution];
  const [w, h] = modifier.split(":").map(Number);

  return {
    width,
    height: (width / w) * h
  };
};
