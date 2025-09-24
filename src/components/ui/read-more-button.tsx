import { CaretRightIcon } from "@phosphor-icons/react/dist/ssr"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type ReadMoreButtonProps = {
  className?: string
}

export function ReadMoreButton({ className }: ReadMoreButtonProps) {
  return (
    <Button
      variant="link"
      className={cn(
        "font-body text-accent-foreground p-0 text-xs font-light group no-underline hover:no-underline", // 👈 disables underline
        className
      )}
    >
      <span className="flex items-center">
        Read more
        <CaretRightIcon
          className="ml-1 h-3 w-3 transition-transform duration-300 group-hover:translate-x-1"
          aria-hidden="true"
        />
      </span>
    </Button>
  )
}