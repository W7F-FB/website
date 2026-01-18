"use client"

import React from "react";
import { useReactPlayer } from "@/hooks/use-react-player";
import { PlayIcon } from "@/components/website-base/icons";
import { VideoModal } from "@/components/blocks/video-banner/video-modal"
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";


interface VideoBannerProps {
    thumbnail: string;
    videoUrl: string;
    label?: string;
    className?: string;
    size?: "sm" | "lg";
    variant?: "emphasised";
}

export const VideoBanner: React.FC<VideoBannerProps> = ({
    thumbnail,
    videoUrl,
    label,
    className,
    size = "lg",
    variant,
}) => {
    const { isOpen, openPlayer, closePlayer } = useReactPlayer();

    if (!videoUrl) return null;

    return (
        <div className={cn("relative overflow-hidden flex items-center justify-center h-[30rem] cursor-pointer group", className)} aria-label="Play video" onClick={openPlayer}>
            <div className="h-full w-full flex items-center absolute">
                <Image
                    src={thumbnail}
                    alt="Recap thumbnail"
                    fill
                    className="w-full h-full object-cover object-top"
                />
            </div>

            {label && (
                <div className="absolute top-4 left-4 z-10">
                    <Badge fast variant={variant === "emphasised" ? "default" : "secondary"}>{label}</Badge>
                </div>
            )}

            <div className={cn("z-10 bg-background/10 backdrop-blur-sm group-hover:backdrop-blur-lg transition-all flex items-center justify-center border border-secondary/5", size === "sm" ? "w-14 h-14" : "w-20 h-20")}>
                <PlayIcon className={cn(size === "sm" ? "size-4" : "size-6")}/>
            </div>

            <div className="absolute inset-0 w-full h-full bg-black/60 transition-all ease-linear group-hover:bg-black/45"></div>

            {isOpen && <VideoModal videoUrl={videoUrl} onClose={closePlayer} />}
        </div>

    )
}