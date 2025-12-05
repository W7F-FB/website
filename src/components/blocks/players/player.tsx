import Image from "next/image"
import { PrismicNextImage } from "@prismicio/next"
import { PlayerUnknown } from "@/components/website-base/icons"
import type { ImageField } from "@prismicio/client"

type PlayerHeadshotProps = {
    logoField?: ImageField
    headshotUrl?: string
    primaryColor?: string
}

export function PlayerHeadshot({ logoField, headshotUrl, primaryColor }: PlayerHeadshotProps) {
    return (
        <div className="w-16 h-16 bg-muted/10 rounded-full overflow-hidden flex items-center justify-center relative border border-muted/50">
            {logoField?.url && (
                <PrismicNextImage
                    field={logoField}
                    fill
                    className="object-cover opacity-60 mask-b-from-20% mask-r-from-50%  mask-radial-from-1%"
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
                    {logoField?.url && (
                        <div className="absolute size-4 z-[20] -bottom-1 opacity-50 rounded-full">
                            <PrismicNextImage
                                field={logoField}
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

