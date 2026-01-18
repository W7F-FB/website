"use client"

import * as React from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller } from "react-hook-form"
import { useAppForm } from "@/hooks/use-app-form"

import { GradientBanner } from "@/components/ui/gradient-banner"
import { cn } from "@/lib/utils"
import { H2, P, Subtitle } from "../website-base/typography"
import { Separator } from "../ui/separator"
import { Background } from "@/components/ui/background"
import { PalmtreeIcon } from "../website-base/icons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { FormMessageSuccess } from "@/components/ui/form-message-success"

const schema = z.object({
    email: z
        .string()
        .trim()
        .min(1, { message: "Email is required" })
        .email({ message: "Invalid email" }),
})

const KLAVIYO_LIST_ID = "UrjmkJ"

interface StayUpdatedBannerProps extends React.ComponentProps<typeof GradientBanner> {}

const StayUpdatedBanner = React.forwardRef<
    HTMLDivElement,
    StayUpdatedBannerProps
>(({ className, ...props }, ref) => {
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
        <GradientBanner
            ref={ref}
            data-slot="stay-updated-banner"
            className={cn("flex lg:flex-row flex-col relative overflow-hidden lg:gap-0 gap-6", className)}
            {...props}
        >
            <div className="pr-12 relative">
                <Subtitle className="mb-4 text-muted-foreground lg:whitespace-nowrap">Stay in the Know</Subtitle>
                <H2 variant="h1" className="lg:text-6xl text-5xl mb-5">Get <span className="text-primary">Updates</span></H2>
                <P className="text-xl uppercase">Early access to tickets, giveaways, and more.</P>
            </div>
            <Separator variant="gradient" orientation="vertical" className="!h-auto" />
            <div className="lg:px-12 flex flex-col gap-2 relative flex-1">
                <Subtitle className="text-xl mb-2">Join the <span className="text-primary whitespace-nowrap">W7F Fan Club</span></Subtitle>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full flex-row gap-2" noValidate>
                    <Controller
                        control={form.control}
                        name="email"
                        render={({ field, fieldState }) => (
                            <Field className="w-full" data-invalid={!!fieldState.error}>
                                <FieldLabel htmlFor="stay-updated-email" className="sr-only">Email</FieldLabel>
                                <Input
                                    id="stay-updated-email"
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
                    <Button type="submit" size="skew" aria-label="Subscribe" className="shrink-0 px-6 min-w-50 h-12" disabled={isLoading}>
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
        </GradientBanner>
    )
})

StayUpdatedBanner.displayName = "StayUpdatedBanner"

export { StayUpdatedBanner }
