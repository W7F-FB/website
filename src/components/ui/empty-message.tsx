import { cn } from "@/lib/utils"

interface EmptyMessageProps {
  children: React.ReactNode
  className?: string
}

export function EmptyMessage({ children, className }: EmptyMessageProps) {
  return (
    <div className={cn("bg-muted/20 text-muted-foreground py-12 px-8 text-center", className)}>
      {children}
    </div>
  )
}
