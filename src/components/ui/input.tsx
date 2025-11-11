import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const inputVariants = cva(
  "file:text-foreground placeholder:text-muted-foreground/50 placeholder:font-medium selection:bg-primary selection:text-primary-foreground flex min-w-0 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm font-semibold",
  {
    variants: {
      variant: {
        default: "dark:bg-input/30 border-input h-9 w-full rounded-none border-b bg-transparent px-3 py-1 focus-visible:border-primary/50 focus-visible:ring-none focus-visible:ring-[0px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        skew: "absolute h-auto w-auto top-0 bottom-0 -left-4 -right-4 border-b-0 px-10 leading-none py-0 bg-transparent dark:bg-transparent"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
)

export interface InputProps
  extends React.ComponentProps<"input">,
    VariantProps<typeof inputVariants> {}

function Input({ className, type, variant, ...props }: InputProps) {
  if (variant === "skew") {
    return (
      <div className="-skew-x-[var(--skew-btn)] group overflow-hidden relative h-12 w-full border-b border-input transition-colors focus-within:border-primary/50 bg-transparent dark:bg-input/30">
        <div className="skew-x-[var(--skew-btn)] h-full">
          <input
            type={type}
            data-slot="input"
            className={cn(inputVariants({ variant, className }))}
            {...props}
          />
        </div>
      </div>
    )
  }

  return (
    <input
      type={type}
      data-slot="input"
      className={cn(inputVariants({ variant, className }))}
      {...props}
    />
  )
}

export { Input }
