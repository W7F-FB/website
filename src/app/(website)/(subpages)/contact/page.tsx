"use client"

import * as React from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller } from "react-hook-form"
import { useAppForm } from "@/hooks/use-app-form"
import { Section, Container } from "@/components/website-base/padding-containers"
import { H1, H2, P } from "@/components/website-base/typography"
import { TextLink } from "@/components/ui/text-link"
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { InputFloating } from "@/components/ui/input-floating"
import { TextAreaFloating } from "@/components/ui/text-area-floating"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"


const schema = z.object({
    topic: z
        .string()
        .min(1, { message: "Please select a topic" }),

    firstName: z
        .string()
        .trim()
        .min(1, { message: "First name is required" })
        .min(2, { message: "First name must be at least 2 characters" })
        .max(50, { message: "First name must be under 50 characters" }),

    lastName: z
        .string()
        .trim()
        .min(1, { message: "Last name is required" })
        .min(2, { message: "Last name must be at least 2 characters" })
        .max(50, { message: "Last name must be under 50 characters" }),

    email: z
        .string()
        .trim()
        .min(1, { message: "Email is required" })
        .email({ message: "Invalid email" }),

    message: z
        .string()
        .trim()
        .min(1, { message: "Message is required" })
        .max(1000, { message: "Message must be under 1000 characters" }),

    newsletter: z.boolean().optional(),
    termsAccepted: z
        .boolean()
        .refine((val) => val === true, { message: "You must accept the terms and conditions" }),
});



export default function ContactPage() {

    const [isSubmitted, setIsSubmitted] = React.useState(false)

    const form = useAppForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: {
            topic: "",
            firstName: "",
            lastName: "",
            email: "",
            message: "",
            newsletter: false,
            termsAccepted: false,
        },
    })


    async function onSubmit(values: z.infer<typeof schema>) {
        try {
            console.log(values)
            await new Promise(resolve => setTimeout(resolve, 1000))
            setIsSubmitted(true)
        } catch (error) {
            console.error("Error submitting form:", error)
        }
    }

    return (
        <Container className="min-h-screen text-white py-auto" maxWidth="lg">
            <Section padding="lg" className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
                <Container>
                    <H1 className="uppercase text-7xl font-headers leading-[100px]">
                        Let&apos;s Get In Touch
                    </H1>
                    <P className="uppercase mt-6 text-2xl font-headers text-gray-200">
                        Questions? Reach out and we will get back to you.
                    </P>
                </Container>

                <div>
                    {!isSubmitted ? (
                        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full" noValidate>
                            <FieldGroup>
                                <Controller
                                    control={form.control}
                                    name="topic"
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={!!fieldState.error}>
                                            <H2 className="uppercase">What can we help you with?</H2>
                                            <Select value={field.value} onValueChange={field.onChange}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select an option" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="career">I want to learn about career opportunities</SelectItem>
                                                    <SelectItem value="tickets">I have questions regarding tickets</SelectItem>
                                                    <SelectItem value="media">I have a media inquiry</SelectItem>
                                                    <SelectItem value="club">I want to participate with my club</SelectItem>
                                                    <SelectItem value="partnership">I want to discuss a partnership</SelectItem>
                                                    <SelectItem value="vip">I want to learn about VIP experiences</SelectItem>
                                                    <SelectItem value="other">Something else</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </Field>
                                    )}
                                />

                                {form.watch("topic") && (
                                    <>
                                        <Separator variant="gradient" className="my-4" />
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <Controller
                                                control={form.control}
                                                name="firstName"
                                                render={({ field, fieldState }) => (
                                                    <Field data-invalid={!!fieldState.error}>
                                                        <InputFloating
                                                            label="First Name"
                                                            {...field}
                                                            errors={fieldState.error ? [fieldState.error] : undefined}
                                                        />
                                                    </Field>
                                                )}
                                            />
                                            <Controller
                                                control={form.control}
                                                name="lastName"
                                                render={({ field, fieldState }) => (
                                                    <Field data-invalid={!!fieldState.error}>
                                                        <InputFloating
                                                            label="Last Name"
                                                            {...field}
                                                            errors={fieldState.error ? [fieldState.error] : undefined}
                                                        />
                                                    </Field>
                                                )}
                                            />
                                        </div>

                                        <Controller
                                            control={form.control}
                                            name="email"
                                            render={({ field, fieldState }) => (
                                                <Field data-invalid={!!fieldState.error}>
                                                    <InputFloating
                                                        label="Email"
                                                        type="email"
                                                        {...field}
                                                        errors={fieldState.error ? [fieldState.error] : undefined}
                                                    />
                                                </Field>
                                            )}
                                        />

                                    <Controller
                                        control={form.control}
                                        name="message"
                                        render={({ field, fieldState }) => (
                                            <Field data-invalid={!!fieldState.error}>
                                                <TextAreaFloating
                                                    label="Message"
                                                    {...field}
                                                    errors={fieldState.error ? [fieldState.error] : undefined}
                                                />
                                            </Field>
                                        )}
                                    />

                                        <FieldGroup className="flex flex-col gap-4">
                                            <Controller
                                                control={form.control}
                                                name="newsletter"
                                                render={({ field, fieldState }) => (
                                                    <Field orientation="horizontal" data-invalid={!!fieldState.error}>
                                                        <Checkbox
                                                            id="newsletter"
                                                            checked={field.value}
                                                            onCheckedChange={field.onChange}
                                                        />
                                                        <FieldLabel htmlFor="newsletter">
                                                            Stay updated on W7F news, tickets, giveaways, merchandise and more.
                                                        </FieldLabel>
                                                    </Field>
                                                )}
                                            />

                                            <Controller
                                                control={form.control}
                                                name="termsAccepted"
                                                render={({ field, fieldState }) => (
                                                    <>
                                                        <Field orientation="horizontal" className="items-start" data-invalid={!!fieldState.error}>
                                                            <Checkbox
                                                                checked={field.value}
                                                                onCheckedChange={field.onChange}
                                                                id="termsAccepted"
                                                            />
                                                            <FieldLabel htmlFor="termsAccepted" className="block">
                                                                <span>By submitting your information you are agreeing to our </span>
                                                                <TextLink href="/">Terms and Conditions</TextLink>
                                                                <span> and </span>
                                                                <TextLink href="/">Privacy Policy</TextLink>
                                                                <span className="text-destructive">*</span>
                                                            </FieldLabel>
                                                        </Field>
                                                        <FieldError errors={fieldState.error ? [fieldState.error] : undefined} />
                                                    </>
                                                )}
                                            />
                                        </FieldGroup>
                                        <div className="flex justify-center mt-6">
                                            <Button
                                                type="submit"
                                                size="skew_lg"
                                                className="min-w-60"
                                                disabled={form.formState.isSubmitting}
                                            >
                                                <span>{form.formState.isSubmitting ? "Submitting..." : "Submit"}</span>
                                            </Button>
                                        </div>
                                    </>
                                )}
                            </FieldGroup>
                        </form>
                    ) : (
                        <div className="py-12 text-center space-y-4 bg-muted/20 rounded-md">
                            <H2 className="text-2xl font-semibold text-white">Thank you!</H2>
                            <P className="text-muted-foreground max-w-md mx-auto">
                                Your message has been submitted successfully. Our team will get back to you shortly.
                            </P>
                        </div>
                    )}
                </div>
            </Section>

        </Container>
    );
}
