"use client";

import { PrismicNextImage } from "@prismicio/next";
import ReactCountryFlag from "react-country-flag";
import type { TeamDocument } from "../../../../prismicio-types";
import { Card } from "@/components/ui/card";
import { GradientBg } from "@/components/ui/gradient-bg";
import { H1, P } from "@/components/website-base/typography";
import { getCountryIsoCode } from "@/lib/utils";

interface HeroTeamProps {
  team: TeamDocument;
  homeTeamColor?: string;
}

export function HeroTeam({ team, homeTeamColor }: HeroTeamProps) {
  return (
    <Card className="p-0 gap-0 border-border/50 overflow-hidden">
      <div className="px-4 md:px-12 py-6 md:py-8 relative overflow-hidden">
        <GradientBg
          className="absolute inset-0 bottom-0 right-0 rotate-y-180"
          overlayColor="oklch(0.1949 0.0274 260.031)"
          accentColor={homeTeamColor || "#0c224a"}
          shadowColor="oklch(0.1949 0.0274 260.031)"
          accentOpacity={1}
        />
        <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-start md:items-center relative z-10">
          <div className="shrink-0 w-16 h-16 md:w-[100px] md:h-[100px]">
            <PrismicNextImage field={team.data.logo} width={100} height={100} className="w-full h-full object-contain" />
          </div>

          <div className="min-w-0 flex-1 flex items-center justify-between">
            <div>
              <H1 className="text-2xl md:text-4xl">{team.data.name}</H1>
              <div className="flex flex-wrap items-center gap-2 md:gap-4 mt-2">
                <div className="flex items-center gap-2">
                  <P noSpace className="text-sm md:text-base font-headers font-medium">{team.data.country}</P>
                  <CountryFlag country={team.data.country || ""} />
                </div>
              </div>
            </div>
          </div>
        </div>
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
