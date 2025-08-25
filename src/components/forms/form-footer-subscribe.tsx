"use client"

import * as React from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { FormMessageSuccess } from "@/components/forms/form-message-success"

const schema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { message: "Email is required" })
    .email({ message: "Enter a valid email" }),
})

export function FormFooterSubscribe() {
  const [submitted, setSubmitted] = React.useState<string | null>(null)

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
    mode: "onSubmit",
  })

  async function onSubmit(values: z.infer<typeof schema>) {
    setSubmitted(null)
    await new Promise((r) => setTimeout(r, 300))
    setSubmitted(`Subscribed ${values.email}`)
    form.reset()
  }

  return (
    <div className="w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full flex-col gap-2 sm:flex-row">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="sr-only">Email</FormLabel>
                <FormControl>
                  <Input
                    variant="skew"
                    type="email"
                    placeholder="Enter your email*"
                    autoComplete="email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" size="skew" aria-label="Subscribe" className="shrink-0 px-6">
            <span>Subscribe</span>
          </Button>
        </form>
      </Form>
      {submitted ? (
        <FormMessageSuccess className="mt-2">{submitted}</FormMessageSuccess>
      ) : null}
    </div>
  )
}

export default FormFooterSubscribe


