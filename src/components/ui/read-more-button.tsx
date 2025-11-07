import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { CaretRightIcon } from "../website-base/icons"

type ReadMoreButtonProps = {
  className?: string
}

export function ReadMoreButton({ className }: ReadMoreButtonProps) {
  return (
    <Button
      variant="link"
      className={cn(
        "h-auto p-0 font-medium text-sm group no-underline hover:no-underline text-foreground/80 group-hover:text-foreground",
        className
      )}
    >
      <span className="flex items-center gap-1.5">
        <span className="">Read more</span>
        <CaretRightIcon
          className="mt-0.5 size-3 transition-transform duration-300 group-hover:translate-x-1"
          aria-hidden="true"
        />
      </span>
    </Button>
  )
}