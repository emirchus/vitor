import { ScrollArea } from "@/components/ui/scroll-area";
import { Header } from "./components/header";
import { Sidebar } from "./components/sidebar";
export const metadata = {
  title: "Dashboard"
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col w-full overflow-x-hidden relative">
      <div className="flex flex-1 flex-row w-screen h-[calc(100vh-2.5rem)] relative overflow-hidden">
        <Sidebar />
        <ScrollArea className="flex flex-col flex-1 w-full h-screen">
          <Header />
          {children}
        </ScrollArea>
      </div>
    </div>
  );
}
