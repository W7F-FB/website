'use client'

import { useState, useEffect } from 'react'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from '@/components/ui/carousel'

interface GamesSliderProps {
  items?: Array<{ id?: string | number; title?: string; description?: string }>
  isLoading?: boolean
}

const DUMMY_ITEMS = [
  { id: 1, title: 'Item 1', description: 'Description for item 1' },
  { id: 2, title: 'Item 2', description: 'Description for item 2' },
  { id: 3, title: 'Item 3', description: 'Description for item 3' },
  { id: 4, title: 'Item 4', description: 'Description for item 4' },
  { id: 5, title: 'Item 5', description: 'Description for item 5' },
  { id: 6, title: 'Item 6', description: 'Description for item 6' },
]

export function GamesSlider({ items = DUMMY_ITEMS, isLoading = false }: GamesSliderProps) {
  const [api, setApi] = useState<CarouselApi | null>(null)
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)

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
      <div className='relative grid grid-cols-[auto,1fr] border-b border-border'>
        <div className='relative px-6 py-2 flex items-center justify-center'>
          {/* Filter/selector component goes here */}
        </div>
        <div className="w-full">
          <Carousel 
            className='grid grid-cols-[auto,1fr,auto] h-full' 
            opts={{ align: "start" }} 
            setApi={setApi}
          >
            <CarouselPrevious 
              className='w-6 h-full rounded-none border-r border-border border-l border-t-0 border-b-0 relative flex left-0 hover:bg-muted/25 disabled:text-muted-foreground/70' 
              disabled={isLoading || !canScrollPrev}
            />
            <CarouselContent className='-ml-[1px] -mr-[1px] h-full'>
              {isLoading ? (
                Array.from({ length: 6 }).map((_, index) => (
                  <CarouselItem key={`skeleton-${index}`} className='lg:basis-1/3 md:basis-1/2 basis-full pl-0'>
                    {/* Skeleton component goes here */}
                  </CarouselItem>
                ))
              ) : items.length > 0 ? (
                items.map((item, index) => (
                  <CarouselItem key={item.id || index} className='lg:basis-1/3 md:basis-1/2 basis-full pl-0'>
                    <div className='h-[6.875rem] border-r border-border p-4 flex flex-col justify-center'>
                      <h3 className='font-semibold'>{item.title}</h3>
                      <p className='text-sm text-muted-foreground'>{item.description}</p>
                    </div>
                  </CarouselItem>
                ))
              ) : (
                <div className='w-full h-[6.875rem] flex items-center justify-center text-sm text-muted-foreground'>
                  No items available
                </div>
              )}
            </CarouselContent>
            <CarouselNext 
              className='w-6 h-full rounded-none border-l border-border border-r-0 border-t-0 border-b-0 relative flex left-0 hover:bg-muted/25 disabled:text-muted-foreground/70' 
              disabled={isLoading || !canScrollNext}
            />
          </Carousel>
        </div>
      </div>
    </div>
  )
}