import { TimelineProvider } from "@/providers/timeline-provider";
import { Header } from "./components/header";

export const metadata = {
  title: "Editor"
};

export default function EditorLayout({ children }: { children: React.ReactNode }) {
  return (
    <TimelineProvider>
      <div className="flex flex-col w-screen h-screen">
        <Header />
        <main className="w-full h-[calc(100vh-2.25rem)]">{children}</main>
      </div>
    </TimelineProvider>
  );
}
