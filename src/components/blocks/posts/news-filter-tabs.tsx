"use client"

import { useMemo, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { PostCardHoriz, PostCardVert } from "@/components/blocks/posts/post"
import { PressReleaseCard } from "@/components/blocks/posts/press-release"
import { P } from "@/components/website-base/typography"
import { NEWS_CATEGORIES, ALL_NEWS_TAB, PRESS_RELEASES_TAB, type FilterTab } from "../../../app/(website)/(subpages)/news/categories"
import type { BlogMetadata } from "@/components/blocks/posts/post"

type NewsFilteredContentProps = {
  allBlogs: BlogMetadata[]
  initialTab: FilterTab
}

function FilterChip({
  active,
  onClick,
  size = "default",
  children,
}: {
  active: boolean
  onClick: () => void
  size?: "default" | "lg"
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center font-headers uppercase font-semibold -skew-x-16 transition-all cursor-pointer whitespace-nowrap",
        size === "lg"
          ? "text-base px-6 pt-2 pb-1.5"
          : "text-xs px-3.5 pt-1.5 pb-1",
        active
          ? "bg-primary text-background"
          : "bg-muted/20 border border-border/50 text-foreground/60 hover:text-foreground hover:bg-muted/40"
      )}
    >
      <span className="skew-x-16">{children}</span>
    </button>
  )
}

function BlogsList({ blogs, isPressReleases }: { blogs: BlogMetadata[]; isPressReleases: boolean }) {
  if (!blogs.length) {
    return (
      <div className="text-center py-16">
        <P className="text-muted-foreground">No posts found in this category.</P>
      </div>
    )
  }

  if (isPressReleases) {
    return (
      <div className="grid gap-6">
        {blogs.map((blog) => (
          <PressReleaseCard key={blog.slug} blog={blog} />
        ))}
      </div>
    )
  }

  const [first, ...rest] = blogs

  return (
    <div className="grid gap-8">
      <PostCardHoriz blog={first} />

      {rest.length > 0 && (
        <>
          <Separator className="my-12" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
            {rest.map((blog) => (
              <PostCardVert key={blog.slug} blog={blog} className="h-full" />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export function NewsFilteredContent({ allBlogs, initialTab: _initialTab }: NewsFilteredContentProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const activeTab = useMemo<FilterTab>(() => {
    const params = new URLSearchParams(searchParams.toString())
    if (params.has("press-releases")) return PRESS_RELEASES_TAB
    const category = params.get("category")
    if (category && NEWS_CATEGORIES.includes(category as typeof NEWS_CATEGORIES[number])) {
      return category as FilterTab
    }
    return ALL_NEWS_TAB
  }, [searchParams])

  const isNews = activeTab !== PRESS_RELEASES_TAB

  const handleFilter = useCallback((value: FilterTab) => {
    const params = new URLSearchParams(searchParams.toString())

    if (value === PRESS_RELEASES_TAB) {
      params.delete("category")
      params.set("press-releases", "")
      router.push(`/news?${params.toString()}`, { scroll: false })
    } else if (value === ALL_NEWS_TAB) {
      router.push("/news", { scroll: false })
    } else {
      params.delete("press-releases")
      params.set("category", value)
      router.push(`/news?${params.toString()}`, { scroll: false })
    }
  }, [router, searchParams])

  const filteredBlogs = useMemo(() => {
    if (activeTab === PRESS_RELEASES_TAB) {
      return allBlogs.filter((b) => b.category === "Press Releases")
    }
    if (activeTab === ALL_NEWS_TAB) {
      return allBlogs.filter((b) => b.category !== "Press Releases")
    }
    return allBlogs.filter((b) => b.category === activeTab)
  }, [allBlogs, activeTab])

  const selectValue = activeTab === PRESS_RELEASES_TAB ? ALL_NEWS_TAB : activeTab

  return (
    <>
      <div className="mb-12 space-y-5">
        <div className="flex items-center gap-3">
          <FilterChip
            size="lg"
            active={isNews}
            onClick={() => handleFilter(ALL_NEWS_TAB)}
          >
            News
          </FilterChip>
          <FilterChip
            size="lg"
            active={!isNews}
            onClick={() => handleFilter(PRESS_RELEASES_TAB)}
          >
            Press Releases
          </FilterChip>
        </div>

        {isNews && (
          <>
            <Separator className="opacity-40" />

            {/* Desktop: chips */}
            <div className="hidden md:flex flex-wrap items-center gap-2">
              <FilterChip
                active={activeTab === ALL_NEWS_TAB}
                onClick={() => handleFilter(ALL_NEWS_TAB)}
              >
                All
              </FilterChip>
              {NEWS_CATEGORIES.map((category) => (
                <FilterChip
                  key={category}
                  active={activeTab === category}
                  onClick={() => handleFilter(category)}
                >
                  {category}
                </FilterChip>
              ))}
            </div>

            {/* Mobile: select */}
            <div className="md:hidden">
              <Select
                value={selectValue}
                onValueChange={(value) => handleFilter(value as FilterTab)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL_NEWS_TAB}>All</SelectItem>
                  {NEWS_CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </>
        )}
      </div>

      <BlogsList blogs={filteredBlogs} isPressReleases={activeTab === PRESS_RELEASES_TAB} />
    </>
  )
}
