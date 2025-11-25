"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Field, FieldError } from "@/components/ui/field"
// import { SelectFloating, type SelectFloatingItem } from "@/components/ui/select-floating"
// import { useIsMobile } from "@/hooks/use-mobile"

type SelectFloatingItem = {
  value: string
  label: string
}

const inputFloatingVariants = cva(
  "border-input/75 border-1 font-semibold flex items-center justify-start relative flex w-full min-w-0 bg-input/5 shadow-xs transition-[color,box-shadow] outline-none",
  {
    variants: {
      size: {
        default: "h-16 px-4 pt-4.5",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

interface InputFloatingProps
  extends Omit<React.ComponentProps<"input">, "size">,
    VariantProps<typeof inputFloatingVariants> {
  label: string
  mask?: (value: string) => string
  icon?: React.ReactNode
  errors?: Array<{ message?: string } | undefined>
  fieldClassName?: string
  mobileOptions?: SelectFloatingItem[]
  smallText?: boolean
  drawerTitle?: string
  mobileDefaultValue?: string
}

const InputFloating = React.forwardRef<HTMLInputElement, InputFloatingProps>(
  ({ className, type, size = "default", label, value, defaultValue, onChange, onBlur, onFocus, mask, icon, errors, fieldClassName, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false)
    const [isKeyboardFocus, setIsKeyboardFocus] = React.useState(false)
    const inputRef = React.useRef<HTMLInputElement>(null)
    
    const isControlled = value !== undefined
    const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue ?? "")

    React.useImperativeHandle(ref, () => inputRef.current!)

    React.useEffect(() => {
      if (!isControlled && inputRef.current?.value) {
        setUncontrolledValue(inputRef.current.value)
      }
    }, [isControlled])

    const currentValue = isControlled ? (value ?? "") : uncontrolledValue
    const isFloating = isFocused || currentValue !== ""

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true)
      const isKeyboard = e.currentTarget.matches(':focus-visible')
      setIsKeyboardFocus(isKeyboard)
      onFocus?.(e)
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false)
      setIsKeyboardFocus(false)
      onBlur?.(e)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = mask ? mask(e.target.value) : e.target.value
      
      if (!isControlled) {
        setUncontrolledValue(newValue)
      }
      
      if (onChange) {
        e.target.value = newValue
        onChange(e)
      }
    }

    const handleContainerClick = () => {
      inputRef.current?.focus()
    }



    const inputSizeClass = "text-base md:text-base h-full"



    return (
      <Field className={fieldClassName}>
        <div 
          data-slot="input-floating"
          className={cn(
            inputFloatingVariants({ size, className }),
            isKeyboardFocus && "border-ring ring-1 ring-ring/80"
          )}
          onClick={handleContainerClick}
        >
          <label
            className={cn(
              "text-muted-foreground/75 pointer-events-none absolute left-4 -translate-y-1/2 origin-top-left font-[490] select-none transition-all duration-100",
              isFloating ? "top-5.5 scale-75" : "top-1/2 scale-100"
            )}
          >
            {label}
          </label>
          <input
            ref={inputRef}
            type={type}
            data-slot="input"
            className={cn(
              "placeholder:text-muted-foreground/50 selection:bg-primary selection:text-primary-foreground file:text-foreground w-full min-w-0 bg-transparent outline-none transition-colors file:inline-flex file:border-0 file:bg-transparent file:font-medium  disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 autofill:!bg-transparent autofill:shadow-[inset_0_0_0_1000px_transparent]",
              inputSizeClass
            )}
            value={isControlled ? (value ?? "") : undefined}
            defaultValue={!isControlled ? defaultValue : undefined}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleChange}
            {...props}
          />
          {icon && (
            <div className="absolute right-3 flex items-center justify-center top-3 bottom-3">
              {icon}
            </div>
          )}
        </div>
        <FieldError errors={errors} />
      </Field>
    )
  }
)

InputFloating.displayName = "InputFloating"

export { InputFloating }

