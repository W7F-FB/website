import Image from "next/image"
import { PlayerUnknown } from "@/components/website-base/icons"

type PlayerHeadshotProps = {
    logoUrl?: string
    headshotUrl?: string
    primaryColor?: string
}

export function PlayerHeadshot({ logoUrl, headshotUrl, primaryColor }: PlayerHeadshotProps) {
    return (
        <div className="w-16 h-16 bg-muted/10 rounded-full overflow-hidden flex items-center justify-center relative border border-muted/50">
            {logoUrl && (
                <Image
                    src={logoUrl}
                    alt="Team logo"
                    fill
                    className="object-cover opacity-40 mask-b-from-10% mask-r-from-10%  mask-radial-from-1%"
                />
            )}
            {headshotUrl ? (
                <Image
                    src={headshotUrl}
                    alt="Player headshot"
                    fill
                    className="object-cover relative z-10"
                />
            ) : (
                <div className="relative z-10 w-full h-full flex items-start justify-center">
                    <PlayerUnknown
                        className="relative z-10 w-[110%] h-[110%] "
                        style={{ color: primaryColor || undefined }}
                    />
                    {logoUrl && (
                        <div className="absolute size-4 z-[20] -bottom-1 opacity-50 rounded-full">
                            <Image
                                src={logoUrl}
                                alt="Team logo"
                                fill
                                className="w-full h-full "
                            />
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

