"use client"

import * as React from "react"
import { Combobox as ComboboxPrimitive } from "@base-ui/react"
import { ChevronDownIcon, XIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { inputFloatingVariants } from "@/components/ui/input-floating"
import { Field, FieldError } from "@/components/ui/field"

interface ComboboxFloatingProps {
  label: string
  className?: string
  fieldClassName?: string
  size?: "default"

  // Combobox root props
  value?: string | null
  defaultValue?: string | null
  onValueChange?: (
    value: string | null,
    eventDetails: ComboboxPrimitive.Root.ChangeEventDetails
  ) => void
  items?: readonly string[]
  filter?: ((item: string, query: string) => boolean) | null
  disabled?: boolean
  name?: string

  // Input behavior
  onBlur?: React.FocusEventHandler<HTMLInputElement>
  onFocus?: React.FocusEventHandler<HTMLInputElement>

  // Addons
  startAddon?: React.ReactNode
  showTrigger?: boolean
  showClear?: boolean

  // Validation
  errors?: Array<{ message?: string } | undefined>

  // Dropdown content
  children: React.ReactNode
}

const ComboboxFloating = React.forwardRef<HTMLInputElement, ComboboxFloatingProps>(
  (
    {
      label,
      className,
      fieldClassName,
      size = "default",
      value,
      defaultValue,
      onValueChange,
      items,
      filter,
      disabled = false,
      name,
      onBlur,
      onFocus,
      startAddon,
      showTrigger = true,
      showClear = false,
      errors,
      children,
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = React.useState(false)
    const [isKeyboardFocus, setIsKeyboardFocus] = React.useState(false)
    const [inputText, setInputText] = React.useState("")
    const inputRef = React.useRef<HTMLInputElement>(null)

    // Track uncontrolled value for floating label
    const isControlled = value !== undefined
    const [internalValue, setInternalValue] = React.useState(defaultValue ?? null)
    const currentValue = isControlled ? value : internalValue

    React.useImperativeHandle(ref, () => inputRef.current!)

    const hasValue = currentValue != null && currentValue !== ""
    const isFloating = isFocused || hasValue || inputText !== ""

    const handleValueChange = (
      newValue: string | null,
      eventDetails: ComboboxPrimitive.Root.ChangeEventDetails
    ) => {
      if (!isControlled) {
        setInternalValue(newValue)
      }
      onValueChange?.(newValue, eventDetails)
    }

    const handleInputValueChange = (inputValue: string) => {
      setInputText(inputValue)
    }

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true)
      const isKeyboard = e.currentTarget.matches(":focus-visible")
      setIsKeyboardFocus(isKeyboard)
      onFocus?.(e)
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false)
      setIsKeyboardFocus(false)
      onBlur?.(e)
    }

    const handleContainerClick = () => {
      inputRef.current?.focus()
    }

    return (
      <Field className={fieldClassName}>
        <ComboboxPrimitive.Root
          value={isControlled ? value : undefined}
          defaultValue={!isControlled ? defaultValue : undefined}
          onValueChange={handleValueChange}
          onInputValueChange={handleInputValueChange}
          items={items}
          filter={filter}
          disabled={disabled}
          name={name}
        >
          <div
            data-slot="combobox-floating"
            className={cn(
              '[&_input]:pt-0.5',
              inputFloatingVariants({ size, className }),
              isKeyboardFocus && "border-ring ring-1 ring-ring/80 "
            )}
            onClick={handleContainerClick}
          >
            <label
              className={cn(
                "text-muted-foreground/75 pointer-events-none absolute -translate-y-1/2 origin-top-left font-[490] select-none transition-all duration-100",
                "left-4",
                isFloating ? "top-5.5 scale-75" : "top-1/2 scale-100"
              )}
            >
              {label}
            </label>
            {startAddon && (
              <div className="mr-2 flex shrink-0 items-center">{startAddon}</div>
            )}
            <ComboboxPrimitive.Input
              ref={inputRef}
              data-slot="input"
              className="placeholder:text-muted-foreground/50 selection:bg-primary selection:text-primary-foreground w-full min-w-0 bg-transparent font-normal text-base outline-none transition-colors disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-base h-full pr-10"
              onFocus={handleFocus}
              onBlur={handleBlur}
              disabled={disabled}
            />
            <div className="absolute right-2 top-0 bottom-0 flex items-center gap-0.5">
              {showClear && (
                <ComboboxPrimitive.Clear
                  data-slot="combobox-clear"
                  className="text-muted-foreground hover:text-foreground inline-flex size-7 items-center justify-center rounded-sm transition-colors"
                  disabled={disabled}
                >
                  <XIcon className="pointer-events-none size-4" />
                </ComboboxPrimitive.Clear>
              )}
              {showTrigger && (
                <ComboboxPrimitive.Trigger
                  data-slot="combobox-trigger"
                  className="text-muted-foreground hover:text-foreground inline-flex size-7 items-center justify-center rounded-sm transition-colors"
                  disabled={disabled}
                >
                  <ChevronDownIcon className="pointer-events-none size-4" />
                </ComboboxPrimitive.Trigger>
              )}
            </div>
          </div>
          {children}
        </ComboboxPrimitive.Root>
        <FieldError errors={errors} />
      </Field>
    )
  }
)

ComboboxFloating.displayName = "ComboboxFloating"

export { ComboboxFloating }
