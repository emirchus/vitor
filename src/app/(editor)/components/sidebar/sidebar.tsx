import { ScrollArea } from "@/components/ui/scroll-area";
import React from "react";

export const Sidebar = () => {
  return (
    <ScrollArea className="h-full">
      <div className="relative hidden flex-col items-start gap-8 md:flex p-5  w-full h-full overflow-auto">
        <form className="grid w-full items-start gap-6">
          <fieldset className="grid gap-6 rounded-lg border p-4 min-h-[200px]">
            <legend className="-ml-1 px-1 text-sm font-medium">Panel</legend>
          </fieldset>
          <fieldset className="grid gap-6 rounded-lg border p-4 min-h-[200px]">
            <legend className="-ml-1 px-1 text-sm font-medium">Settings</legend>
          </fieldset>
          <fieldset className="grid gap-6 rounded-lg border p-4 min-h-[200px]">
            <legend className="-ml-1 px-1 text-sm font-medium">Effects</legend>
          </fieldset>
        </form>
      </div>
    </ScrollArea>
  );
};
