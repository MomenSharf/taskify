"use client";

import {
  ResetPasswordInput,
  resetPasswordSchema,
} from "@/lib/validations/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { resetPassword } from "@/lib/actions/auth/forgot-password.action";
import { IconEye, IconEyeOff, IconLock } from "@tabler/icons-react";
import { Button } from "../ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Spinner } from "../ui/spinner";
import { AuthWrapper } from "./auth-wrapper";

export default function ResetPassword({
  token,
  email,
}: {
  token: string;
  email: string;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const router = useRouter();

  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: ResetPasswordInput) => {
    const res = await resetPassword({
      token,
      email,
      newPassword: data.password,
    });
    if (res.error) {
      toast.error(res.error.message || "Something went wrong! try again later");
    }
    toast.success(res.data?.message || "Password reset successfully.");
    router.push("/signin");
  };

  return (
    <AuthWrapper imgUrl="/assets/images/signin-page.jpg" icon={<IconLock />}>
      <form onSubmit={handleSubmit(onSubmit)} className="min-h-56">
        <FieldGroup className="min-h-72">
          <div className="flex flex-col gap-2 text-center">
            <h1 className="text-3xl font-bold">Reset Password</h1>
            <p className="text-sm text-muted-foreground">
              Please enter your new password to reset your account.
            </p>
            <p className="text-sm text-muted-foreground">{email}</p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <Controller
              name="password"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="password">Password</FieldLabel>

                  <div className="relative">
                    <Input
                      {...field}
                      id="password"
                      type={showPassword ? "text" : "password"}
                      className="pr-10"
                      aria-invalid={fieldState.invalid}
                    />

                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="absolute right-0 top-0 rounded-l-none bg-background"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <IconEye /> : <IconEyeOff />}
                    </Button>
                  </div>

                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="confirmPassword"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="confirmPassword">
                    Confirm Password
                  </FieldLabel>

                  <div className="relative">
                    <Input
                      {...field}
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      className="pr-10"
                      aria-invalid={fieldState.invalid}
                    />

                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="absolute right-0 top-0 rounded-l-none bg-background"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? <IconEyeOff /> : <IconEye />}
                    </Button>
                  </div>

                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>

          <Field>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting && <Spinner data-icon="inline-start" />}
              Reset Password
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </AuthWrapper>
  );
}
