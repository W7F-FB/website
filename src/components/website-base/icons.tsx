import { SVGProps } from 'react'
import { cn } from '@/lib/utils'

interface IconProps extends SVGProps<SVGSVGElement> {
  size?: number | string
}

const createIcon = (
  displayName: string,
  path: React.ReactNode,
  viewBox: string = "0 0 24 24"
) => {
  const Icon = ({ size = 24, className, ...props }: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox={viewBox}
      width={size}
      height={size}
      className={cn("shrink-0", className)}
      {...props}
    >
      {path}
    </svg>
  )
  
  Icon.displayName = displayName
  return Icon
}

export const QuestionMarkIcon = createIcon(
  "QuestionMarkIcon",
  <path 
    fill="currentColor" 
    fillRule="evenodd" 
    d="M7.82693 7.67308C7.82693 5.36835 9.69528 3.5 12 3.5c2.3047 0 4.1731 1.86835 4.1731 4.17308v0.04126l-5.312 4.55316 -0.6111 0.5238v4.7856h3.5V14.401l5.312 -4.55307 0.6111 -0.52381V7.67308C19.6731 3.43535 16.2377 0 12 0 7.76228 0 4.32693 3.43536 4.32693 7.67308v0.84615h3.5zM10.25 20.1154V23.5h3.5v-3.3846z" 
    clipRule="evenodd" 
  />
)