import dynamic from "next/dynamic";

export const VideoListSSR = dynamic(() => import("./videos-list"), {
  ssr: false
});
