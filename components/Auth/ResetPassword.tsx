"use client";

import { resetPassword } from "@/lib/actions/auth/forgot-password";
import {
  ResetPasswordInput,
  resetPasswordSchema,
} from "@/lib/validations/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { AuthWrapper } from "./AuthWrapper";

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
    register,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: ResetPasswordInput) => {
    try {
      const res = await resetPassword({ token, email, ...data });

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
      icon={<Lock className="size-6" />}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="min-h-56">
        <FieldGroup className="min-h-72">
          <h1 className="text-3xl font-bold">Reset Password</h1>
          <p className="text-sm text-muted-foreground">
            Please enter your new password to reset your account.
          </p>
          <p className="text-sm text-muted-foreground text-center">{email}</p>

          <div className="grid grid-cols-1 gap-4">
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className="pr-10"
                  {...register("password")}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="absolute right-0 top-0  rounded-tl-none rounded-bl-none rounded-tr-md rounded-br-md bg-background focus:ring-0"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-3 h-3" />
                  )}
                </Button>
              </div>
              {errors.password && (
                <FieldDescription className="text-red-500">
                  {errors.password.message}
                </FieldDescription>
              )}
            </Field>

            <Field>
              <FieldLabel htmlFor="confirmPassword">
                Confirm Password
              </FieldLabel>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  className="pr-10"
                  id="confirmPassword"
                  {...register("confirmPassword")}
                />{" "}
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="absolute right-0 top-0  rounded-tl-none rounded-bl-none rounded-tr-md rounded-br-md bg-background focus:ring-0"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-3 h-3" />
                  )}
                </Button>
              </div>
              {errors.confirmPassword && (
                <FieldDescription className="text-red-500">
                  {errors.confirmPassword.message}
                </FieldDescription>
              )}
            </Field>
          </div>

          <Field>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              Create Account
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </AuthWrapper>
  );
}
