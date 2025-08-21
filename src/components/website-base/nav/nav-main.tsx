"use client"

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
import { getNavigationTournaments } from "@/sanity/queries"
import type { Tournament } from "../../../../studio-website/sanity.types"

function NavMain() {
  const [tournaments, setTournaments] = React.useState<Tournament[]>([])

  React.useEffect(() => {
    getNavigationTournaments().then(setTournaments)
  }, [])

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <PaddingGlobal>
      <div className="mx-auto flex w-full items-center gap-12 py-4">
        <Logo size="lg" link />
        <NavigationMenu viewport={false} className="justify-end">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Events & Tickets</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-1 md:w-[320px]">
                  {tournaments.map((tournament) => (
                    <NavigationMenuTournament
                      key={tournament._id}
                      tournament={tournament}
                    />    
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Explore</NavigationMenuTrigger>
              <NavigationMenuContent >
                <ul className="grid gap-1 md:w-[320px]">
                  <li>
                    <NavigationMenuLink asChild>
                      <Link href="#">Who We Are</Link>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <Link href="#">News</Link>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <Link href="#">Social Impact</Link>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <Link href="#">FAQs</Link>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                <Link href="#">Shop</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                <Link href="#">Contact</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      </PaddingGlobal>
    </nav>
  )
}

export { NavMain }


