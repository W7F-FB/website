import * as React from "react"
import Link from "next/link"
import { Logo } from "@/components/website-base/logo"
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { NavigationMenuTournament, NavigationMenuTournamentFeatured } from "./nav-tournament-item"
import { PaddingGlobal } from "@/components/website-base/padding-containers"
import { getNavigationTournaments } from "@/cms/queries/tournaments"
import { getMostRecentBlog } from "@/cms/queries/blog"
import { Button } from "@/components/ui/button"
import { PageBreadcrumbs } from "@/components/blocks/page-breadcrumbs"
import type { GameCard } from "@/types/components"
import { GamesSlider } from "@/components/blocks/tournament/games-slider/games-slider"
import type { TournamentDocument } from "../../../../prismicio-types"
import { cn } from "@/lib/utils"
import { Subtitle } from "../typography"
import { Separator } from "@/components/ui/separator"
import { PostMini } from "@/components/blocks/posts/post"
import { isFilled } from "@prismicio/client"
import { dev } from "@/lib/dev"

const exploreNavItems = [
  { href: "/news", label: "News", key: "nav-news" },
  { href: "/social-impact", label: "Social Impact", key: "nav-social" },
  { href: "/rising-sevens", label: "Rising Sevens", key: "nav-rising-sevens", subtitle: "Youth Tournament" },
  { href: "/faqs", label: "FAQs", key: "nav-faqs" }
]

type BreadcrumbItem = {
  label: string | React.ReactNode;
  href: string;
};

type NavMainProps = {
  showBreadcrumbs?: boolean;
  pathname?: string;
  customBreadcrumbs?: BreadcrumbItem[];
  gameCards?: GameCard[];
  tournament?: TournamentDocument;
}

async function NavMain({ showBreadcrumbs, pathname, customBreadcrumbs, gameCards, tournament }: NavMainProps = {} as NavMainProps) {
  let tournaments: Awaited<ReturnType<typeof getNavigationTournaments>> = []
  let recentBlog: Awaited<ReturnType<typeof getMostRecentBlog>> = null
  
  try {
    tournaments = await getNavigationTournaments()
  } catch (error) {
    dev.log("Failed to load tournaments for navigation:", error)
  }
  
  try {
    recentBlog = await getMostRecentBlog()
  } catch (error) {
    dev.log("Failed to load recent blog for navigation:", error)
  }

  return (
    <div className={cn("sticky top-0 z-50 w-full border-b border-border/50 bg-background backdrop-blur supports-[backdrop-filter]:bg-background/90", gameCards && gameCards.length > 0 && "bg-background supports-[backdrop-filter]:bg-background")}>
      <nav>
        <PaddingGlobal>
          <div className="mx-auto flex w-full items-center gap-4 md:gap-12 h-18">
            <Logo size="lg" link variant="2-lines" />
            <NavigationMenu viewport={false} className="hidden md:flex justify-end">
              <NavigationMenuList className="gap-2">
                <NavigationMenuItem>
                  <NavigationMenuTrigger><span>Events & Tickets</span></NavigationMenuTrigger>
                  <NavigationMenuContent className="right-auto !w-max">
                    {(() => {
                      const featuredTournament = tournaments.find(t => t.data.featured === true)
                      const otherTournaments = tournaments.filter(t => t.data.featured !== true)

                      return (
                        <div className="grid grid-cols-[1fr_1px_auto] gap-4">
                          {featuredTournament && (
                            <ul className="grid gap-2 h-full">
                              <NavigationMenuTournamentFeatured
                                key={featuredTournament.id}
                                tournament={featuredTournament}
                              />
                            </ul>
                          )}
                          <Separator orientation="vertical" />
                          <div className="flex flex-col gap-6 py-3">
                            {recentBlog && (
                              <div className="flex flex-col gap-3 content-start">
                                <div className="flex items-center gap-3 w-full">
                                  <Subtitle className="mb-0 text-xs whitespace-nowrap">Recent News</Subtitle>
                                </div>
                                <PostMini
                                  blog={{
                                    title: recentBlog.data.title || "",
                                    slug: recentBlog.uid,
                                    excerpt: recentBlog.data.excerpt || null,
                                    image: isFilled.image(recentBlog.data.image) ? recentBlog.data.image.url : undefined,
                                    category: recentBlog.data.category || null,
                                    author: recentBlog.data.author || null,
                                    date: recentBlog.data.date || null,
                                  }}
                                  className="w-[320px]"
                                />
                              </div>
                            )}
                            <div className="flex flex-col items-stretch gap-3 flex-grow items-start">
                              <div className="flex items-center gap-3 w-full">
                                <Subtitle className="mb-0 text-xs whitespace-nowrap">Past Events</Subtitle>    
                              </div>
                              <ul className="grid gap-2 flex-grow">
                                {otherTournaments.map((tournament) => (
                                  <NavigationMenuTournament
                                    key={tournament.id}
                                    tournament={tournament}
                                  />
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      )
                    })()}
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger><span>Explore</span></NavigationMenuTrigger>
                  <NavigationMenuContent className="!w-max">
                    <ul className="grid gap-1 md:w-[320px]">
                      {exploreNavItems.map((item) => (
                        <li key={item.key}>
                          <NavigationMenuLink href={item.href}>
                            <span>{item.label}</span>
                            {item.subtitle && <span className="text-xs font-normal text-muted-foreground">{item.subtitle}</span>}
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink href="https://shopw7f.myshopify.com/" target="_blank" rel="me" className={navigationMenuTriggerStyle()}>
                    <span>Shop</span>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
            <div className="hidden md:flex flex-grow justify-end">
              <Button asChild size="skew"><Link href="/checkout"><span>Purchase Tickets</span></Link></Button>
            </div>
          </div>
        </PaddingGlobal>
        {showBreadcrumbs && <PageBreadcrumbs pathname={pathname} customBreadcrumbs={customBreadcrumbs} />}
      </nav>
      {gameCards && gameCards.length > 0 && tournament && <GamesSlider gameCards={gameCards} tournament={tournament} />}
    </div>
  )
}

export { NavMain }


