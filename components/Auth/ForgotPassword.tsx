"use client";

import { createAndSendPasswordResetToken } from "@/lib/actions/auth/forgot-password";
import {
  ForgotPasswordInput,
  forgotPasswordSchema,
} from "@/lib/validations/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Fingerprint } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { AuthWrapper } from "./AuthWrapper";

export default function ForgotPassword() {
  const router = useRouter();

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    try {
      const res = await createAndSendPasswordResetToken(data.email);

      if (res.success) {
        toast.success(res.message);
        router.push(`/signin`);
      } else {
        toast.error(res.message || "Something went wrong! try again later");
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    }
  };

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
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              {...register("email")}
            />
            {errors.email && (
              <FieldDescription className="text-red-500">
                {errors.email.message}
              </FieldDescription>
            )}
          </Field>
          <Field>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              Send Reset Link
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </AuthWrapper>
  );
}
