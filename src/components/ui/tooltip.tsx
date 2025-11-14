"use client"

import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"

import { cn } from "@/lib/utils"
import { InformationCircleIcon } from "@/components/website-base/icons"

function useHasHover() {
  try {
    return matchMedia('(hover: hover)').matches;
  } catch {
    return true;
  }
}

type TooltipTriggerContextType = {
  supportMobileTap: boolean;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const TooltipTriggerContext = React.createContext<TooltipTriggerContextType>({
  supportMobileTap: true,
  open: false,
  setOpen: () => { },
});

function TooltipProvider({
  delayDuration = 0,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delayDuration={delayDuration}
      {...props}
    />
  )
}

function Tooltip({
  supportMobileTap = true,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Root> & { supportMobileTap?: boolean }) {
  const [open, setOpen] = React.useState<boolean>(props.defaultOpen ?? false);
  const hasHover = useHasHover();

  return (
    <TooltipProvider>
      <TooltipPrimitive.Root
        data-slot="tooltip"
        delayDuration={!hasHover && supportMobileTap ? 0 : props.delayDuration}
        onOpenChange={setOpen}
        open={open}
        {...props}
      >
        <TooltipTriggerContext.Provider
          value={{
            open,
            setOpen,
            supportMobileTap,
          }}
        >
          {props.children}
        </TooltipTriggerContext.Provider>
      </TooltipPrimitive.Root>
    </TooltipProvider>
  )
}

function TooltipTrigger({
  children,
  className,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
  const hasHover = useHasHover();
  const { setOpen, supportMobileTap } = React.useContext(TooltipTriggerContext);

  const { onClick: onClickProp } = props;

  const onClick = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!hasHover && supportMobileTap) {
        e.preventDefault();
        setOpen(true);
      } else {
        onClickProp?.(e);
      }
    },
    [setOpen, hasHover, supportMobileTap, onClickProp],
  );

  const hasChildren = React.Children.count(children) > 0

  if (hasChildren) {
    return (
      <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} className={className} onClick={onClick} asChild>
        {children}
      </TooltipPrimitive.Trigger>
    )
  }

  return (
    <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} onClick={onClick}>
      <InformationCircleIcon size={16} className={cn("text-muted-foreground/40 hover:text-muted-foreground", className)} />
    </TooltipPrimitive.Trigger>
  )
}

function TooltipContent({
  className,
  sideOffset = 12,
  children,
  header,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content> & { header?: React.ReactNode }) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        className={cn(
          "max-w-48 bg-muted text-foreground border-1 border-border/50 animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-fit origin-(--radix-tooltip-content-transform-origin) rounded-md  text-xs text-balance",
          className
        )}
        {...props}
      >
        {header && (
          <div className="font-semibold mb-1 px-3 pt-1.5 pb-1 bg-muted-foreground/5">
            {header}
          </div>
        )}
        <div className={cn("px-3 pt-2 pb-1.5", header && "pt-1")}>
          {children}
        </div>
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  )
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
