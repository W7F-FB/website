import { SVGProps } from 'react'
import { cn } from '@/lib/utils'

interface BgLinesProps extends SVGProps<SVGSVGElement> {
  size?: number | string
  id?: string
}

export const BgLines = ({ size, className, fill = '#fff', id = 'bg-lines-pattern', ...props }: BgLinesProps & { fill?: string }) => (
  <svg
    id={id}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 755.73 755.73"
    width={size}
    height={size}
    className={cn("shrink-0", className)}
    {...props}
  >
    <g >
      <g>
        <path
          d="M629.775,0h125.955L0,755.73v-125.955L629.775,0Z"
          fill={fill}
          fillRule="evenodd"
        />
        <path
          d="M755.73,629.775v125.955h-125.955l125.955-125.955Z"
          fill={fill}
          fillRule="evenodd"
        />
      </g>
    </g>
  </svg>
)

BgLines.displayName = "BgLines"

export const getBgLinesPattern = (fill: string = 'currentColor', opacity: number = 1) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 755.73 755.73"><path d="M629.775,0h125.955L0,755.73v-125.955L629.775,0Z" fill="${fill}" fill-opacity="${opacity}" fill-rule="evenodd"/><path d="M755.73,629.775v125.955h-125.955l125.955-125.955Z" fill="${fill}" fill-opacity="${opacity}" fill-rule="evenodd"/></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}
