'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion } from 'motion/react'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from '@/components/ui/carousel'
import { CaretRightIcon } from '@/components/website-base/icons'
import { cn } from '@/lib/utils'
import { MatchCard } from '@/components/blocks/match/match-card'
import { normalizeOptaId, getStatusDisplay } from '@/lib/opta/utils'
import { GamesSliderFilter } from './games-slider-filter'
import { useGamesSliderCollapse } from './games-slider-collapse-context'
import type { TournamentDocument, TeamDocument } from '../../../../../prismicio-types'
import { LinePattern } from '../../line-pattern'
import { getEstTodayDateKey } from '@/app/(website)/(subpages)/tournament/utils'
import type { F1MatchData, F1TeamData } from '@/types/opta-feeds/f1-fixtures'
import type { F9MatchResponse } from '@/types/opta-feeds/f9-match'

interface GamesSliderProps {
  groupedFixtures: Map<string, F1MatchData[]>
  prismicTeams: TeamDocument[]
  optaTeams: F1TeamData[]
  tournament: TournamentDocument
  matchSlugMap?: Map<string, string>
  f9FeedsMap?: Map<string, F9MatchResponse>
  isLoading?: boolean
}

export function GamesSlider({ groupedFixtures, prismicTeams, optaTeams, tournament, matchSlugMap, f9FeedsMap, isLoading = false }: GamesSliderProps) {
  const [api, setApi] = useState<CarouselApi | null>(null)
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)
  const { isCollapsed } = useGamesSliderCollapse()

  const uniqueDates = useMemo(() => {
    return Array.from(groupedFixtures.keys()).sort()
  }, [groupedFixtures])

  const [selectedDate, setSelectedDate] = useState<string | undefined>(uniqueDates[0])

  useEffect(() => {
    if (uniqueDates.length === 0) return
    const todayString = getEstTodayDateKey()
    const newDate = uniqueDates.includes(todayString) ? todayString : uniqueDates[0]
    setSelectedDate(newDate)
  }, [uniqueDates])

  const filteredFixtures = useMemo(() => {
    if (!selectedDate) return Array.from(groupedFixtures.values()).flat()
    return groupedFixtures.get(selectedDate) || []
  }, [groupedFixtures, selectedDate])

  const liveMatchIndex = useMemo(() => {
    return filteredFixtures.findIndex(fixture => getStatusDisplay(fixture.MatchInfo) === "Live")
  }, [filteredFixtures])

  useEffect(() => {
    if (!api) return

    const onSelect = () => {
      setCanScrollPrev(api.canScrollPrev())
      setCanScrollNext(api.canScrollNext())
    }

    api.on("select", onSelect)
    api.on("reInit", onSelect)

    onSelect()

    return () => {
      api.off("select", onSelect)
      api.off("reInit", onSelect)
    }
  }, [api])

  useEffect(() => {
    if (!api || liveMatchIndex === -1) return
    api.scrollTo(liveMatchIndex)
  }, [api, liveMatchIndex])

  return (
    <motion.div 
      className='overflow-hidden relative'
      initial={false}
      animate={{ height: isCollapsed ? 0 : "auto" }}
      transition={{ type: "spring", stiffness: 700, damping: 50, mass: 0.5 }}
    >
      <div className='border-t border-border/50' />
      <div className='relative grid grid-cols-[auto_1fr]'>
        <div className='relative lg:px-6 px-3 py-2 flex items-center justify-center'>
          <GamesSliderFilter 
            dates={uniqueDates} 
            tournament={tournament}
            value={selectedDate}
            onValueChange={setSelectedDate}
          />
        </div>
        <div className="w-full">
          <Carousel 
            className='grid grid-cols-[auto_1fr_auto] h-full' 
            opts={{ align: "start" }} 
            setApi={setApi}
          >
            <CarouselPrevious 
              className='w-6 bg-muted/20  h-full rounded-none border-r border-border/50 border-l border-t-0 border-b-0 relative flex left-0 hover:bg-muted/25 disabled:text-muted-foreground/70' 
              disabled={isLoading || !canScrollPrev}
              icon={({ className }) => <CaretRightIcon className={cn(className, 'rotate-180')} />}
            />
            <CarouselContent className='-ml-[1px] -mr-[1px] h-full'>
              {isLoading ? (
                Array.from({ length: 6 }).map((_, index) => (
                  <CarouselItem key={`skeleton-${index}`} className='lg:basis-1/6 md:basis-1/4 basis-full pl-0'>
                  </CarouselItem>
                ))
              ) : filteredFixtures.length > 0 ? (
                filteredFixtures.map((fixture, index) => (
                  <CarouselItem key={normalizeOptaId(fixture.uID) || index} className='lg:basis-1/6 md:basis-1/4 basis-full pl-0'>
                    <div className='border-r border-border/50'>
                      <MatchCard 
                        variant="mini" 
                        fixture={fixture}
                        prismicTeams={prismicTeams}
                        optaTeams={optaTeams}
                        tournamentSlug={tournament.uid}
                        matchSlugMap={matchSlugMap}
                        f9Feed={f9FeedsMap?.get(normalizeOptaId(fixture.uID))}
                      />
                    </div>
                  </CarouselItem>
                ))
              ) : (
                <div className='w-full h-[83.59px] flex items-center justify-center text-sm text-muted-foreground'>
                  No items available
                </div>
              )}
              <div className='flex-grow relative overflow-hidden'>
                <LinePattern className='absolute top-0 left-0 w-[200vw] h-[100vh]' patternSize={5}/>
              </div>
            </CarouselContent>
            <CarouselNext 
              className='w-6 bg-muted/20 h-full rounded-none border-l border-border/50 border-r-0 border-t-0 border-b-0 relative flex left-0 hover:bg-muted/25 disabled:text-muted-foreground/70'
              disabled={isLoading || !canScrollNext}
              icon={({ className }) => <CaretRightIcon className={className} />}
            />
          </Carousel>
        </div>
      </div>
    </motion.div>
  )
}
