import { useEffect, useState } from "react";

export const usePreview = (file: File): [boolean, string?] => {
  const [imageUrl, setImageUrl] = useState<string>();
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    if (!file) {
      return;
    }
    const video = document.createElement("video");
    video.src = URL.createObjectURL(file);
    video.crossOrigin = "anonymous";

    const onSeeked = () => {
      const newCanvas = document.createElement("canvas");
      newCanvas.width = video.videoWidth;
      newCanvas.height = video.videoHeight;
      const ctx = newCanvas.getContext("2d");
      ctx!.drawImage(video, 0, 0);
      const CanvasToURL = newCanvas.toDataURL();
      setImageUrl(CanvasToURL);
      setIsLoaded(true);
    };

    video.addEventListener("seeked", onSeeked);

    const onLoadMetadata = () => (video.currentTime = 0);

    video.addEventListener("loadedmetadata", onLoadMetadata);

    return () => {
      video.removeEventListener("seeked", onSeeked);
      video.removeEventListener("loadedmetadata", onLoadMetadata);
      video.pause();
      video.src = "";
    };
  }, [file]);

  return [isLoaded, imageUrl];
};
