import { useEffect } from "react"
import { useForm, UseFormProps, UseFormReturn, FieldValues, Path } from "react-hook-form"

export function useAppForm<TFieldValues extends FieldValues = FieldValues>(
  options?: UseFormProps<TFieldValues>
): UseFormReturn<TFieldValues> {
  const form = useForm<TFieldValues>({
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    ...options,
  })

  const { watch, formState, clearErrors } = form
  const { errors, isSubmitted } = formState

  useEffect(() => {
    if (!isSubmitted) return

    const subscription = watch((value, { name }) => {
      if (name && errors[name as Path<TFieldValues>]) {
        clearErrors(name as Path<TFieldValues>)
      }
    })

    return () => subscription.unsubscribe()
  }, [watch, clearErrors, errors, isSubmitted])

  return form
}

