import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { CaretRightIcon } from "../website-base/icons"

type ReadMoreButtonProps = {
  className?: string
  size?: "default" | "sm"
}

export function ReadMoreButton({ className, size = "default" }: ReadMoreButtonProps) {
  return (
    <Button
      variant="link"
      className={cn(
        "h-auto p-0 group no-underline hover:no-underline text-foreground/80 group-hover/post:text-foreground",
        size === "sm" ? "font-normal text-xs" : "font-medium text-sm",
        className
      )}
    >
      <span className="flex items-center gap-1.5">
        <span className="">Read more</span>
        <CaretRightIcon
          className={cn(
            "mt-0.5 transition-transform duration-300 ",
            size === "sm" ? "size-2.5 group-hover/post:translate-x-0.5" : "size-3 group-hover/post:translate-x-1"
          )}
          aria-hidden="true"
        />
      </span>
    </Button>
  )
}