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

const KLAVIYO_LIST_ID = "UrjmkJ"

export function FormFooterSubscribe() {
  const [submitted, setSubmitted] = React.useState<string | null>(null)
  const [error, setError] = React.useState<string | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)

  const form = useAppForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  })

  async function onSubmit(values: z.infer<typeof schema>) {
    setSubmitted(null)
    setError(null)
    setIsLoading(true)

    try {
      const response = await fetch("/api/klaviyo/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: values.email, listId: KLAVIYO_LIST_ID }),
      })

      if (!response.ok) {
        throw new Error("Failed to subscribe")
      }

      setSubmitted("Thanks for subscribing!")
      form.reset()
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full">
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full flex-row gap-2" noValidate>
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
                className="bg-muted/50 border-muted focus-within:border-muted-foreground/50 pt-0.5"
                {...field}
              />
              <FieldError errors={fieldState.error ? [fieldState.error] : undefined} />
            </Field>
          )}
        />
        <Button type="submit" size="skew" aria-label="Subscribe" className="shrink-0 px-6 h-12" disabled={isLoading}>
          <span>{isLoading ? "Subscribing..." : "Subscribe"}</span>
        </Button>
      </form>
      {submitted && (
        <FormMessageSuccess className="mt-2">{submitted}</FormMessageSuccess>
      )}
      {error && (
        <p className="mt-2 text-sm text-destructive">{error}</p>
      )}
    </div>
  )
}

export default FormFooterSubscribe


