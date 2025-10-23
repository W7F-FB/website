"use client"

import React from "react";
import { useReactPlayer } from "@/hooks/use-react-player";
import { PlayIcon } from "@phosphor-icons/react/dist/ssr";
import { VideoModal } from "@/components/blocks/video-banner/video-modal"
import Image from "next/image";


interface VideoBannerProps {
    thumbnail: string;
    videoUrl: string;
    label?: string;
}

export const VideoBanner: React.FC<VideoBannerProps> = ({
    thumbnail,
    videoUrl,
    label,
}) => {
    const { isOpen, openPlayer, closePlayer } = useReactPlayer();

    return (
        <div className="relative overflow-hidden flex items-center justify-center h-[30rem] cursor-pointer group" aria-label="Play video" onClick={openPlayer}>
            <div className="h-full w-full flex items-center absolute">
                <Image
                    src={thumbnail}
                    alt="Recap thumbnail"
                    fill
                    className="w-full h-full object-cover object-top"
                />
            </div>

            <div className="absolute top-4 left-4 z-10">
                <span className="bg-primary text-primary-foreground font-headers font-semibold uppercase py-1 px-2">
                    {label}
                </span>
            </div>

            <div className="z-10 h-[4rem] w-[4rem] bg-muted/90 flex items-center justify-center rounded-[0.1rem]">
                <PlayIcon size={20}/>
            </div>

            <div className="absolute inset-0 w-full h-full bg-black/60 transition-all ease-linear group-hover:bg-black/45"></div>

            {isOpen && <VideoModal videoUrl={videoUrl} onClose={closePlayer} />}
        </div>

    )
}