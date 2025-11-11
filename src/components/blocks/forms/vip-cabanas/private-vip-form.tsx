"use client"

import { useState } from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller } from "react-hook-form"
import { FieldGroup, Field, FieldLabel, FieldError } from "@/components/ui/field"
import { Checkbox } from "@/components/ui/checkbox"
import { H2, H3, P, Subtitle } from "@/components/website-base/typography"
import { Separator } from "@/components/ui/separator"
import { InputFloating } from "@/components/ui/input-floating"
import { Button } from "@/components/ui/button"
import { TextLink } from "@/components/ui/text-link"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { useAppForm } from "@/hooks/use-app-form"

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
    .min(10, { message: "Phone number must be at least 10 digits" })
    .regex(/^[\d\s\-\+\(\)]+$/, { message: "Invalid phone number" }),
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
      console.log("Form data:", data)
      await new Promise(resolve => setTimeout(resolve, 1000))
      setIsSubmitted(true)
    } catch (error) {
      console.error("Error submitting form:", error)
    }
  }

  return (
    <div>
      <Card className="border-border/35 bg-card/35">
        <CardHeader>
          <CardTitle>
            <Subtitle className="font-[450] font-headers uppercase text-accent-foreground block">
              Private VIP Cabanas
            </Subtitle>
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
                  <div className="space-y-6 mb-6">
                    <div className="grid grid-cols-2 gap-4">
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

                    <div className="grid grid-cols-2 gap-4">
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
