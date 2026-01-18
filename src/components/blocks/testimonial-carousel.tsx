"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

const TESTIMONIALS = [
  {
    quote: "Witnessing the tournament in person turns mindless scrolling into a liability. In fact, try to avoid blinking at all during World Sevens altogether — you could miss what makes it special.",
    author: "Tamerra Griffin, The Athletic"
  },
  {
    quote: "It's really just a fun format. I think it really allows you to express your creativity. And as players, we love to just be on the ball. And you're on the ball a lot in 7v7. So yeah, it's just been really fun.",
    author: "Mackenzy Robbe (San Diego Wave)"
  },
  {
    quote: "Thankful for all the powerful women who've paved the way for the start of something special in the women's game.",
    author: "Lais Araujo, Benfica"
  },
  {
    quote: "Obsessed with the @worldsevens_ restoring the feeling. Football is back.",
    author: "@liamnloftus"
  },
  {
    quote: "This whole tournament is a vibe. I'm obsessed with world sevens. I don't want anything else.",
    author: "@abdmlkawii"
  }
]

const AUTOPLAY_DELAY = 6000

function TestimonialCarousel({ className }: { className?: string }) {
  const [selectedIndex, setSelectedIndex] = React.useState(0)
  const [isPaused, setIsPaused] = React.useState(false)

  React.useEffect(() => {
    if (isPaused) return

    const interval = setInterval(() => {
      setSelectedIndex((prev) => (prev + 1) % TESTIMONIALS.length)
    }, AUTOPLAY_DELAY)

    return () => clearInterval(interval)
  }, [isPaused])

  return (
    <div
      className={cn("grid grid-rows-[auto_1fr_auto] text-center px-4 max-w-5xl mx-auto", className)}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Quote mark - always at top */}
      <span className="text-6xl md:text-8xl text-primary leading-none select-none">
        "
      </span>

      {/* Content area - uses grid to stack all testimonials, tallest sets height */}
      <div className="grid py-4">
        {TESTIMONIALS.map((testimonial, index) => (
          <div
            key={index}
            className={cn(
              "col-start-1 row-start-1 flex flex-col justify-center transition-opacity duration-300",
              selectedIndex === index
                ? "opacity-100"
                : "opacity-0 pointer-events-none"
            )}
          >
            <p className="text-lg font-headers font-medium md:text-3xl lg:text-4xl leading-relaxed">
              {testimonial.quote}
            </p>
            <p className="text-sm text-muted-foreground mt-6">
              — {testimonial.author}
            </p>
          </div>
        ))}
      </div>

      {/* Skewed square dot indicators - always at bottom */}
      <div className="flex justify-center gap-2 pt-4">
        {TESTIMONIALS.map((_, index) => (
          <button
            key={index}
            onClick={() => setSelectedIndex(index)}
            aria-label={`Go to testimonial ${index + 1}`}
            className={cn(
              "w-3 h-3 -skew-x-[var(--skew-btn)] transition-colors duration-300",
              selectedIndex === index
                ? "bg-foreground"
                : "bg-foreground/30 hover:bg-foreground/50"
            )}
          />
        ))}
      </div>
    </div>
  )
}

export { TestimonialCarousel }
