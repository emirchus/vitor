"use client";

import { useVideosUploadStore } from "@/store/videos-upload.store";
import React from "react";

interface Props {
  children: React.ReactNode;
}

export const DragVideoZone = ({ children }: Props) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const { setVideos, setModal } = useVideosUploadStore();

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const droppedFiles = event.dataTransfer.files;
    if (droppedFiles.length > 0) {
      const newFiles = Array.from(droppedFiles).filter(file => file.type.includes("video"));
      setVideos(newFiles);
      setModal(true);
    }
  };

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files).filter(file => file.type.includes("video"));
      setVideos(newFiles);
      setModal(true);
      inputRef.current!.value = "";
    }
  };

  return (
    <div className="flex rounded-lg border border-dashed shadow-sm relative h-full">
      <div
        className="w-full h-full absolute top-0 left-0 cursor-pointer z-10"
        onClick={() => {
          inputRef.current?.click();
        }}
        onDrop={handleDrop}
        onDragOver={event => event.preventDefault()}
      />
      <input
        type="file"
        ref={inputRef}
        hidden
        multiple
        onChange={onInputChange}
        accept="video/mp4,video/x-m4v,video/*"
      />
      {children}
    </div>
  );
};
