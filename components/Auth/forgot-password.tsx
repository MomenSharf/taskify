"use client"

import {
  ForgotPasswordInput,
  forgotPasswordSchema,
} from "@/lib/validations/auth"
import { zodResolver } from "@hookform/resolvers/zod"
import { Fingerprint } from "lucide-react"
import { useRouter } from "next/navigation"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"

import { Button } from "../ui/button"
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field"
import { Input } from "../ui/input"
import { AuthWrapper } from "./auth-wrapper"
import { createAndSendPasswordResetToken } from "@/app/actions/auth/forgot-password.action"
import { Spinner } from "../ui/spinner"

export default function ForgotPassword() {
  const router = useRouter()

  const  {handleSubmit, control, formState: {isSubmitting}} = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  })

  const onSubmit = async (data: ForgotPasswordInput) => {
    try {
      const res = await createAndSendPasswordResetToken(data.email)

      if (res.success) {
        toast.success(res.message)
        router.push("/signin")
      } else {
        toast.error(res.message || "Something went wrong! try again later")
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Something went wrong")
    }
  }

  return (
    <AuthWrapper
      imgUrl="/assets/images/signin-page.jpg"
      icon={<Fingerprint className="size-6" />}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="min-h-56">
        <FieldGroup className="min-h-72">
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-3xl font-bold">Forgot Password</h1>
            <p className="text-sm text-muted-foreground">
              Please enter your email address to reset your password.
            </p>
          </div>

          <Controller
            name="email"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="email">Email</FieldLabel>

                <Input
                  {...field}
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  aria-invalid={fieldState.invalid}
                />

                {fieldState.error && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Field>
            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting && (
                <Spinner data-icon="inline-start" />
              )}
              Send Reset Link
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </AuthWrapper>
  )
}