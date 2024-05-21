"use client";

import { useDeleteProject, useProjects, useProjectsCount } from "@/hooks/use-projects";
import React, { useState } from "react";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { CalendarIcon, DotsHorizontalIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { FilmIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { MotionCard } from "@/components/motion-card";
import { AnimatePresence, motion } from "framer-motion";
import { Loading } from "@/components/loading";
import { MotionImage } from "@/components/motion-image";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { Project } from "@/interfaces/project";

interface Props {
  search: string;
  page: number;
}

const VideosList = ({ page, search: defaultSearch }: Props) => {
  const [search, setSearch] = useState(defaultSearch);
  const projects = useProjects(defaultSearch, page);
  const count = useProjectsCount(defaultSearch);
  const router = useRouter();

  const totalPages = Math.ceil(count / 8);

  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Your videos</h1>{" "}
      </div>
      <form
        onSubmit={e => {
          e.preventDefault();
          const url = `/?${search.trim().length === 0 ? "" : `search=${search.trim()}&`}page=1`;
          router.push(url, {
            scroll: false
          });
        }}
        className="flex items-center justify-start"
      >
        <Input placeholder="Search videos" className="w-full lg:w-1/2 mr-2" name="Search" value={search} onChange={e => setSearch(e.target.value)} />
        <Button size={"icon"} type="submit">
          <MagnifyingGlassIcon className="w-4 h-4" />
        </Button>
      </form>
      <TooltipProvider>
        <div className="grid auto-rows-min p-2 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 w-full h-full">
          <AnimatePresence>{projects?.map((project, index) => <ProjectCard index={index} project={project} key={project.id} />)}</AnimatePresence>
        </div>
      </TooltipProvider>

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                className={cn({
                  "opacity-30 pointer-events-none": page == 1
                })}
                shallow
                href={`/?search=${search.trim()}${page > 1 ? `&page=${page - 1}` : ""}`}
              />
            </PaginationItem>
            {Array.from({ length: totalPages > 2 ? Math.ceil(totalPages / 2) : 2 }).map((_, i) => {
              const pageNumber = totalPages > 2 ? (page > 2 ? page - 2 + i : i + 1) : i + 1;
              if (pageNumber > totalPages) return null;
              return (
                <PaginationItem key={i}>
                  <PaginationLink href={`/?search=${search.trim()}&page=${pageNumber}`} shallow isActive={pageNumber == page}>
                    {pageNumber}
                  </PaginationLink>
                </PaginationItem>
              );
            })}
            {page + 2 <= totalPages && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
            <PaginationItem>
              <PaginationNext
                className={cn({
                  "opacity-20 pointer-events-none": page >= Math.ceil((count || 0) / 8)
                })}
                shallow
                href={`/?search=${search.trim()}${page < Math.ceil(count / 8) ? `&page=${page + 1}` : ""}`}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </>
  );
};

const ProjectCard = ({ project, index }: { project: Project; index: number }) => {
  const deleteProject = useDeleteProject();

  const [isDeleting, setIsDeleting] = React.useState(false);

  return (
    <MotionCard
      animate={{
        opacity: 1,
        scale: 1
      }}
      initial={{
        opacity: 0,
        scale: 0.5
      }}
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 30,
        delay: 0.1 * index
      }}
      className="relative overflow-hidden"
    >
      <div className="absolute left-0 top-1/2 z-0 transform-gpu blur-2xl" aria-hidden="true">
        <div
          className="aspect-[577/310] w-[36.0625rem] bg-gradient-to-r from-[#ff80b5] to-[#9089fc] opacity-20 dark:opacity-10"
          style={{
            clipPath:
              "polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)"
          }}
        ></div>
      </div>

      <div className="absolute left-0 -top-[50%] z-0  transform-gpu blur-2xl" aria-hidden="true">
        <div
          className="aspect-[577/310] w-[36.0625rem] bg-gradient-to-r from-[#ff80b5] to-[#9089fc] opacity-20 dark:opacity-10"
          style={{
            clipPath:
              "polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)"
          }}
        ></div>
      </div>

      <CardHeader className="grid grid-cols-1 items-start mb-0 pb-0 space-y-0 relative z-10">
        <div className="space-y-2">
          <AspectRatio ratio={16 / 9} className="rounded overflow-hidden shadow-md">
            <AnimatePresence>
              {project.thumbnail ? (
                <MotionImage
                  animate={{
                    opacity: 1
                  }}
                  initial={{
                    opacity: 0
                  }}
                  src={project.thumbnail}
                  alt="Project thumbnail"
                  width={1280}
                  height={720}
                />
              ) : (
                <motion.div
                  animate={{
                    opacity: 1
                  }}
                  initial={{
                    opacity: 0
                  }}
                  exit={{
                    opacity: 0
                  }}
                  className="bg-muted w-full h-full"
                >
                  <Loading />
                </motion.div>
              )}
            </AnimatePresence>
          </AspectRatio>
          <div className="flex flex-row items-center justify-between">
            <Tooltip>
              <TooltipTrigger asChild>
                <CardTitle className="whitespace-nowrap overflow-clip text-ellipsis h-full">{project.name}</CardTitle>
              </TooltipTrigger>
              <TooltipContent side="bottom" align="start" className="max-w-[250px] h-auto">
                <p
                  className="text-wrap"
                  style={{
                    overflowWrap: "break-word"
                  }}
                >
                  {project.name}
                </p>
              </TooltipContent>
            </Tooltip>
            <div className="col-start-4 items-center flex justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="data-[state=open]:bg-muted ">
                    <DotsHorizontalIcon className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-[160px]">
                  <DropdownMenuItem asChild>
                    <Link className="cursor-pointer" href={`/editor/${project.id}`}>
                      Open
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>Edit</DropdownMenuItem>
                  <DropdownMenuItem>Make a copy</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={async () => {
                      setIsDeleting(true);
                      await deleteProject(project.id!);
                      setIsDeleting(false);
                    }}
                    disabled={isDeleting}
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </CardHeader>
      <Separator className="my-2" />
      <CardContent className="relative z-10">
        <div className="flex space-x-4 text-sm text-muted-foreground">
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center">
                <CalendarIcon className="mr-1 h-3 w-3" />
                {project.createdAt.toLocaleDateString()}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <div>
                Created: {project.createdAt.toLocaleDateString()} - {project.createdAt.toLocaleTimeString()}
              </div>
            </TooltipContent>
          </Tooltip>

          {project.updatedAt && (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center">
                  <CalendarIcon className="mr-1 h-3 w-3" />
                  {project.updatedAt.toLocaleDateString()}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <div>
                  Updated at: {project.updatedAt.toLocaleDateString()} - {project.updatedAt.toLocaleTimeString()}
                </div>
              </TooltipContent>
            </Tooltip>
          )}
          <div className="flex items-center">
            <FilmIcon className="mr-1 h-3 w-3" />
            {project.videos.length}
          </div>
        </div>
      </CardContent>
    </MotionCard>
  );
};

export default VideosList;
