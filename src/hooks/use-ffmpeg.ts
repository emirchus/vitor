import React, { useRef, useState } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { toBlobURL } from "@ffmpeg/util";

interface FFmpegHook {
  load: () => Promise<void>;
  ffmpegRef: React.MutableRefObject<FFmpeg>;
  loaded: boolean;
}

export const useFfmpeg = (): FFmpegHook => {
  const [loaded, setLoaded] = useState(false);
  const ffmpegRef = useRef<FFmpeg>(new FFmpeg());

  const load = async () => {
    const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";
    const ffmpeg = ffmpegRef.current;
    ffmpeg.on("log", ({ message }) => {
      console.log(message);
    });
    // toBlobURL is used to bypass CORS issue, urls with the same
    // domain can be used directly.
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm")
    });

    ffmpeg.on("progress", ({ progress, time}) => {
      console.log(`progress: ${progress}, time: ${time}`);
    });
    setLoaded(true);
  };

  return { load, ffmpegRef, loaded };
};
