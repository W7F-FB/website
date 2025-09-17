import { cn } from "@/lib/utils"

interface GrainGradientBackgroundProps {
  className?: string
  width?: number
  height?: number
  overlayColor?: string
  accentColor?: string
  shadowColor?: string
}

export function GrainGradientBackground({ 
  className, 
  width = 1600, 
  height = 1600,
  overlayColor = "#c4c4c4",
  accentColor = "#708e53",
  shadowColor = "#242424"
}: GrainGradientBackgroundProps) {
  return (
    <svg 
      width={width} 
      height={height} 
      viewBox="0 0 1600 1600" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      xmlnsXlink="http://www.w3.org/1999/xlink"
      className={cn("", className)}
    >
      <rect width="1600" height="1600" fill="#000000"/>
      <rect width="1600" height="1600" fill={overlayColor} fillOpacity="0.3615796519203419"/>
      <g clipPath="url(#clip0_50_327)">
        <g filter="url(#filter0_f_50_327)">
          <rect x="328" y="429" width="1070" height="872" fill={accentColor}/>
          <rect x="0" y="618" width="1034" height="837" fill={shadowColor}/>
        </g>
      </g>
      <g style={{ mixBlendMode: "overlay" }}>
        <rect width="1600" height="1600" fill="url(#pattern0)" fillOpacity="0.75"/>
        <rect 
          x="0" 
          y="0" 
          width="1600" 
          height="1600" 
          style={{ 
            fill: "gray", 
            stroke: "transparent", 
            filter: "url(#feTurb02)" 
          }} 
        />
      </g>
      <defs>
        <filter 
          id="feTurb02" 
          filterUnits="objectBoundingBox" 
          x="0%" 
          y="0%" 
          width="100%" 
          height="100%"
        >
          <feTurbulence 
            baseFrequency="0.7" 
            numOctaves="3" 
            seed="0" 
            result="out1"
          />
          <feComposite 
            in="out1" 
            in2="SourceGraphic" 
            operator="in" 
            result="out2"
          />
          <feBlend 
            in="SourceGraphic" 
            in2="out2" 
            mode="overlay" 
            result="out3"
          />
        </filter>
        <filter 
          id="filter0_f_50_327" 
          x="0" 
          y="0" 
          width="1600" 
          height="1600" 
          filterUnits="userSpaceOnUse" 
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix"/>
          <feBlend 
            mode="normal" 
            in="SourceGraphic" 
            in2="BackgroundImageFix" 
            result="shape"
          />
          <feGaussianBlur 
            stdDeviation="250" 
            result="effect1_foregroundBlur_50_327"
          />
        </filter>
        <pattern 
          id="pattern0" 
          patternContentUnits="objectBoundingBox" 
          width="0.08375" 
          height="0.08375"
        >
          <use xlinkHref="#image0_50_327" transform="scale(0.001)"/>
        </pattern>
        <clipPath id="clip0_50_327">
          <rect width="1600" height="1600" fill="white"/>
        </clipPath>
      </defs>
    </svg>
  )
}