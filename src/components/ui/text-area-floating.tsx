"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Field, FieldError } from "@/components/ui/field"

const textAreaFloatingVariants = cva(
  "border-input/50 border-2 font-semibold flex items-start justify-start relative flex w-full min-w-0 rounded-md bg-input/5 shadow-xs transition-[color,box-shadow] outline-none",
  {
    variants: {
      size: {
        default: "min-h-32 px-4 pt-4.5",
        lg: "min-h-40 px-4 pt-4.5",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

interface TextAreaFloatingProps
  extends Omit<React.ComponentProps<"textarea">, "size">,
    VariantProps<typeof textAreaFloatingVariants> {
  label: string
  errors?: Array<{ message?: string } | undefined>
  fieldClassName?: string
}

const TextAreaFloating = React.forwardRef<HTMLTextAreaElement, TextAreaFloatingProps>(
  ({ className, size = "default", label, value, defaultValue, onChange, onBlur, onFocus, errors, fieldClassName, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false)
    const [isKeyboardFocus, setIsKeyboardFocus] = React.useState(false)
    const textAreaRef = React.useRef<HTMLTextAreaElement>(null)
    
    const isControlled = value !== undefined
    const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue ?? "")

    React.useImperativeHandle(ref, () => textAreaRef.current!)

    React.useEffect(() => {
      if (!isControlled && textAreaRef.current?.value) {
        setUncontrolledValue(textAreaRef.current.value)
      }
    }, [isControlled])

    const currentValue = isControlled ? (value ?? "") : uncontrolledValue
    const isFloating = isFocused || currentValue !== ""

    const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      setIsFocused(true)
      const isKeyboard = e.currentTarget.matches(':focus-visible')
      setIsKeyboardFocus(isKeyboard)
      onFocus?.(e)
    }

    const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      setIsFocused(false)
      setIsKeyboardFocus(false)
      onBlur?.(e)
    }

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value
      
      if (!isControlled) {
        setUncontrolledValue(newValue)
      }
      
      if (onChange) {
        onChange(e)
      }
    }

    const handleContainerClick = () => {
      textAreaRef.current?.focus()
    }

    const textAreaSizeClass = "text-base md:text-base min-h-full py-2"

    return (
      <Field className={fieldClassName}>
        <div 
          data-slot="textarea-floating"
          className={cn(
            textAreaFloatingVariants({ size, className }),
            isKeyboardFocus && "border-ring/50 ring-1 ring-ring/20"
          )}
          onClick={handleContainerClick}
        >
          <label
            className={cn(
              "text-muted-foreground/75 pointer-events-none absolute left-4 -translate-y-1/2 origin-top-left font-[490] select-none transition-all duration-100",
              isFloating ? "top-5.5 scale-75" : "top-8 scale-100"
            )}
          >
            {label}
          </label>
          <textarea
            ref={textAreaRef}
            data-slot="textarea"
            className={cn(
              "placeholder:text-muted-foreground/50 selection:bg-primary selection:text-primary-foreground w-full min-w-0 bg-transparent outline-none transition-colors disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 resize-none",
              textAreaSizeClass
            )}
            value={isControlled ? (value ?? "") : undefined}
            defaultValue={!isControlled ? defaultValue : undefined}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleChange}
            {...props}
          />
        </div>
        <FieldError errors={errors} />
      </Field>
    )
  }
)

TextAreaFloating.displayName = "TextAreaFloating"

export { TextAreaFloating }

