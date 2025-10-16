"use client"

import * as React from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Section, Container } from "@/components/website-base/padding-containers"
import { H1, P } from "@/components/website-base/typography"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
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
        .email({ message: "Enter a valid email" }),

    message: z
        .string()
        .trim()
        .min(1, { message: "Message is required" })
        .max(1000, { message: "Message must be under 1000 characters" }),

    newsletter: z.boolean().optional(), // optional checkbox
    terms: z
        .boolean()
        .refine((val) => val === true, { message: "You must accept the terms" }),
});



export default function ContactPage() {

    const [submitted] = React.useState<string | null>(null)

    const form = useForm<z.infer<typeof schema>>({
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
        mode: "onSubmit",
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
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-8">

                            <FormField
                                control={form.control}
                                name="topic"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-3xl font-headers uppercase">What can we help you with?</FormLabel>
                                        <FormControl>
                                            <TopicSelect value={field.value} onValueChange={field.onChange} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {form.watch("topic") && (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <FormField
                                            control={form.control}
                                            name="firstName"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="font-headers">First Name<span className="text-red-500">*</span></FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Your first name"
                                                            className="bg-transparent border border-[#000] border-b-[#ffffff1a] text-white h-10 focus-visible:outline-none focus-visible:ring-0 focus-visible:border-transparent"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="lastName"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="font-headers">Last Name <span className="text-red-500">*</span></FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Your last name"
                                                            className="bg-transparent border border-[#000] border-b-[#ffffff1a] text-white h-10 focus-visible:outline-none focus-visible:ring-0 focus-visible:border-transparent"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="font-headers">Email <span className="text-red-500">*</span></FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="email"
                                                        placeholder="inbox@email.com"
                                                        autoComplete="email"
                                                        className="bg-transparent border border-[#000] border-b-[#ffffff1a] text-white h-10 focus-visible:outline-none focus-visible:ring-0 focus-visible:border-transparent"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="message"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="font-headers">Message <span className="text-red-500">*</span></FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        rows={5}
                                                        placeholder="Your message..."
                                                        className="bg-transparent border border-[#000] text-white h-22"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="space-y-4">
                                        <FormField
                                            control={form.control}
                                            name="newsletter"
                                            render={({ field }) => (
                                                <FormItem className="flex items-start space-x-2">
                                                    <FormControl>
                                                        <Checkbox
                                                            checked={field.value}
                                                            onCheckedChange={field.onChange}
                                                            className="border-2 data-[state=checked]:border-white"
                                                        />
                                                    </FormControl>
                                                    <FormLabel className="leading-none text-gray-300">
                                                        Stay updated on W7F news, tickets, giveaways, merchandise and more.
                                                    </FormLabel>
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="terms"
                                            render={({ field }) => (
                                                <FormItem className="flex items-start space-x-2">
                                                    <FormControl>
                                                        <Checkbox
                                                            checked={field.value}
                                                            onCheckedChange={field.onChange}
                                                            className="border-2 data-[state=checked]:border-white"
                                                        />
                                                    </FormControl>
                                                    <FormLabel className="text-gray-300 flex flex-wrap gap-1 items-center">
                                                        <span>By submitting your information you are agreeing to our</span>
                                                        <a href="/terms" className="underline">Terms and Conditions</a>
                                                        <span>and</span>
                                                        <a href="/privacy" className="underline">Privacy Policy</a>
                                                        <span className="text-red-500">*</span>
                                                    </FormLabel>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
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

                        </form>
                        {submitted && (
                            <FormMessageSuccess className="mt-2">{submitted}</FormMessageSuccess>
                        )}
                    </Form>

                </div>
            </Section>

        </Container>
    );
}
