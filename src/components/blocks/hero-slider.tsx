"use client"

import * as React from "react"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  type CarouselApi
} from "@/components/ui/carousel"
import { cn } from "@/lib/utils"

import { Progress } from "../ui/progress"

type HeroSliderProps = React.ComponentProps<typeof Carousel> & {
  autoplay?: boolean
  autoplayDelay?: number
}

function HeroSlider({ className, children, autoplay = false, autoplayDelay = 5000, ...props }: HeroSliderProps) {
  const [api, setApi] = React.useState<CarouselApi>()
  const [progress, setProgress] = React.useState(0)
  const [isPaused, setIsPaused] = React.useState(false)
  const [pausedProgress, setPausedProgress] = React.useState(0)
  const [currentSlide, setCurrentSlide] = React.useState(0)
  const [slideCount, setSlideCount] = React.useState(0)
  const intervalRef = React.useRef<NodeJS.Timeout | null>(null)
  const progressIntervalRef = React.useRef<NodeJS.Timeout | null>(null)

  const startAutoplay = React.useCallback((startFromProgress = 0) => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current)
      progressIntervalRef.current = null
    }

    const progressStep = 100 / (autoplayDelay / 50)
    let currentProgress = startFromProgress

    progressIntervalRef.current = setInterval(() => {
      if (isPaused) return

      currentProgress += progressStep
      setProgress(currentProgress)

      if (currentProgress >= 100) {
        currentProgress = 0
        setProgress(0)
        api?.scrollNext()
      }
    }, 50)
  }, [api, autoplayDelay, isPaused])

  React.useEffect(() => {
    if (!api) return

    // Set initial values
    setSlideCount(api.scrollSnapList().length)
    setCurrentSlide(api.selectedScrollSnap())

    api.on("select", () => {
      setCurrentSlide(api.selectedScrollSnap())
      setProgress(0)
      setPausedProgress(0)
      if (autoplay && !isPaused) {
        startAutoplay(0)
      }
    })
  }, [api, autoplay, isPaused, startAutoplay])

  React.useEffect(() => {
    if (!api || !autoplay) return

    if (isPaused) {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
        progressIntervalRef.current = null
      }
      return
    }

    startAutoplay(pausedProgress)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
        progressIntervalRef.current = null
      }
    }
  }, [api, autoplay, startAutoplay, isPaused, pausedProgress])

  const handleMouseEnter = () => {
    if (!autoplay) return
    setPausedProgress(progress)
    setIsPaused(true)
  }

  const handleMouseLeave = () => {
    if (!autoplay) return
    setIsPaused(false)
  }


  return (
    <Carousel
      className={cn("w-full relative", className)}
      opts={{
        watchDrag: false,
        loop: true,
        ...props.opts
      }}
      setApi={setApi}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      <CarouselContent className="!gap-0 !m-0">
        {children}
      </CarouselContent>
      <div className="absolute bottom-0 right-0 mb-2 mr-2 z-[20]">
        <div className="flex">
          <HeroSliderPrevious className="-mr-[0.5px] z-1 hover:z-2" />
          <HeroSliderNext className="-ml-[0.5px] z-1 hover:z-2" />
        </div>
        <div className="w-full relative border-l border-r border-b dark:border-input backdrop-blur-sm bg-background/40">
          <Progress
            className="h-1.5 rounded-none !bg-transparent"
            value={autoplay ? ((currentSlide * 100) + progress) / slideCount : ((currentSlide + 1) * 100) / slideCount}
          />
          {/* Dividers */}
          {Array.from({ length: slideCount - 1 }, (_, index) => (
            <div
              key={index}
              className="absolute top-0 bottom-0 w-px bg-background/40 z-[20] border-r dark:border-input"
              style={{ left: `calc(${((index + 1) / slideCount) * 100}% - 0.5px)` }}
            >
              <div className="w-full h-full border-r dark:border-input " />
            </div>
          ))}
        </div>
      </div>
    </Carousel>
  )
}

function HeroSliderSlide({ className, ...props }: React.ComponentProps<typeof CarouselItem>) {
  return (
    <CarouselItem
      className={cn("relative overflow-hidden basis-full w-full !m-0 !p-0", className)}
      {...props}
    />
  )
}

function HeroSliderSlideBackground({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="hero-slider-slide-background"
      className={cn("absolute inset-0", className)}
      {...props}
    />
  )
}

function HeroSliderSlideContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="hero-slider-slide-content"
      className={cn("relative z-10 pb-24 pt-36 px-18 min-h-[30rem]", className)}
      {...props}
    />
  )
}

function HeroSliderPrevious({ className, ...props }: React.ComponentProps<typeof CarouselPrevious>) {
  return (
    <CarouselPrevious
      className={cn("relative inset-auto h-16 w-16 rounded-none translate-x-0 translate-y-0 !bg-background/40 hover:!bg-background/70 backdrop-blur-sm", className)}
      {...props}
    />
  )
}

function HeroSliderNext({ className, ...props }: React.ComponentProps<typeof CarouselNext>) {
  return (
    <CarouselNext
      className={cn("relative inset-auto h-16 w-16 rounded-none translate-x-0 translate-y-0 !bg-background/40 hover:!bg-background/70 backdrop-blur-sm", className)}
      {...props}
    />
  )
}

export {
  type CarouselApi as HeroSliderApi,
  HeroSlider,
  HeroSliderSlide,
  HeroSliderSlideBackground,
  HeroSliderSlideContent,
}
