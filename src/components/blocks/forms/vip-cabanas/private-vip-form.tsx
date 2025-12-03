"use client"

import { useState } from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller } from "react-hook-form"
import { FieldGroup, Field, FieldLabel, FieldError } from "@/components/ui/field"
import { Checkbox } from "@/components/ui/checkbox"
import { H2, H3, P } from "@/components/website-base/typography"
import { Separator } from "@/components/ui/separator"
import { InputFloating } from "@/components/ui/input-floating"
import { Button } from "@/components/ui/button"
import { TextLink } from "@/components/ui/text-link"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { useAppForm } from "@/hooks/use-app-form"
import { dev } from "@/lib/dev"
import { phoneMask, phoneToE164 } from "@/lib/phone-utils"

const schema = z.object({
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
  phone: z
    .string()
    .trim()
    .min(1, { message: "Phone number is required" })
    .refine((val) => val.replace(/\D/g, "").length >= 10, { message: "Phone number must be 10 digits" }),
  newsletter: z.boolean().optional(),
  termsAccepted: z
    .boolean()
    .refine((val) => val === true, { message: "You must accept the terms and conditions" }),
})

export function PrivateVipForm() {
  const [isSubmitted, setIsSubmitted] = useState(false)

  const form = useAppForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      newsletter: false,
      termsAccepted: false,
    }
  })

  const onSubmit = async (data: z.infer<typeof schema>) => {
    try {
      dev.log("Form data:", data)
      await new Promise(resolve => setTimeout(resolve, 1000))

      const formattedPhone = phoneToE164(data.phone)
      dev.log("Formatted phone for Klaviyo:", formattedPhone)

      fetch("/api/resend/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
                    to: "vipexperience@worldsevens.com",
                    cc: "ben@worldsevens.com",
          subject: "New Private VIP Cabana Inquiry",
          replyTo: data.email,
          fromName: "W7F VIP Inquiries",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #333; border-bottom: 2px solid #e5e5e5; padding-bottom: 10px;">
                New Private VIP Cabana Inquiry
              </h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #eee; font-weight: bold; width: 140px;">Name</td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #eee;">${data.firstName} ${data.lastName}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #eee; font-weight: bold;">Email</td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #eee;">
                    <a href="mailto:${data.email}" style="color: #0066cc;">${data.email}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #eee; font-weight: bold;">Phone</td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #eee;">
                    <a href="tel:${formattedPhone}" style="color: #0066cc;">${formattedPhone}</a>
                  </td>
                </tr>
              </table>
              <p style="color: #666; font-size: 12px; margin-top: 20px;">
                This inquiry was submitted via the W7F website VIP Cabana form.<br/>
                You may reply to this email to contact the customer directly.
              </p>
            </div>
          `,
        }),
      }).catch(() => {})

      fetch("/api/klaviyo/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email,
          listId: "SAqwTH",
          firstName: data.firstName,
          lastName: data.lastName,
          phone: formattedPhone,
        }),
      }).catch(() => {})

      if (data.newsletter) {
        fetch("/api/klaviyo/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: data.email,
            listId: "UrjmkJ",
            firstName: data.firstName,
            lastName: data.lastName,
            phone: formattedPhone,
          }),
        }).catch(() => {})
      }

      setIsSubmitted(true)
    } catch (error) {
      dev.log("Error submitting form:", error)
    }
  }

  return (
    <div>
      <Card className="border-border/35 bg-card/35">
        <CardHeader>
          <CardTitle>
            <H2 className="uppercase">
              Interested in a Private VIP Cabana?
            </H2>
          </CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            For more information on a luxurious pitchside VIP Cabana, please complete the form.
          </CardDescription>
        </CardHeader>
        <Separator variant="gradient" className="my-2" />
        <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
          <CardContent>
            <div className="space-y-2">   
              {!isSubmitted ? (
                <>
                  <div className="space-y-4 md:space-y-6 mb-6">
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        name="phone"
                        render={({ field, fieldState }) => (
                          <Field data-invalid={!!fieldState.error}>
                            <InputFloating
                              label="Phone Number"
                              type="tel"
                              mask={phoneMask}
                              {...field}
                              errors={fieldState.error ? [fieldState.error] : undefined}
                            />
                          </Field>
                        )}
                      />
                    </div>
                  </div>

                  <FieldGroup className="flex flex-col gap-4">
                    <Controller
                      control={form.control}
                      name="newsletter"
                      render={({ field }) => (
                        <Field orientation="horizontal" className="items-start">
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            id="newsletter"
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

                  <div className="flex justify-center mt-10">
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
              ) : (
                <div className="py-12 text-center space-y-4 bg-muted/20">
                  <H3 className="text-2xl font-semibold text-white">Thank you!</H3>
                  <P className="text-muted-foreground max-w-md mx-auto">
                    Your information has been submitted successfully. Our team will contact you shortly
                    regarding the Private VIP Cabanas.
                  </P>
                </div>
              )}
            </div>
          </CardContent>
        </form>
      </Card>
    </div>
  )
}
