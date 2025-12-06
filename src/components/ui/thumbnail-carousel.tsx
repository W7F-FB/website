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
  totalItems: number
  setTotalItems: (count: number) => void
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
  const [totalItems, setTotalItems] = React.useState(0)

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
        totalItems,
        setTotalItems,
      }}
    >
      <div
        className={cn(
          "flex items-center gap-2",
          orientation === "vertical" && "flex-col",
          totalItems === 1 && "hidden",
          className
        )}
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
  children,
  ...props
}: React.ComponentProps<"div">) {
  const { carouselRef, orientation, setTotalItems } = useThumbnailCarousel()
  const childCount = React.Children.count(children)

  React.useEffect(() => {
    setTotalItems(childCount)
  }, [childCount, setTotalItems])

  return (
    <div ref={carouselRef} className="overflow-hidden flex-1 min-w-0">
      <div
        className={cn(
          "flex justify-start",
          orientation === "horizontal"
            ? "-ml-1.5 flex-row"
            : "-mt-1.5 flex-col",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </div>
  )
}

const ThumbnailCarouselItem = React.memo(
  ({
    index,
    className,
    style,
    children,
    ...props
  }: React.ComponentProps<"div"> & { index: number }) => {
    const { orientation, onThumbClick, selectedIndex, totalItems } = useThumbnailCarousel()
    const isSelected = selectedIndex === index

    const handleClick = React.useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()
        onThumbClick(index)
      },
      [onThumbClick, index]
    )

    const basisPercent = totalItems > 0 ? 100 / Math.min(totalItems, 5) : 20

    return (
      <div
        role="group"
        aria-roledescription="slide"
        aria-current={isSelected ? "true" : "false"}
        className={cn(
          "min-w-0 shrink-0 grow-0 cursor-pointer",
          orientation === "horizontal" ? "pl-1.5" : "pt-1.5",
          className
        )}
        style={{ flexBasis: `${basisPercent}%`, ...style }}
        onClick={handleClick}
        {...props}
      >
        <div
          className={cn(
            "relative aspect-video overflow-hidden rounded-md border transition-all",
            isSelected
              ? "border-border ring-1 ring-border"
              : "border-transparent opacity-60 hover:opacity-100"
          )}
        >
          {children}
        </div>
      </div>
    )
  }
)
ThumbnailCarouselItem.displayName = "ThumbnailCarouselItem"

function ThumbnailCarouselPrevious({
  className,
  variant = "link",
  size = "icon",
  icon: Icon = CaretRightIcon,
  asChild = false,
  children,
  ...props
}: React.ComponentProps<typeof Button> & {
  icon?: React.ComponentType<{ className?: string }>
}) {
  const { orientation, scrollPrev, canScrollPrev } = useThumbnailCarousel()

  return (
    <Button
      variant={variant}
      size={size}
      asChild={asChild}
      className={cn(
        "shrink-0 size-6",
        orientation === "vertical" && "rotate-90",
        className
      )}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      {...props}
    >
      {asChild ? children : (
        <>
          <Icon className="size-4 rotate-180" />
          <span className="sr-only">Previous thumbnail</span>
        </>
      )}
    </Button>
  )
}

function ThumbnailCarouselNext({
  className,
  variant = "link",
  size = "icon",
  icon: Icon = CaretRightIcon,
  asChild = false,
  children,
  ...props
}: React.ComponentProps<typeof Button> & {
  icon?: React.ComponentType<{ className?: string }>
}) {
  const { orientation, scrollNext, canScrollNext } = useThumbnailCarousel()

  return (
    <Button
      variant={variant}
      size={size}
      asChild={asChild}
      className={cn(
        "shrink-0 size-6",
        orientation === "vertical" && "rotate-90",
        className
      )}
      disabled={!canScrollNext}
      onClick={scrollNext}
      {...props}
    >
      {asChild ? children : (
        <>
          <Icon className="size-4" />
          <span className="sr-only">Next thumbnail</span>
        </>
      )}
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