"use client"

import * as React from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller } from "react-hook-form"
import { useAppForm } from "@/hooks/use-app-form"
import countries from "world-countries"

import ReactCountryFlag from "react-country-flag"

import { GradientBanner } from "@/components/ui/gradient-banner"
import { cn } from "@/lib/utils"
import { H2, P, Subtitle } from "../website-base/typography"
import { Separator } from "../ui/separator"
import { Button } from "@/components/ui/button"
import { InputFloating } from "@/components/ui/input-floating"
import { FormMessageSuccess } from "@/components/ui/form-message-success"
import { ComboboxFloating } from "@/components/ui/combobox-floating"
import {
    ComboboxContent,
    ComboboxList,
    ComboboxItem,
    ComboboxEmpty,
} from "@/components/ui/combobox"

const schema = z.object({
    firstName: z.string().trim().min(1, { message: "First name is required" }),
    lastName: z.string().trim().min(1, { message: "Last name is required" }),
    email: z
        .string()
        .trim()
        .min(1, { message: "Email is required" })
        .email({ message: "Invalid email" }),
    country: z.string().trim().min(1, { message: "Country is required" }),
    favoriteClub: z.string().trim().optional(),
})

const KLAVIYO_LIST_ID = "UrjmkJ"

const COUNTRY_DATA = countries
    .map((c) => ({ name: c.name.common, code: c.cca2 }))
    .sort((a, b) => a.name.localeCompare(b.name))

const COUNTRY_NAMES = COUNTRY_DATA.map((c) => c.name)

const COUNTRY_CODE_MAP = new Map(COUNTRY_DATA.map((c) => [c.name, c.code]))

const StayUpdatedBanner = React.forwardRef<
    HTMLDivElement,
    React.ComponentProps<typeof GradientBanner>
>(({ className, ...props }, ref) => {
    const [submitted, setSubmitted] = React.useState<string | null>(null)
    const [error, setError] = React.useState<string | null>(null)
    const [isLoading, setIsLoading] = React.useState(false)

    const form = useAppForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: { firstName: "", lastName: "", email: "", country: "", favoriteClub: "" },
    })

    async function onSubmit(values: z.infer<typeof schema>) {
        setSubmitted(null)
        setError(null)
        setIsLoading(true)

        try {
            const response = await fetch("/api/klaviyo/subscribe", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: values.email,
                    firstName: values.firstName,
                    lastName: values.lastName,
                    country: values.country,
                    favoriteClub: values.favoriteClub,
                    listId: KLAVIYO_LIST_ID,
                }),
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
            <div className="lg:px-12 flex flex-col gap-3 relative flex-1">
                <Subtitle className="text-xl mb-1">Join the <span className="text-primary whitespace-nowrap">W7F Supporter Club</span></Subtitle>
                <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-2 gap-2" noValidate>
                    {/* Row 1: First Name | Last Name */}
                    <Controller
                        control={form.control}
                        name="firstName"
                        render={({ field, fieldState }) => (
                            <InputFloating
                                label="First Name*"
                                autoComplete="given-name"
                                errors={fieldState.error ? [fieldState.error] : undefined}
                                {...field}
                            />
                        )}
                    />
                    <Controller
                        control={form.control}
                        name="lastName"
                        render={({ field, fieldState }) => (
                            <InputFloating
                                label="Last Name*"
                                autoComplete="family-name"
                                errors={fieldState.error ? [fieldState.error] : undefined}
                                {...field}
                            />
                        )}
                    />

                    {/* Row 2: Country (combobox) | Favorite Club */}
                    <Controller
                        control={form.control}
                        name="country"
                        render={({ field, fieldState }) => (
                            <ComboboxFloating
                                label="Country*"
                                
                                value={field.value}
                                onValueChange={field.onChange}
                                onBlur={field.onBlur}
                                items={COUNTRY_NAMES}
                                errors={fieldState.error ? [fieldState.error] : undefined}
                                startAddon={field.value && COUNTRY_CODE_MAP.get(field.value) && (
                                    <ReactCountryFlag
                                        countryCode={COUNTRY_CODE_MAP.get(field.value)!}
                                        svg
                                        className="!w-4.5 h-3.5 rounded-sm object-cover ring-1 ring-border/50"
                                    />
                                )}
                            >
                                <ComboboxContent className="w-auto">
                                    <ComboboxEmpty>No countries found</ComboboxEmpty>
                                    <ComboboxList>
                                        {(name: string) => (
                                            <ComboboxItem key={name} value={name}>
                                                {COUNTRY_CODE_MAP.get(name) && (
                                                    <ReactCountryFlag
                                                        countryCode={COUNTRY_CODE_MAP.get(name)!}
                                                        svg
                                                        className="!w-4.5 h-3.5 rounded-sm object-cover ring-1 ring-border/50"
                                                    />
                                                )}
                                                <span className="mt-0.5">{name}</span>
                                            </ComboboxItem>
                                        )}
                                    </ComboboxList>
                                </ComboboxContent>
                            </ComboboxFloating>
                        )}
                    />
                    <Controller
                        control={form.control}
                        name="favoriteClub"
                        render={({ field, fieldState }) => (
                            <InputFloating
                            
                                label="Favorite Club"
                                autoComplete="off"
                                errors={fieldState.error ? [fieldState.error] : undefined}
                                {...field}
                            />
                        )}
                    />

                    {/* Row 3: Email + Subscribe (spans 2 cols) */}
                    <div className="col-span-2 flex flex-row gap-2">
                        <Controller
                            control={form.control}
                            name="email"
                            render={({ field, fieldState }) => (
                                <InputFloating
                                    label="Email*"
                                    type="email"
                                    autoComplete="email"
                                    errors={fieldState.error ? [fieldState.error] : undefined}
                                    className="w-full"
                                    fieldClassName="w-full"
                                    {...field}
                                />
                            )}
                        />
                        <Button type="submit" aria-label="Subscribe" className="shrink-0 px-6 md:min-w-50 h-full py-0" disabled={isLoading}>
                            <span>{isLoading ? "Subscribing..." : "Subscribe"}</span>
                        </Button>
                    </div>
                </form>
                <p className="text-xs text-muted-foreground/80 mt-1">
                    By joining the W7F Supporter Club, you hereby consent to receive additional information from us in accordance with the WorldSevensFootball.com Privacy Policy and Terms and Conditions.
                </p>
                {submitted && (
                    <FormMessageSuccess className="mt-1">{submitted}</FormMessageSuccess>
                )}
                {error && (
                    <p className="mt-1 text-sm text-destructive">{error}</p>
                )}
            </div>
        </GradientBanner>
    )
})

StayUpdatedBanner.displayName = "StayUpdatedBanner"

export { StayUpdatedBanner }
