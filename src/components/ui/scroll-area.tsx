"use client";

import * as React from "react";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";

import { cn } from "@/lib/utils";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";

const ScrollAreaWithMask = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>
>(({ className, children, ...props }, ref) => {
  const refContainer = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress, scrollY } = useScroll({ container: refContainer });
  const [scrollYProgressReverse, setScrollYProgressReverse] = React.useState(0);

  useMotionValueEvent(scrollYProgress, "change", latest => {
    setScrollYProgressReverse(1 - latest);
  });

  return (
    <ScrollAreaPrimitive.Root
      ref={ref}
      className={cn("relative overflow-hidden", className)}
      {...props}
    >
      <motion.div
        style={{
          opacity: scrollY.get() > 1 ? scrollYProgress : 0
        }}
        className="[mask-image:linear-gradient(to_bottom,white,transparent,transparent)] absolute w-full h-full pointer-events-none z-[1] bg-background"
      />
      <motion.div
        style={{ opacity: scrollYProgressReverse }}
        className="[mask-image:linear-gradient(to_top,white,transparent,transparent)] absolute w-full h-full pointer-events-none z-[1] bg-background"
      />
      <ScrollAreaPrimitive.Viewport
        ref={refContainer}
        className="h-full w-full rounded-[inherit] p-5"
      >
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollBar />
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  );
});
ScrollAreaWithMask.displayName = ScrollAreaPrimitive.Root.displayName;

const ScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root> & {
    direction?: "vertical" | "horizontal";
  }
>(({ className, direction = "vertical", children, ...props }, ref) => {
  return (
    <ScrollAreaPrimitive.Root
      ref={ref}
      className={cn("relative overflow-hidden", className)}
      {...props}
    >
      <ScrollAreaPrimitive.Viewport className="h-full w-full rounded-[inherit]">
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollBar orientation={direction}/>
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  );
});

ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName;

const ScrollBar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>
>(({ className, orientation = "vertical", ...props }, ref) => (
  <ScrollAreaPrimitive.ScrollAreaScrollbar
    ref={ref}
    orientation={orientation}
    className={cn(
      "flex touch-none select-none transition-colors z-10",
      orientation === "vertical" && "h-full w-2.5 border-l border-l-transparent p-[1px]",
      orientation === "horizontal" && "h-2.5 flex-col border-t border-t-transparent p-[1px]",
      className
    )}
    {...props}
  >
    <ScrollAreaPrimitive.ScrollAreaThumb className="relative flex-1 rounded-full bg-border" />
  </ScrollAreaPrimitive.ScrollAreaScrollbar>
));
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName;

export { ScrollAreaWithMask, ScrollArea, ScrollBar };
