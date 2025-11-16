import { cn } from "@/lib/utils"

interface FastDashProps {
  className?: string
}

export function FastDash({ className }: FastDashProps) {
  return (
    <div className={cn("flex items-center gap-px -skew-x-[var(--skew-btn)]", className)}>
      <div className="w-0.5 h-0.5 bg-muted-foreground/75"></div>
      <div className="w-0.5 h-0.5 bg-muted-foreground/75"></div>
      <div className="w-0.5 h-0.5 bg-muted-foreground/75"></div>
    </div>
  )
}

