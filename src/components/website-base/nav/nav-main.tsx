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
import { NavigationMenuTournament } from "./nav-tournament-item"
import { PaddingGlobal } from "@/components/website-base/padding-containers"
import { getNavigationTournaments } from "@/cms/queries/tournaments"
import { Button } from "@/components/ui/button"

const exploreNavItems = [
  { href: "/news", label: "News", key: "nav-news" },
  { href: "/social-impact", label: "Social Impact", key: "nav-social" },
  { href: "/faqs", label: "FAQs", key: "nav-faqs" },
  { href: "/leadership", label: "Leadership", key: "nav-leadership" },
  { href: "/resources", label: "Resources", key: "nav-resources" },
]

async function NavMain() {
  // Add error handling to prevent nav failure
  let tournaments: Awaited<ReturnType<typeof getNavigationTournaments>> = []
  try {
    tournaments = await getNavigationTournaments()
  } catch (error) {
    console.error("Failed to load tournaments for navigation:", error)
    // Navigation will still render, just without tournaments
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background backdrop-blur supports-[backdrop-filter]:bg-background/90">
      <PaddingGlobal>
        <div className="mx-auto flex w-full items-center gap-12 py-4">
          <Logo size="lg" link color="white" variant="2-lines" />
          <NavigationMenu viewport={false} className="justify-end">
            <NavigationMenuList className="gap-2">
              <NavigationMenuItem>
                <NavigationMenuTrigger><span>Events & Tickets</span></NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-2 md:w-[320px]">
                    {tournaments.map((tournament) => (
                      <NavigationMenuTournament
                        key={tournament.id}
                        tournament={tournament}
                      />
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger><span>Explore</span></NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-1 md:w-[320px]">
                    {exploreNavItems.map((item, index) => (
                      <li key={item.key}>
                        <NavigationMenuLink href={item.href}>
                          <span>{item.label}</span>
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
          <div className="flex-grow flex justify-end">
            <Button asChild size="skew"><Link href="#"><span>Early Access</span></Link></Button>
          </div>
        </div>
      </PaddingGlobal>
    </nav>
  )
}

export { NavMain }


