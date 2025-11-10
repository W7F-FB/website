"use client"

import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SectionNavProps {
  sections: Array<{ id: string; title: string }>
}

export function SectionNav({ sections }: SectionNavProps) {
  const [activeSection, setActiveSection] = React.useState<string | null>(sections[0]?.id ?? null)

  React.useEffect(() => {
    const observerOptions = {
      rootMargin: "-20% 0px -60% 0px",
      threshold: 0,
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id)
        }
      })
    }, observerOptions)

    const elements = sections
      .map((section) => document.getElementById(section.id))
      .filter((el): el is HTMLElement => el !== null)

    elements.forEach((element) => {
      observer.observe(element)
    })

    return () => {
      elements.forEach((element) => {
        observer.unobserve(element)
      })
    }
  }, [sections])

  return (
    <div className="space-y-4">
      {sections.map((section) => {
        const isActive = activeSection === section.id
        return (
          <Button
            key={section.id}
            size="lg"
            variant="outline"
            className={cn(
              "text-left w-full justify-start px-6",
              isActive && "!bg-muted text-accent-foreground"
            )}
            asChild
          >
            <Link href={`#${section.id}`}>
              <span>{section.title}</span>
            </Link>
          </Button>
        )
      })}
    </div>
  )
}

