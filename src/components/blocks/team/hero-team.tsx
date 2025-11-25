"use client";

import { PrismicNextImage } from "@prismicio/next";
import Link from "next/link";
import ReactCountryFlag from "react-country-flag";
import type { TeamDocument } from "../../../../prismicio-types";
import type { F3StandingsResponse } from "@/types/opta-feeds/f3-standings";
import type { F1FixturesResponse } from "@/types/opta-feeds/f1-fixtures";
import { Card, CardHeader } from "@/components/ui/card";
import { FastDash } from "@/components/ui/fast-dash";
import { H1, P } from "@/components/website-base/typography";
import { getCountryIsoCode } from "@/lib/utils";
import { isFilled } from "@prismicio/client";
import { useState, useMemo } from "react";
import { StadiumIcon } from "@/components/website-base/icons";
import { getFinalMatch, getThirdPlaceMatch } from "@/app/(website)/(subpages)/tournament/utils";

interface NavLink {
  label: string;
  href: string;
}

const navLinks: NavLink[] = [
  { label: "Home", href: "#home" },
  { label: "Stats", href: "#stats" },
  { label: "Roster", href: "#roster" },
  { label: "Blog", href: "#blog" },
  { label: "Match Highlights", href: "#match-highlights" },
  { label: "More", href: "#more" },
];

interface HeroTeamProps {
  team: TeamDocument;
  homeTeamColor?: string;
  standings?: F3StandingsResponse | null;
  fixtures?: F1FixturesResponse | null;
}

export function HeroTeam({ team, homeTeamColor, standings, fixtures }: HeroTeamProps) {
  const [active, setActive] = useState("#home");

  const teamStanding = useMemo(() => {
    return standings?.SoccerFeed?.SoccerDocument?.Competition?.TeamStandings?.flatMap(
      (group) => group.TeamRecord || []
    ).find((record) => record.TeamRef === `t${team.data.opta_id}`);
  }, [standings, team.data.opta_id]);

  const placement = useMemo(() => {
    if (!team.data.opta_id) return null;
    
    const teamId = `t${team.data.opta_id}`;
    const allMatches = fixtures?.SoccerFeed?.SoccerDocument?.MatchData;
    
    const finalMatches = getFinalMatch(allMatches);
    const thirdPlaceMatches = getThirdPlaceMatch(allMatches);
    
    const finalMatch = finalMatches[0];
    const thirdPlaceMatch = thirdPlaceMatches[0];
    
    if (finalMatch) {
      if (finalMatch.MatchInfo?.MatchWinner === teamId) return '1st';
      if (finalMatch.TeamData?.[0]?.TeamRef === teamId || finalMatch.TeamData?.[1]?.TeamRef === teamId) return '2nd';
    }
    
    if (thirdPlaceMatch) {
      if (thirdPlaceMatch.MatchInfo?.MatchWinner === teamId) return '3rd';
      if (thirdPlaceMatch.TeamData?.[0]?.TeamRef === teamId || thirdPlaceMatch.TeamData?.[1]?.TeamRef === teamId) return '4th';
    }
    
    return 'E';
  }, [team.data.opta_id, fixtures]);

  const record = useMemo(() => {
    const wins = teamStanding?.Standing.Won || 0;
    const losses = teamStanding?.Standing.Lost || 0;
    const draws = teamStanding?.Standing.Drawn || 0;
    return draws > 0 ? `${wins}-${losses}-${draws}` : `${wins}-${losses}`;
  }, [teamStanding]);

  const tournaments = useMemo(() => {
    return (
      team.data.tournaments
        ?.filter((item) => isFilled.contentRelationship(item.tournament))
        .map((item) => {
          if (!isFilled.contentRelationship(item.tournament)) return null;
          return {
            uid: item.tournament.uid || "",
            title: item.tournament.data?.title || "Untitled Tournament",
            year: item.tournament.data?.start_date
              ? new Date(item.tournament.data.start_date).getFullYear()
              : null,
          };
        })
        .filter((t): t is NonNullable<typeof t> => t !== null) || []
    );
  }, [team.data.tournaments]);

  return (
    <Card className="p-0 gap-0 bg-card/50 border-border/50 overflow-hidden">
      <CardHeader className="px-6 py-3 !pb-3 flex items-center justify-between bg-muted/30 border-b text-sm text-muted-foreground/75">
        <div className="font-headers flex items-center gap-2">
          <StadiumIcon size={16} />
          {tournaments && tournaments[0].title}
        </div>
        <div className="flex items-center gap-2 font-headers font-medium uppercase">
          {placement && placement !== 'E' && `${placement} Place`}
          {placement === 'E' && 'Eliminated'}
        </div>
      </CardHeader>
      <div className="px-12 py-8 border-b border-border/20 relative overflow-hidden">
        <div
          className="absolute top-0 -left-10 w-[500px] -skew-x-btn h-full pointer-events-none opacity-30"
          style={
            homeTeamColor
              ? { backgroundImage: `linear-gradient(to right, ${homeTeamColor}, transparent)` }
              : undefined
          }
        />
        <div className="flex gap-8 items-center relative z-10">
          <div>
            <PrismicNextImage field={team.data.logo} width={100} height={100} />
          </div>

          <div>
            <H1>{team.data.name}</H1>

            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-2">
                <P noSpace>{team.data.country}</P>
                <CountryFlag country={team.data.country || ""} />
              </div>
              <FastDash />
              <P noSpace>{record}</P>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-6 pt-3 px-12">
        {navLinks.map((link) => {
          const isActive = active === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setActive(link.href)}
              className={`
                pb-3 text-sm font-medium transition-colors border-b-2 
                ${isActive
                  ? "text-foreground border-foreground"
                  : "text-muted-foreground border-transparent hover:text-foreground hover:border-foreground"
                }
              `}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
    </Card>
  );
}

interface CountryFlagProps {
  country: string;
}

function CountryFlag({ country }: CountryFlagProps) {
  const countryIso = getCountryIsoCode(country);

  if (!countryIso) return null;

  return (
    <ReactCountryFlag countryCode={countryIso} svg className="!w-5 !h-5 rounded" />
  );
}
