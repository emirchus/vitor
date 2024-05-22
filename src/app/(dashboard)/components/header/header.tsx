import React from "react";

import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { SidebarMobile } from "../sidebar";

export const Header = () => {
  return (
    <header className="sticky top-0 left-0 isolate flex items-center gap-x-6 overflow-hidden bg-muted px-6 py-2.5 sm:px-3.5 sm:before:flex-1 h-14 lg:h-[60px] z-20 shadow">
      <div
        className="absolute left-[max(-7rem,calc(50%-52rem))] top-1/2 -z-10 -translate-y-1/2 transform-gpu blur-2xl "
        aria-hidden="true"
      >
        <div
          className="aspect-[577/310] w-[36.0625rem] bg-gradient-to-r from-[#ff80b5] to-[#9089fc] opacity-30 animate-rotation"
          style={{
            clipPath:
              "polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)"
          }}
        ></div>
      </div>

      <div
        className="absolute left-[max(45rem,calc(50%+8rem))] top-1/2 -z-10 -translate-y-1/2 transform-gpu blur-2xl"
        aria-hidden="true"
      >
        <div
          className="aspect-[577/310] w-[36.0625rem] bg-gradient-to-r from-[#ff80b5] to-[#9089fc] opacity-30 animate-rotation"
          style={{
            clipPath:
              "polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)"
          }}
        ></div>
      </div>
      <div className="grid grid-cols-5 grid-rows-1 w-full h-full">
        <div className="flex justify-start">
          <SidebarMobile />
        </div>
        <div className="flex items-center justify-center md:gap-x-4 md:gap-y-2 w-full h-full col-start-2 col-end-5">
          <p className="hidden md:block text-sm leading-6 text-muted-foreground">
            <strong className="font-semibold">First Release!</strong>
            <svg
              viewBox="0 0 2 2"
              className="mx-2 inline h-0.5 w-0.5 fill-current"
              aria-hidden="true"
            >
              <circle cx="1" cy="1" r="1" />
            </svg>
            <span>Try out the new video experience</span>
          </p>
          <Button size="sm" variant="secondary">
            Feedback
            <ArrowRightIcon className="w-4 h-4 ml-1" />
          </Button>
        </div>
        <div className="flex justify-end col-start-5">
          <ModeToggle />
        </div>
      </div>
    </header>
  );
};
