'use client'

import { useState, useEffect, useMemo } from 'react'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from '@/components/ui/carousel'
import { CaretRightIcon } from '@/components/website-base/icons'
import { cn } from '@/lib/utils'
import type { GameCard } from '@/types/components'
import { MatchCard as GameCardComponent } from '@/components/blocks/match/match-card'
import { normalizeOptaId } from '@/lib/opta/utils'
import { GamesSliderFilter } from './games-slider-filter'
import type { TournamentDocument } from '../../../../../prismicio-types'
import { LinePattern } from '../../line-pattern'

interface GamesSliderProps {
  gameCards?: GameCard[]
  tournament: TournamentDocument
  isLoading?: boolean
}

function getCardDate(card: GameCard): string {
  if ('fixture' in card) {
    return card.fixture.MatchInfo.Date.split(' ')[0]
  } else {
    const date = new Date(card.prismicMatch.data.start_time || new Date())
    return date.toISOString().split('T')[0]
  }
}

function getCardId(card: GameCard): string {
  if ('fixture' in card) {
    return normalizeOptaId(card.fixture.uID) || ''
  } else {
    return card.prismicMatch.uid
  }
}

export function GamesSlider({ gameCards = [], tournament, isLoading = false }: GamesSliderProps) {
  const [api, setApi] = useState<CarouselApi | null>(null)
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)

  const uniqueDates = useMemo(() => {
    const dates = gameCards.map(card => getCardDate(card))
    return Array.from(new Set(dates)).sort()
  }, [gameCards])

  const defaultDate = useMemo(() => {
    if (uniqueDates.length === 0) return undefined
    
    const now = new Date()
    const todayString = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()))
      .toISOString().split('T')[0]
    
    return uniqueDates.includes(todayString) ? todayString : uniqueDates[0]
  }, [uniqueDates])

  const [selectedDate, setSelectedDate] = useState<string | undefined>(defaultDate)

  useEffect(() => {
    setSelectedDate(defaultDate)
  }, [defaultDate])

  const filteredGameCards = useMemo(() => {
    if (!selectedDate) return gameCards
    
    return gameCards.filter(card => {
      const cardDate = getCardDate(card)
      return cardDate === selectedDate
    })
  }, [gameCards, selectedDate])

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

  return (
    <div className='overflow-hidden relative'>
      <div className='relative grid grid-cols-[auto_1fr] border-t border-border/50'>
        <div className='relative px-6 py-2 flex items-center justify-center'>
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
                    {/* Skeleton component goes here */}
                  </CarouselItem>
                ))
              ) : filteredGameCards.length > 0 ? (
                filteredGameCards.map((gameCard, index) => (
                  <CarouselItem key={getCardId(gameCard) || index} className='lg:basis-1/6 md:basis-1/4 basis-full pl-0'>
                    <div className='border-r border-border/50'>
                      <GameCardComponent variant="mini" {...gameCard} />
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
    </div>
  )
}