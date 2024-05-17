export function getVideoDuration(video: File) {
  return new Promise<number>(resolve => {
    const videoElement = document.createElement("video");
    videoElement.src = URL.createObjectURL(video);
    videoElement.onloadedmetadata = () => {
      resolve(videoElement.duration );
    };
  });
}
