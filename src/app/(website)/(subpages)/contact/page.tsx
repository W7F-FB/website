"use client"

import * as React from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller } from "react-hook-form"
import { useAppForm } from "@/hooks/use-app-form"
import { Section, Container } from "@/components/website-base/padding-containers"
import { H1, P } from "@/components/website-base/typography"
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TopicSelect } from "@/components/ui/topicselect"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { FormMessageSuccess } from "@/components/ui/form-message-success"

const schema = z.object({
    topic: z
        .string()
        .min(1, { message: "Please select a topic" }),

    firstName: z
        .string()
        .trim()
        .min(1, { message: "First name is required" })
        .max(50, { message: "First name must be under 50 characters" }),

    lastName: z
        .string()
        .trim()
        .min(1, { message: "Last name is required" })
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
    terms: z
        .boolean()
        .refine((val) => val === true, { message: "You must accept the terms" }),
});



export default function ContactPage() {

    const [submitted] = React.useState<string | null>(null)

    const form = useAppForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: {
            topic: "",
            firstName: "",
            lastName: "",
            email: "",
            message: "",
            newsletter: false,
            terms: false,
        },
    })


    async function onSubmit(values: z.infer<typeof schema>) {
        console.log(values)
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
                    <form onSubmit={form.handleSubmit(onSubmit)} className="w-full" noValidate>
                        <FieldGroup className="space-y-8">
                            <Controller
                                control={form.control}
                                name="topic"
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={!!fieldState.error}>
                                        <FieldLabel className="text-3xl font-headers uppercase">What can we help you with?</FieldLabel>
                                        <TopicSelect value={field.value} onValueChange={field.onChange} />
                                        <FieldError errors={fieldState.error ? [fieldState.error] : undefined} />
                                    </Field>
                                )}
                            />

                            {form.watch("topic") && (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <Controller
                                            control={form.control}
                                            name="firstName"
                                            render={({ field, fieldState }) => (
                                                <Field data-invalid={!!fieldState.error}>
                                                    <FieldLabel htmlFor="firstName" className="font-headers">First Name<span className="text-red-500">*</span></FieldLabel>
                                                    <Input
                                                        id="firstName"
                                                        placeholder="Your first name"
                                                        className="bg-transparent border border-[#000] border-b-[#ffffff1a] text-white h-10 focus-visible:outline-none focus-visible:ring-0 focus-visible:border-transparent"
                                                        {...field}
                                                    />
                                                    <FieldError errors={fieldState.error ? [fieldState.error] : undefined} />
                                                </Field>
                                            )}
                                        />
                                        <Controller
                                            control={form.control}
                                            name="lastName"
                                            render={({ field, fieldState }) => (
                                                <Field data-invalid={!!fieldState.error}>
                                                    <FieldLabel htmlFor="lastName" className="font-headers">Last Name <span className="text-red-500">*</span></FieldLabel>
                                                    <Input
                                                        id="lastName"
                                                        placeholder="Your last name"
                                                        className="bg-transparent border border-[#000] border-b-[#ffffff1a] text-white h-10 focus-visible:outline-none focus-visible:ring-0 focus-visible:border-transparent"
                                                        {...field}
                                                    />
                                                    <FieldError errors={fieldState.error ? [fieldState.error] : undefined} />
                                                </Field>
                                            )}
                                        />
                                    </div>

                                    <Controller
                                        control={form.control}
                                        name="email"
                                        render={({ field, fieldState }) => (
                                            <Field data-invalid={!!fieldState.error}>
                                                <FieldLabel htmlFor="email" className="font-headers">Email <span className="text-red-500">*</span></FieldLabel>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    placeholder="inbox@email.com"
                                                    autoComplete="email"
                                                    className="bg-transparent border border-[#000] border-b-[#ffffff1a] text-white h-10 focus-visible:outline-none focus-visible:ring-0 focus-visible:border-transparent"
                                                    {...field}
                                                />
                                                <FieldError errors={fieldState.error ? [fieldState.error] : undefined} />
                                            </Field>
                                        )}
                                    />

                                    <Controller
                                        control={form.control}
                                        name="message"
                                        render={({ field, fieldState }) => (
                                            <Field data-invalid={!!fieldState.error}>
                                                <FieldLabel htmlFor="message" className="font-headers">Message <span className="text-red-500">*</span></FieldLabel>
                                                <Textarea
                                                    id="message"
                                                    rows={5}
                                                    placeholder="Your message..."
                                                    className="bg-transparent border border-[#000] text-white h-22"
                                                    {...field}
                                                />
                                                <FieldError errors={fieldState.error ? [fieldState.error] : undefined} />
                                            </Field>
                                        )}
                                    />

                                    <FieldGroup className="space-y-4">
                                        <Controller
                                            control={form.control}
                                            name="newsletter"
                                            render={({ field, fieldState }) => (
                                                <Field orientation="horizontal" data-invalid={!!fieldState.error}>
                                                    <Checkbox
                                                        id="newsletter"
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                        className="border-2 data-[state=checked]:border-white"
                                                    />
                                                    <FieldLabel htmlFor="newsletter" className="leading-none text-gray-300 font-normal">
                                                        Stay updated on W7F news, tickets, giveaways, merchandise and more.
                                                    </FieldLabel>
                                                    <FieldError errors={fieldState.error ? [fieldState.error] : undefined} />
                                                </Field>
                                            )}
                                        />

                                        <Controller
                                            control={form.control}
                                            name="terms"
                                            render={({ field, fieldState }) => (
                                                <Field orientation="horizontal" data-invalid={!!fieldState.error}>
                                                    <Checkbox
                                                        id="terms"
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                        className="border-2 data-[state=checked]:border-white"
                                                    />
                                                    <FieldLabel htmlFor="terms" className="text-gray-300 flex flex-wrap gap-1 items-center font-normal">
                                                        <span>By submitting your information you are agreeing to our</span>
                                                        <a href="/terms" className="underline">Terms and Conditions</a>
                                                        <span>and</span>
                                                        <a href="/privacy" className="underline">Privacy Policy</a>
                                                        <span className="text-red-500">*</span>
                                                    </FieldLabel>
                                                    <FieldError errors={fieldState.error ? [fieldState.error] : undefined} />
                                                </Field>
                                            )}
                                        />
                                    </FieldGroup>
                                    <section className="flex justify-center mt-6">
                                        <Button
                                            type="submit"
                                            size="skew_lg"
                                            aria-label="Subscribe"
                                            className="shrink-0 px-14 font-bold"
                                        >
                                            <span>SUBMIT</span>
                                        </Button>
                                    </section>
                                </>
                            )}
                        </FieldGroup>
                    </form>
                    {submitted && (
                        <FormMessageSuccess className="mt-2">{submitted}</FormMessageSuccess>
                    )}

                </div>
            </Section>

        </Container>
    );
}
