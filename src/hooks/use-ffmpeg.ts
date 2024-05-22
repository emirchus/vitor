import React, { useRef, useState } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { toBlobURL } from "@ffmpeg/util";
import { Logger } from "@/lib/logger";

interface FFmpegHook {
  load: () => Promise<void>;
  ffmpegRef: React.MutableRefObject<FFmpeg>;
  loaded: boolean;
  abort: () => void;
  abortSignal?: AbortController;
  setAbortSignal: (signal?: AbortController) => void;
}

const logger = Logger.create("[FFMPEG]", ["red"], () => {});

export const useFfmpeg = (): FFmpegHook => {
  const [loaded, setLoaded] = useState(false);
  const ffmpegRef = useRef<FFmpeg>(new FFmpeg());
  const [abortSignal, setAbortSignal] = useState<AbortController | undefined>();

  const load = async () => {
    const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";
    const ffmpeg = ffmpegRef.current;
    ffmpeg.on("log", ({ message }) => {
      logger.log(message);
    });
    // toBlobURL is used to bypass CORS issue, urls with the same
    // domain can be used directly.
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm")
    });

    ffmpeg.on("progress", ({ progress, time }) => {
      logger.log(`progress: ${progress}, time: ${time}`);
    });

    setLoaded(true);
  };

  const abort = () => {
    abortSignal?.abort();
  };

  return { load, ffmpegRef, loaded, abort, abortSignal, setAbortSignal };
};
