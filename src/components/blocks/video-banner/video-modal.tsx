"use client";

import React, { useEffect } from "react";
import { XIcon } from "@phosphor-icons/react/dist/ssr";
import ReactPlayer from "react-player";

interface VideoModalProps {
    videoUrl: string;
    onClose: () => void;
}

export const VideoModal: React.FC<VideoModalProps> = ({ videoUrl, onClose }) => {
    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") onClose();
        };
        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, [onClose]);

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "unset";
        };
    }, []);

    if (!videoUrl) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">

            <div className="absolute inset-0 bg-black/70" onClick={onClose}></div>

            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onClose();
                }}
                className="fixed top-0 right-0 h-16 w-16 flex items-center justify-center bg-muted z-[60] cursor-pointer"
                aria-label="Close video"
            >
                <XIcon size={20} />
            </button>

            <div
                className="relative w-full max-w-5xl aspect-video overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <ReactPlayer
                    src={videoUrl}
                    playing
                    controls
                    width="100%"
                    height="100%"
                />
            </div>
        </div>
    );
};
