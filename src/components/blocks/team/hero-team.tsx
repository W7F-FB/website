"use client"

import { useState } from "react"
import type { TeamDocument } from "../../../../prismicio-types"
import { H1, P } from "@/components/website-base/typography"
import { PrismicNextImage } from "@prismicio/next"
import Link from "next/link"
import Image from "next/image"

function getCountryFlagUrl(nationality: string, size: string = "21x21"): string {
    const baseUrl = "https://omo.akamai.opta.net/image.php"
    const params = new URLSearchParams({
        secure: "true",
        h: "omo.akamai.opta.net",
        sport: "football",
        entity: "flags",
        description: "countries",
        dimensions: size,
        id: nationality
    })
    return `${baseUrl}?${params.toString()}`
}

function CountryFlag({ country }: { country: string }) {
    const [error, setError] = useState(false)

    if (error) return <span>-</span>

    return (
        <Image
            src={getCountryFlagUrl(country)}
            alt={`${country} flag`}
            width={21}
            height={21}
            className="inline-block rounded-sm"
            onError={() => setError(true)}
        />
    )
}

const navLinks = [
    { label: "Home", href: "#home" },
    { label: "Stats", href: "#stats" },
    { label: "Roster", href: "#roster" },
    { label: "Blog", href: "#blog" },
    { label: "More", href: "#more" },
]

export function HeroTeam({ team }: { team: TeamDocument }) {
    const [active, setActive] = useState("#home")

    return (
        <div>
            <div className="px-12 py-8 border-b border-border/20">
                <div className="flex gap-8 items-center">
                    <div>
                        <PrismicNextImage field={team.data.logo} width={100} height={100} />
                    </div>

                    <div>
                        <H1>{team.data.name}</H1>

                        <div className="flex items-center gap-2">
                            <P noSpace>{team.data.country}</P>
                            <CountryFlag country={team.data.country || ""} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex gap-6 pt-3 px-12 border-b">
                {navLinks.map((link) => {
                    const isActive = active === link.href

                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setActive(link.href)}
                            className={`
                                pb-3 text-sm font-medium transition-colors border-b-2 
                                ${isActive
                                    ? "text-foreground border-foreground"
                                    : "text-muted-foreground border-transparent hover:text-foreground hover:border-foreground"
                                }
                            `}
                        >
                            {link.label}
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}
