'use client';

import { LinePattern } from "@/components/blocks/line-pattern";
import { W7FVerticalIcon, W7FVerticalIconMask } from "@/components/website-base/logo-svgs";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { getSocialBlogsByCategory } from "@/cms/queries/blog";
import type { BlogDocument } from "../../../prismicio-types";
import { PrismicNextImage } from "@prismicio/next";
import { isFilled } from "@prismicio/client";
import Image from "next/image";

interface ImageItem {
    url: string;
    altText: string;
}

interface W7FLineBannerProps {
    className?: string;
    images?: ImageItem[];
}

function ImageSequence({ isHovered, images }: { isHovered: boolean; images?: ImageItem[] }) {
    const [blogs, setBlogs] = useState<BlogDocument[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (!images) {
            getSocialBlogsByCategory("Match Recap").then(setBlogs);
        }
    }, [images]);

    const imageCount = images ? images.length : blogs.length;

    useEffect(() => {
        if (!isHovered || imageCount === 0) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % imageCount);
        }, 500);

        return () => clearInterval(interval);
    }, [isHovered, imageCount]);

    if (imageCount === 0) return null;

    return (
        <AnimatePresence>
            {isHovered && (
                <motion.div
                    className="absolute inset-0 w-full h-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {images ? (
                        <div className="relative w-full h-full">
                            <Image
                                src={images[currentIndex]?.url ?? ""}
                                alt={images[currentIndex]?.altText ?? ""}
                                fill
                                className="object-cover"
                            />
                        </div>
                    ) : (() => {
                        const image = blogs[currentIndex]?.data.image;
                        if (!image || !isFilled.image(image)) return null;
                        
                        const imageField = image.alt
                            ? image
                            : ({ ...image, alt: blogs[currentIndex]?.data.title ?? "" } as typeof image);
                        
                        return (
                            <PrismicNextImage
                                field={imageField}
                                className="w-full h-full object-cover"
                            />
                        );
                    })()}
                </motion.div>
            )}
        </AnimatePresence>
    );
}

const LINE_COLOR = 'oklch(0.1949 0.0274 260.031)';
const HOVER_LINE_COLOR = 'oklch(0.985 0 0)';

export function W7FLineBanner({ className, images }: W7FLineBannerProps) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <LinePattern
            fill={LINE_COLOR}
            className={cn('relative', className)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <ImageSequence isHovered={isHovered} images={images} />
            <W7FVerticalIcon
                strokeWidth={2}
                stroke={isHovered ? HOVER_LINE_COLOR : LINE_COLOR}
                className={cn("w-full h-full text-background relative transition-[stroke,color]", isHovered && "text-foreground/20 transition-[stroke,color]")}
            />
            <div className="absolute inset-0 w-full h-full p-12 ">
                <W7FVerticalIconMask className="w-full h-full">
                    <div className="w-full h-full flex items-center justify-center">
                        <div className="absolute inset-0 w-full h-full"></div>
                        <motion.div
                            className="absolute w-[300%] h-[175%] bg-gradient-to-b from-transparent via-foreground/10"
                            animate={{
                                y: ["-15%", "15%"],
                                rotate: 360
                            }}
                            transition={{
                                y: {
                                    duration: 7,
                                    repeat: Infinity,
                                    repeatType: "reverse",
                                    repeatDelay: 0,
                                    ease: "easeInOut"
                                },
                                rotate: {
                                    duration: 13.5,
                                    repeat: Infinity,
                                    ease: "linear"
                                }
                            }}
                        />
                    </div>
                </W7FVerticalIconMask>
            </div>
        </LinePattern>
    );
}

