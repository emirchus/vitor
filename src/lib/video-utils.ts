export async function getVideoDuration(file: File) {
  const video = document.createElement("video");
  return new Promise<{ duration: number; thumbnail: string }>(resolve => {
    video.src = URL.createObjectURL(file);
    video.crossOrigin = "anonymous";

    const onSeeked = () => {
      const newCanvas = document.createElement("canvas");
      newCanvas.width = video.videoWidth;
      newCanvas.height = video.videoHeight;
      const ctx = newCanvas.getContext("2d");
      ctx!.drawImage(video, 0, 0);
      const CanvasToURL = newCanvas.toDataURL();
      resolve({ duration: video.duration, thumbnail: CanvasToURL });
    };

    video.addEventListener("seeked", onSeeked);

    const onLoadMetadata = () => (video.currentTime = 0);

    video.addEventListener("loadedmetadata", onLoadMetadata);
  });
}
