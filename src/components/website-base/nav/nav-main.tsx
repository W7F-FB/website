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
import { getNavigationTournaments } from "@/sanity/queries/tournaments"
import type { Tournament } from "../../../../studio-website/sanity.types"
import { Button } from "@/components/ui/button"

async function NavMain() {
  const tournaments = await getNavigationTournaments()

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
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
                      key={tournament._id}
                      tournament={tournament}
                    />    
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger><span>Explore</span></NavigationMenuTrigger>
              <NavigationMenuContent >
                <ul className="grid gap-1 md:w-[320px]">
                  <li>
                    <NavigationMenuLink asChild>
                      <Link href="#"><span>Who We Are</span></Link>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <Link href="#"><span>News</span></Link>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <Link href="#"><span>Social Impact</span></Link>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <Link href="#"><span>FAQs</span></Link>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                <Link href="#"><span>Shop</span></Link>
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


