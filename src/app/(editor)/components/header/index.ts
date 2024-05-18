import dynamic from "next/dynamic";

export const Header = dynamic(() => import("./header"), {
  ssr: false
});
