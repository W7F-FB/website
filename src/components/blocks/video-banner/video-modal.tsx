"use client";

import React, { useCallback, useEffect, useState } from "react";
import { XIcon } from "@phosphor-icons/react/dist/ssr";
import ReactPlayer from "react-player";

interface VideoModalProps {
  videoUrl: string;
  onClose: () => void;
  aspectRatio?: string;
}

export const VideoModal: React.FC<VideoModalProps> = ({ videoUrl, onClose, aspectRatio = "aspect-video" }) => {
  const [visible, setVisible] = useState(false);

  const handleClose = useCallback(() => {
    setVisible(false);
    setTimeout(onClose, 300);
  }, [onClose]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";
    setVisible(true);
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [handleClose]);

  if (!videoUrl) return null;

  return (
    <div
      className={`fixed inset-0 z-50 cursor-default flex items-center justify-center transition-opacity duration-300 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="absolute inset-0 bg-black/70" onClick={handleClose}></div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          handleClose();
        }}
        className="fixed top-0 right-0 h-16 w-16 flex items-center justify-center bg-muted z-[60] cursor-pointer"
        aria-label="Close video"
      >
        <XIcon className="size-5" />
      </button>

      <div className={`relative video-player max-h-[70vh] ${aspectRatio} overflow-hidden`}>
        <ReactPlayer src={videoUrl} playing controls width="100%" height="100%" />
      </div>
    </div>
  );
};
