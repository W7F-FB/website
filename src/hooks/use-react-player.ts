"use client"

import { useState } from "react";

export const useReactPlayer = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);

    const openPlayer = () => {
        setIsOpen(true);
        setIsPlaying(true);
    }

    const closePlayer = () => {
        setIsOpen(false);
        setIsPlaying(false);
    };

    return {
        isOpen,
        isPlaying,
        openPlayer,
        closePlayer,
    };
};