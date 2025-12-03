import * as React from "react"
import Link from "next/link"
import { Logo } from "@/components/website-base/logo"
import {
  NavigationMenu,
  NavigationMenuProvider,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContentAnimated,
  NavigationMenuLink,
  MobileNavigationTrigger,
} from "@/components/ui/navigation-menu"
import { NavigationMenuTournament, NavigationMenuTournamentFeatured } from "./nav-tournament-item"
import { PaddingGlobal } from "@/components/website-base/padding-containers"
import { getNavigationTournaments } from "@/cms/queries/tournaments"
import { getMostRecentBlog } from "@/cms/queries/blog"
import { getNavigationSettings } from "@/cms/queries/website"
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
import { BroadcastPartnerLink } from "@/components/blocks/broadcast-partner"

const exploreNavItems = [
  { href: "/news", label: "News", key: "nav-news" },
  { href: "/social-impact", label: "Social Impact", key: "nav-social" },
  { href: "/leadership", label: "Leadership", key: "nav-leadership" },
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
  let navSettings: Awaited<ReturnType<typeof getNavigationSettings>> = null
  
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

  try {
    navSettings = await getNavigationSettings()
  } catch (error) {
    dev.log("Failed to load navigation settings:", error)
  }

  return (
    <div className={cn("sticky top-0 z-50 w-full border-b border-border/50 bg-background backdrop-blur supports-[backdrop-filter]:bg-background/90", gameCards && gameCards.length > 0 && "bg-background supports-[backdrop-filter]:bg-background")}>
      <nav>
        <PaddingGlobal>
          <div className="mx-auto flex w-full items-center gap-4 lg:gap-12 h-18">
            <Logo size="lg" link variant="2-lines" />
            <NavigationMenuProvider>
              <NavigationMenu
                viewport={false}
                className="hidden lg:flex justify-end"
                mobileFooter={
                  <div className="flex gap-3">
                    <Button asChild size="skew" className="flex-1 px-2">
                      <Link href="/checkout"><span>Purchase Tickets</span></Link>
                    </Button>
                    <Button asChild size="skew" variant="outline" className="px-5">
                      <Link href="https://shopw7f.myshopify.com/" target="_blank" rel="me"><span>Shop</span></Link>
                    </Button>
                  </div>
                }
              >
              <NavigationMenuList className="lg:gap-2">
                <NavigationMenuItem>
                  <NavigationMenuTrigger><span>Events & Tickets</span></NavigationMenuTrigger>
                  <NavigationMenuContentAnimated className="right-auto !w-max">
                    {(() => {
                      const featuredTournament = tournaments.find(t => t.data.featured === true)
                      const otherTournaments = tournaments.filter(t => t.data.featured !== true)

                      return (
                        <div className="grid lg:grid-cols-[1fr_1px_auto] gap-4">
                          {featuredTournament && (
                            <ul className="grid gap-2 h-full">
                              <NavigationMenuTournamentFeatured
                                key={featuredTournament.id}
                                tournament={featuredTournament}
                              />
                            </ul>
                          )}
                          <Separator orientation="vertical" className="hidden lg:block" />
                          <div className="flex flex-col gap-6 lg:py-3 lg:min-w-[320px]">
                            {navSettings?.moreInfoMode === "Where to watch" && navSettings.broadcastPartners.length > 0 ? (
                              <div className="flex flex-col lg:gap-3 gap-4 content-start">
                                <div className="flex items-center gap-3 w-full">
                                  <Subtitle className="mb-0 text-xs whitespace-nowrap">Where to watch</Subtitle>
                                </div>
                                <div className="grid grid-cols-2 w-full gap-x-1.5">
                                  {navSettings.broadcastPartners.map((partner, index) => {
                                    const totalPartners = navSettings.broadcastPartners.length
                                    const itemsInLastRow = totalPartners % 2 || 2
                                    const lastRowStartIndex = totalPartners - itemsInLastRow
                                    const isNotOnLastRow = index < lastRowStartIndex
                                    
                                    return (
                                      <BroadcastPartnerLink
                                        size="sm" 
                                        key={partner.id}
                                        partner={partner}
                                        className={isNotOnLastRow ? "border-b border-border/50" : undefined}
                                      />
                                    )
                                  })}
                                </div>
                              </div>
                            ) : recentBlog && (
                              <div className="flex flex-col lg:gap-3 gap-4 content-start">
                                <div className="flex items-center w-full">
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
                                  className="w-full lg:w-[320px]"
                                />
                              </div>
                            )}
                            <div className="flex flex-col items-stretch lg:gap-3 gap-4 flex-grow items-start">
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
                  </NavigationMenuContentAnimated>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger><span>Explore</span></NavigationMenuTrigger>
                  <NavigationMenuContentAnimated className="!w-max lg:w-[320px]">
                    <ul className="grid gap-1">
                      {exploreNavItems.map((item) => (
                        <li key={item.key}>
                          <NavigationMenuLink href={item.href}>
                            <span>{item.label}</span>
                            {item.subtitle && <span className="text-xs font-normal text-muted-foreground">{item.subtitle}</span>}
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContentAnimated>
                </NavigationMenuItem>

                <NavigationMenuItem className="hidden lg:block">
                  <NavigationMenuLink
                    href="https://shopw7f.myshopify.com/"
                    target="_blank"
                    rel="me"
                    asButton
                  >
                    <span>Shop</span>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
              </NavigationMenu>
              <div className="flex flex-grow justify-end">
                <div className="hidden lg:block">
                  <Button asChild size="skew"><Link href="/checkout"><span>Purchase Tickets</span></Link></Button>
                </div>
                <MobileNavigationTrigger />
              </div>
            </NavigationMenuProvider>
          </div>
        </PaddingGlobal>
        {showBreadcrumbs && <PageBreadcrumbs pathname={pathname} customBreadcrumbs={customBreadcrumbs} />}
      </nav>
      {gameCards && gameCards.length > 0 && tournament && <GamesSlider gameCards={gameCards} tournament={tournament} />}
    </div>
  )
}

export { NavMain }


