'use client';

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TournamentNavFeedItem from "./tourament-nav-feed-item";
import { TeamDocument } from "../../../../../prismicio-types";

interface Match {
  id: string;
  homeTeam: TeamDocument | null;
  awayTeam: TeamDocument | null;
  home: {
    score: number | null;
  };
  away: {
    score: number | null;
  };
  status: string;
}

interface TournamentNavFeedProps {
  matches: Match[];
  cycleInterval?: number;
}

export default function TournamentNavFeed({ 
  matches, 
  cycleInterval = 3000 
}: TournamentNavFeedProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (matches.length <= 1 || isHovered) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % matches.length);
    }, cycleInterval);

    return () => clearInterval(interval);
  }, [matches.length, cycleInterval, isHovered]);

  if (matches.length === 0) return null;

  const currentMatch = matches[currentIndex];

  return (
    <div 
      className="relative h-24 overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentMatch.id}
          initial={{ y: 5, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -5, opacity: 0 }}
          transition={{ 
            duration: 0.2,
            ease: "easeInOut"
          }}
          className="absolute inset-0"
        >
          <TournamentNavFeedItem
            team1={currentMatch.homeTeam}
            team1Score={currentMatch.home.score}
            team2={currentMatch.awayTeam}
            team2Score={currentMatch.away.score}
            status={currentMatch.status}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

