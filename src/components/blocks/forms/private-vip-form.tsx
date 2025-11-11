"use client"

import { useState } from "react"
import { FieldGroup, FieldDescription, Field, FieldLabel } from "@/components/ui/field"
import { Checkbox } from "@/components/ui/checkbox"
import { H2, H3, P } from "@/components/website-base/typography"
import { Separator } from "@/components/ui/separator"
import { InputFloating } from "@/components/ui/input-floating"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { useForm, Controller } from "react-hook-form"

type PrivateVipFormData = {
  firstName: string
  lastName: string
  email: string
  phone: string
  newsletter: boolean
  termsAccepted: boolean
}

export function PrivateVipForm() {
  const [isSubmitted, setIsSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting }
  } = useForm<PrivateVipFormData>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      newsletter: false,
      termsAccepted: false,
    }
  })

  const onSubmit = async (data: PrivateVipFormData) => {
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
      <Card>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-2 p-8">
            <FieldGroup>
              <div className="space-y-2 text-center pb-8">
                <span className="font-[450] font-headers uppercase text-accent-foreground block">
                  Private VIP Cabanas
                </span>
                <H2 className="text-3xl font-bold uppercase text-white">
                  Interested in a Private VIP Cabana?
                </H2>
                <FieldDescription>
                  For more information on a luxurious pitchside VIP Cabana, please complete the form.
                </FieldDescription>
              </div>
            </FieldGroup>

            <Separator />

            {!isSubmitted ? (
              <>
                <div className="space-y-6 py-8">
                  <div className="grid grid-cols-2 gap-4">
                    <Field>
                      <FieldLabel>
                        First Name <span className="text-red-500">*</span>
                      </FieldLabel>
                      <InputFloating
                        aria-invalid={!!errors.firstName}
                        label="Your First Name"
                        {...register("firstName", {
                          required: "First name is required",
                          minLength: {
                            value: 2,
                            message: "First name must be at least 2 characters"
                          }
                        })}
                        errors={errors.firstName ? [errors.firstName] : undefined}
                      />
                    </Field>
                    <Field>
                      <FieldLabel>
                        Last Name <span className="text-red-500">*</span>
                      </FieldLabel>
                      <InputFloating
                        aria-invalid={!!errors.lastName}
                        label="Your Last Name"
                        {...register("lastName", {
                          required: "Last name is required",
                          minLength: {
                            value: 2,
                            message: "Last name must be at least 2 characters"
                          }
                        })}
                        errors={errors.lastName ? [errors.lastName] : undefined}
                      />
                    </Field>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Field>
                      <FieldLabel>
                        Email <span className="text-red-500">*</span>
                      </FieldLabel>
                      <InputFloating
                        aria-invalid={!!errors.email}
                        label="inbox@email.com"
                        type="email"
                        {...register("email", {
                          required: "Email is required",
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "Invalid email address"
                          }
                        })}
                        errors={errors.email ? [errors.email] : undefined}
                      />
                    </Field>
                    <Field>
                      <FieldLabel>
                        Phone <span className="text-red-500">*</span>
                      </FieldLabel>
                      <InputFloating
                        aria-invalid={!!errors.phone}
                        label="Your Phone Number"
                        type="tel"
                        {...register("phone", {
                          required: "Phone number is required",
                          pattern: {
                            value: /^[\d\s\-\+\(\)]+$/,
                            message: "Invalid phone number"
                          },
                          minLength: {
                            value: 10,
                            message: "Phone number must be at least 10 digits"
                          }
                        })}
                        errors={errors.phone ? [errors.phone] : undefined}
                      />
                    </Field>
                  </div>
                </div>

                <FieldGroup className="flex flex-col gap-4">
                  <Field orientation="horizontal">
                    <Controller
                      name="newsletter"
                      control={control}
                      render={({ field }) => (
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      )}
                    />
                    <FieldLabel>
                      Stay updated on W7F news, tickets, giveaways, merchandise and more.
                    </FieldLabel>
                  </Field>

                  <Field orientation="horizontal">
                    <Controller
                      name="termsAccepted"
                      control={control}
                      rules={{ required: "You must accept the terms and conditions" }}
                      render={({ field }) => (
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      )}
                    />
                    <FieldLabel>
                      By submitting your information you are agreeing to our{" "}
                      <Button variant="link" asChild className="p-0">
                        <Link href="/">Terms and Conditions</Link>
                      </Button>{" "}
                      and{" "}
                      <Button variant="link" asChild className="p-0">
                        <Link href="/">Privacy Policy</Link>
                      </Button>
                      <span className="text-red-500">*</span>
                    </FieldLabel>
                  </Field>

                  {errors.termsAccepted && (
                    <p className="text-sm text-destructive">
                      {errors.termsAccepted.message}
                    </p>
                  )}
                </FieldGroup>

                <div className="flex justify-center py-4">
                  <Button
                    type="submit"
                    size="skew_lg"
                    disabled={isSubmitting}
                  >
                    <span>{isSubmitting ? "Submitting..." : "Submit"}</span>
                  </Button>
                </div>
              </>
            ) : (
              <div className="py-12 text-center space-y-4">
                <H3 className="text-2xl font-semibold text-white">Thank you!</H3>
                <P className="text-muted-foreground max-w-md mx-auto">
                  Your information has been submitted successfully. Our team will contact you shortly
                  regarding the Private VIP Cabanas.
                </P>
              </div>
            )}
          </div>
        </form>
      </Card>
    </div>
  )
}
