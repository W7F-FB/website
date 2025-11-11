"use client"

import * as React from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller } from "react-hook-form"
import { useAppForm } from "@/hooks/use-app-form"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Field,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"
import { FormMessageSuccess } from "@/components/ui/form-message-success"

const schema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email" }),
})

export function FormFooterSubscribe() {
  const [submitted, setSubmitted] = React.useState<string | null>(null)

  const form = useAppForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  })

  async function onSubmit(values: z.infer<typeof schema>) {
    setSubmitted(null)
    await new Promise((r) => setTimeout(r, 300))
    setSubmitted(`Subscribed ${values.email}`)
    form.reset()
  }

  return (
    <div className="w-full">
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full flex-col gap-2 sm:flex-row" noValidate>
        <Controller
          control={form.control}
          name="email"
          render={({ field, fieldState }) => (
            <Field className="w-full" data-invalid={!!fieldState.error}>
              <FieldLabel htmlFor="email" className="sr-only">Email</FieldLabel>
              <Input
                id="email"
                variant="skew"
                type="email"
                placeholder="Enter your email*"
                autoComplete="email"
                {...field}
              />
              <FieldError errors={fieldState.error ? [fieldState.error] : undefined} />
            </Field>
          )}
        />
        <Button type="submit" size="skew" aria-label="Subscribe" className="shrink-0 px-6 h-12">
          <span>Subscribe</span>
        </Button>
      </form>
      {submitted ? (
        <FormMessageSuccess className="mt-2">{submitted}</FormMessageSuccess>
      ) : null}
    </div>
  )
}

export default FormFooterSubscribe


