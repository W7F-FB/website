"use client"

import * as React from "react"
import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from "embla-carousel-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { CaretRightIcon } from "@/components/website-base/icons"


export type CarouselApi = UseEmblaCarouselType[1]
type UseParams = Parameters<typeof useEmblaCarousel>
type CarouselOptions = UseParams[0]
type CarouselPlugin = UseParams[1]

export type ThumbnailCarouselProps = {
  opts?: CarouselOptions
  plugins?: CarouselPlugin
  orientation?: "horizontal" | "vertical"
  setApi?: (api: CarouselApi) => void
  mainApi?: CarouselApi
}

type ThumbnailCarouselContextValue = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0]
  api: ReturnType<typeof useEmblaCarousel>[1]
  mainApi: CarouselApi | undefined
  opts?: CarouselOptions
  orientation: "horizontal" | "vertical"
  onThumbClick: (index: number) => void
  selectedIndex: number
  scrollPrev: () => void
  scrollNext: () => void
  canScrollPrev: boolean
  canScrollNext: boolean
}


const ThumbnailCarouselContext = React.createContext<ThumbnailCarouselContextValue | null>(
  null
)

function useThumbnailCarousel() {
  const ctx = React.useContext(ThumbnailCarouselContext)
  if (!ctx) {
    throw new Error("useThumbnailCarousel must be used within <ThumbnailCarousel />")
  }
  return ctx
}

function ThumbnailCarousel({
  orientation = "horizontal",
  opts,
  plugins,
  setApi,
  mainApi,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & ThumbnailCarouselProps) {
  const defaultOptions: CarouselOptions = {
    containScroll: "keepSnaps",
    dragFree: true,
    ...opts,
    axis: orientation === "horizontal" ? "x" : "y",
  }

  const [carouselRef, api] = useEmblaCarousel(defaultOptions, plugins)
  const [selectedIndex, setSelectedIndex] = React.useState(0)
  const [canScrollPrev, setCanScrollPrev] = React.useState(false)
  const [canScrollNext, setCanScrollNext] = React.useState(false)

  const onThumbClick = React.useCallback(
    (index: number) => {
      if (!mainApi) return
      const count = mainApi.slideNodes().length
      if (index >= 0 && index < count) {
        mainApi.scrollTo(index)
      }
    },
    [mainApi]
  )

  const scrollPrev = React.useCallback(() => {
    mainApi?.scrollPrev()
  }, [mainApi])

  const scrollNext = React.useCallback(() => {
    mainApi?.scrollNext()
  }, [mainApi])

  React.useEffect(() => {
    if (api && setApi) {
      setApi(api)
    }
  }, [api, setApi])

  React.useEffect(() => {
    if (!api || !mainApi) {
      setCanScrollPrev(false)
      setCanScrollNext(false)
      return
    }

    const sync = () => {
      const selected = mainApi.selectedScrollSnap()
      setSelectedIndex(selected)
      api.scrollTo(selected)
      setCanScrollPrev(mainApi.canScrollPrev())
      setCanScrollNext(mainApi.canScrollNext())
    }

    sync()

    mainApi.on("select", sync)
    mainApi.on("reInit", sync)

    return () => {
      mainApi.off("select", sync)
      mainApi.off("reInit", sync)
    }
  }, [mainApi, api])

  return (
    <ThumbnailCarouselContext.Provider
      value={{
        carouselRef,
        api,
        mainApi,
        opts,
        orientation,
        onThumbClick,
        selectedIndex,
        scrollPrev,
        scrollNext,
        canScrollPrev,
        canScrollNext,
      }}
    >
      <div
        className={cn("relative", className)}
        role="region"
        aria-roledescription="thumbnail carousel"
        {...props}
      >
        {children}
      </div>
    </ThumbnailCarouselContext.Provider>
  )
}

function ThumbnailCarouselContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { carouselRef, orientation } = useThumbnailCarousel()

  return (
    <div ref={carouselRef} className="overflow-hidden">
      <div
        className={cn(
          "flex justify-start",
          orientation === "horizontal"
            ? "-ml-4 flex-row"
            : "-mt-4 flex-col",
          className
        )}
        {...props}
      />
    </div>
  )
}

const ThumbnailCarouselItem = React.memo(
  ({
    index,
    className,
    ...props
  }: React.ComponentProps<"div"> & { index: number }) => {
    const { orientation, onThumbClick, selectedIndex } = useThumbnailCarousel()
    const isSelected = selectedIndex === index

    const handleClick = React.useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()
        onThumbClick(index)
      },
      [onThumbClick, index]
    )

    return (
      <div
        role="group"
        aria-roledescription="slide"
        aria-current={isSelected ? "true" : "false"}
        className={cn(
          "min-w-0 shrink-0 grow-0 basis-full cursor-pointer",
          orientation === "horizontal" ? "pl-4" : "pt-4",
          className
        )}
        onClick={handleClick}
        {...props}
      />
    )
  }
)
ThumbnailCarouselItem.displayName = "ThumbnailCarouselItem"

function ThumbnailCarouselPrevious({
  className,
  variant = "link",
  size = "icon",
  icon: Icon = CaretRightIcon,
  ...props
}: React.ComponentProps<typeof Button> & {
  icon?: React.ComponentType<{ className?: string }>
}) {
  const { orientation, scrollPrev, canScrollPrev } = useThumbnailCarousel()

  return (
    <Button
      variant={variant}
      size={size}
      className={cn(
        "absolute size-6 z-10",
        orientation === "horizontal"
          ? "top-1/2 left-2 -translate-y-1/2"
          : "top-2 left-1/2 -translate-x-1/2 rotate-90",
        className
      )}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      {...props}
    >
      <Icon className="size-4 rotate-180" />
      <span className="sr-only">Previous thumbnail</span>
    </Button>
  )
}

function ThumbnailCarouselNext({
  className,
  variant = "link",
  size = "icon",
  icon: Icon = CaretRightIcon,
  ...props
}: React.ComponentProps<typeof Button> & {
  icon?: React.ComponentType<{ className?: string }>
}) {
  const { orientation, scrollNext, canScrollNext } = useThumbnailCarousel()

  return (
    <Button
      variant={variant}
      size={size}
      className={cn(
        "absolute size-6 z-10",
        orientation === "horizontal"
          ? "top-1/2 right-2 -translate-y-1/2"
          : "bottom-2 left-1/2 -translate-x-1/2 rotate-90",
        className
      )}
      disabled={!canScrollNext}
      onClick={scrollNext}
      {...props}
    >
      <Icon className="size-4" />
      <span className="sr-only">Next thumbnail</span>
    </Button>
  )
}

export {
  ThumbnailCarousel,
  ThumbnailCarouselContent,
  ThumbnailCarouselItem,
  ThumbnailCarouselPrevious,
  ThumbnailCarouselNext,
  useThumbnailCarousel,
}