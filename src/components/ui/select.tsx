"use client"

import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react"
import { CaretFilledIcon, CaretRightIcon, DeleteIcon } from "@/components/website-base/icons"

import { cn } from "@/lib/utils"

type SelectContextValue = {
  clearable: boolean
  hasValue: boolean
  onClear?: () => void
  disabled?: boolean
}

const SelectContext = React.createContext<SelectContextValue | null>(null)

type SelectProps = React.ComponentProps<typeof SelectPrimitive.Root> & {
  clearable?: boolean
}

function Select(props: SelectProps) {
  const {
    clearable = false,
    value: valueProp,
    defaultValue = "",
    onValueChange,
    children,
    disabled,
    ...rest
  } = props
  const hasValueProp = Object.prototype.hasOwnProperty.call(props, "value")
  const isControlled = hasValueProp
  const [internalValue, setInternalValue] = React.useState(
    isControlled ? valueProp ?? "" : defaultValue ?? ""
  )
  React.useEffect(() => {
    if (isControlled) {
      setInternalValue(valueProp ?? "")
    }
  }, [isControlled, valueProp])
  const currentValue = isControlled ? valueProp ?? "" : internalValue ?? ""
  const handleValueChange = React.useCallback(
    (nextValue: string) => {
      if (!isControlled) {
        setInternalValue(nextValue ?? "")
      }
      onValueChange?.(nextValue)
    },
    [isControlled, onValueChange]
  )
  const handleClear = React.useCallback(() => {
    handleValueChange("")
  }, [handleValueChange])
  const contextValue = React.useMemo(
    () => ({
      clearable,
      hasValue: currentValue !== undefined && currentValue !== "",
      onClear: clearable ? handleClear : undefined,
      disabled,
    }),
    [clearable, currentValue, handleClear, disabled]
  )
  return (
    <SelectContext.Provider value={contextValue}>
      <SelectPrimitive.Root
        data-slot="select"
        value={currentValue}
        onValueChange={handleValueChange}
        disabled={disabled}
        {...rest}
      >
        {children}
      </SelectPrimitive.Root>
    </SelectContext.Provider>
  )
}

function SelectGroup({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Group>) {
  return <SelectPrimitive.Group data-slot="select-group" {...props} />
}

function SelectValue({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Value>) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />
}

function SelectTrigger({
  className,
  size = "default",
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger> & {
  size?: "sm" | "default" | "lg" | "tableHeader"
}) {
  const context = React.useContext(SelectContext)
  const showClear =
    !!context &&
    context.clearable &&
    context.hasValue &&
    !!context.onClear &&
    !context.disabled &&
    !props.disabled
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-size={size}
      className={cn(
        "border-input hover:bg-extra-muted hover:has-[.clear-button:hover]:bg-input/5 border-1 font-medium data-[placeholder]:text-muted-foreground/75 [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive flex w-full items-center justify-between gap-2 bg-input/5 px-4 text-base whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none disabled:cursor-not-allowed disabled:opacity-50 data-[size=lg]:h-16 data-[size=default]:h-12 data-[size=sm]:h-8 data-[size=tableHeader]:h-auto data-[size=tableHeader]:w-auto data-[size=tableHeader]:border-0 data-[size=tableHeader]:bg-transparent data-[size=tableHeader]:px-0 data-[size=tableHeader]:py-0 data-[size=tableHeader]:shadow-none data-[size=tableHeader]:rounded-none data-[size=tableHeader]:gap-1 data-[size=tableHeader]:font-inherit data-[size=tableHeader]:text-inherit data-[size=tableHeader]:justify-between data-[size=tableHeader]:focus-visible:ring-0 data-[size=tableHeader]:focus-visible:border-0 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 pr-12 relative",
        showClear && "",
        className
      )}
      {...props}
    >
      {children}
      {showClear ? (
        <div
          className="absolute right-2 top-1/2 -translate-y-1/2 clear-button text-muted-foreground/80 hover:text-foreground hover:bg-muted/20 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 rounded-sm p-2 border-input/30 border-1"
          role="button"
          onPointerDown={(event) => {
            event.preventDefault()
            event.stopPropagation()
          }}
          onClick={(event) => {
            event.preventDefault()
            event.stopPropagation()
            context?.onClear?.()
          }}
          aria-label="Clear selection"
        >
          <DeleteIcon className="size-3" />
        </div>
      ) : (
        <SelectPrimitive.Icon asChild>
          {size === "tableHeader" ? (
            <CaretFilledIcon className="size-3 rotate-90" />
          ) : (
            <CaretRightIcon className="caret-icon size-3.5 opacity-50 rotate-90 absolute right-3 top-1/2 -translate-y-1/2" />
          )}
        </SelectPrimitive.Icon>
      )}
    </SelectPrimitive.Trigger>
  )
}

function SelectContent({
  className,
  children,
  position = "popper",
  align = "center",
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        className={cn(
          "bg-card text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto border shadow-md",
          position === "popper" &&
          "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
          className
        )}
        position={position}
        align={align}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport
          className={cn(
            "p-1",
            position === "popper" &&
            "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)] scroll-my-1"
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
}

function SelectLabel({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
      data-slot="select-label"
      className={cn("text-muted-foreground px-2 py-1.5 text-xs", className)}
      {...props}
    />
  )
}

function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        "focus:bg-muted/50 focus:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm pt-2.5 pb-2 pr-8 pl-2 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
        className
      )}
      {...props}
    >
      <span className="absolute right-2 flex size-3.5 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <CheckIcon className="size-4" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  )
}

function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn("bg-border pointer-events-none -mx-1 my-1 h-px", className)}
      {...props}
    />
  )
}

function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
  return (
    <SelectPrimitive.ScrollUpButton
      data-slot="select-scroll-up-button"
      className={cn(
        "flex cursor-default items-center justify-center py-1",
        className
      )}
      {...props}
    >
      <ChevronUpIcon className="size-4" />
    </SelectPrimitive.ScrollUpButton>
  )
}

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
  return (
    <SelectPrimitive.ScrollDownButton
      data-slot="select-scroll-down-button"
      className={cn(
        "flex cursor-default items-center justify-center py-1",
        className
      )}
      {...props}
    >
      <ChevronDownIcon className="size-4" />
    </SelectPrimitive.ScrollDownButton>
  )
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
}
