"use client";

import React, { useEffect, useState } from "react";
import { XIcon } from "@phosphor-icons/react/dist/ssr";
import ReactPlayer from "react-player";

interface VideoModalProps {
  videoUrl: string;
  onClose: () => void;
}

export const VideoModal: React.FC<VideoModalProps> = ({ videoUrl, onClose }) => {
  const [visible, setVisible] = useState(false);

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
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 300);
  };

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
        <XIcon size={20} />
      </button>

      <div className="relative w-full max-w-[60rem] min-h-[10rem] aspect-video overflow-hidden">
        <ReactPlayer src={videoUrl} playing controls width="100%" height="100%" />
      </div>
    </div>
  );
};
