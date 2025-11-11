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
  competitionId?: string;
  seasonId?: string;
  cycleInterval?: number;
}

export default function TournamentNavFeed({ 
  competitionId = "1303",
  seasonId = "2025",
  cycleInterval = 4000 
}: TournamentNavFeedProps) {
  const [matches, setMatches] = useState<Match[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchMatches() {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/opta/f1-fixtures-feed?competitionId=${competitionId}&seasonId=${seasonId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch matches');
        }

        const enrichedMatches = await response.json();
        const filteredMatches = enrichedMatches.filter((match: Match) => match.homeTeam && match.awayTeam);
        setMatches(filteredMatches);
      } catch (error) {
        console.error('Error fetching tournament matches:', error);
        setMatches([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchMatches();
  }, [competitionId, seasonId]);

  useEffect(() => {
    if (matches.length <= 1 || isHovered) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % matches.length);
    }, cycleInterval);

    return () => clearInterval(interval);
  }, [matches.length, cycleInterval, isHovered]);

  if (isLoading || matches.length === 0) return null;

  const currentMatch = matches[currentIndex];

  return (
    <div 
      className="relative h-10 overflow-hidden bg-muted/20"
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
          className="flex items-center justify-center absolute inset-0"
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

