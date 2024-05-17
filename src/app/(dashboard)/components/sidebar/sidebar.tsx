"use client";

import React from "react";
import Link from "next/link";
import { FilmIcon, Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AnimatePresence, Variants, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useToggle } from "@/hooks/use-toggle";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AppRoutes } from "@/lib/routes";
import { ExternalLinkIcon } from "@radix-ui/react-icons";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export const Sidebar = () => {
  const [isOpen, toggle] = useToggle(true);
  const path = usePathname();

  const showAnimation: Variants = {
    hidden: {
      opacity: 0,
      width: 0,
      transition: {
        duration: 0.05
      }
    },
    show: {
      opacity: 1,
      width: "100%",
      transition: {
        duration: 0.1
      }
    }
  };
  return (
    <aside className="h-full hidden z-20 md:block border-r border-border bg-muted/40 relative rounded-br-sm">
      <a
        onClick={toggle}
        className="absolute z-10 top-1/2 -right-7 w-8 h-8 group flex flex-col items-center justify-center cursor-pointer opacity-50 hover:opacity-100 transition-opacity duration-300 ease-in-out"
      >
        <div
          className={cn(
            "transition-transform duration-300 ease-in-out rounded-full w-1 h-3 bg-muted-foreground translate-y-[0.15rem]",
            {
              "group-hover:-rotate-[15deg]": !isOpen,
              "group-hover:rotate-[15deg]": isOpen
            }
          )}
        />
        <div
          className={cn(
            "transition-transform duration-300 ease-in-out rounded-full w-1 h-3 bg-muted-foreground -translate-y-[0.15rem]",
            {
              "group-hover:rotate-[15deg]": !isOpen,
              "group-hover:-rotate-[15deg]": isOpen
            }
          )}
        />
      </a>
      <motion.div
        animate={{
          width: isOpen ? "200px" : "60px",
          transition: {
            duration: 0.3,
            type: "tween"
          }
        }}
        className={cn("flex h-screen flex-col relative overflow-hidden", {
          "w-[60px]": !isOpen,
          "w-[200px]": isOpen
        })}
      >
        <div className="flex justify-center items-center border-b p-2 min-w-[60px] min-h-[60px] mb-2 relative">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <FilmIcon className="h-6 w-6" />
            <AnimatePresence>
              {isOpen && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  className="text-lg"
                >
                  Vitor
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
        </div>
        <div className="flex-1">
          <TooltipProvider>
            <nav className="grid grid-rows-3 grid-cols-1 gap-2 items-start px-2 text-sm font-medium overflow-hidden w-full">
              {AppRoutes.map(route => (
                <div key={route.label} className="w-full h-full">
                  <Tooltip open={isOpen === true ? false : undefined}>
                    <TooltipTrigger asChild>
                      <Link
                        href={route.path}
                        className={cn(
                          "border cursor-pointer flex items-center h-[40px] px-3 py-4 hover:bg-primary/10 rounded-md justify-start transition-all ease-in-out duration-200 hover:text-foreground hover:border-primary/10 hover:border",
                          {
                            "text-foreground/50": !path.startsWith(route.path),
                            "border-transparent": isOpen,
                            "text-primary/80 bg-primary/5 hover:text-primary border-primary/10  border":
                              path.startsWith(route.path)
                          }
                        )}
                      >
                        <span
                          className={cn({
                            "mr-2": isOpen
                          })}
                        >
                          {route.icon}
                        </span>
                        <motion.span
                          variants={showAnimation}
                          initial="hidden"
                          animate={isOpen ? "show" : "hidden"}
                          exit="hidden"
                          className="flex flex-row justify-between items-center whitespace-nowrap"
                        >
                          {route.label}
                        </motion.span>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right">{route.label}</TooltipContent>
                  </Tooltip>
                </div>
              ))}
            </nav>
          </TooltipProvider>
        </div>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="mt-auto p-4 w-[200px]"
            >
              <Card>
                <CardHeader className="p-2 pt-0 md:p-4">
                  <CardTitle>Support Us!</CardTitle>
                  <CardDescription>
                    Support the development of this project by donating to our team.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-2 pt-0 md:p-4 md:pt-0">
                  <Button size="sm" className="w-full">
                    Support <ExternalLinkIcon className="ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </aside>
  );
};

export const SidebarMobile = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="shrink-0 md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex flex-col">
        <nav className="grid gap-2 text-lg font-medium">
          <Link href="#" className="flex items-center gap-2 text-lg font-semibold">
            <FilmIcon className="h-6 w-6" />
            <span className="sr-only">Vitor</span>
          </Link>
          {AppRoutes.map(route => (
            <Link
              key={route.path}
              href={route.path}
              className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
            >
              {route.icon}
              <span>{route.label}</span>
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
};
