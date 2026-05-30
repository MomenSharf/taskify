"use client";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { signup } from "@/lib/actions/auth/signup";
import { SignupInput, signupSchema } from "@/lib/validations/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Icons } from "../Icons";
import { AuthWrapper } from "./AuthWrapper";

export function SignupForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, SetShowConfirmPassword] = useState(false);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: SignupInput) => {
    try {
      const res = await signup(data);

      if (res.success) {
        toast.success(res.message);
        router.push(`/verify?email=${data.email}`);
      } else {
        toast.error(res.message || "Something went wrong! try again later");
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  return (
    <AuthWrapper
      imgUrl="/assets/images/signup-page.jpg"
      icon={<UserPlus className="size-4" />}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-2xl font-bold">Create your account</h1>
            <p className="text-sm text-muted-foreground">
              Enter your email below to create your account
            </p>
          </div>

          <Field>
            <FieldLabel htmlFor="name">Full Name</FieldLabel>
            <Input id="name" placeholder="John Doe" {...register("name")} />
            {errors.name && (
              <FieldDescription className="text-red-500">
                {errors.name.message}
              </FieldDescription>
            )}
          </Field>

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

          <div className="grid grid-cols-2 gap-4">
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
                  onClick={() => SetShowConfirmPassword(!showConfirmPassword)}
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

          <FieldSeparator>Or continue with</FieldSeparator>
          <Field className="grid grid-cols-1 gap-3">
            <Button variant="outline" type="button">
              <Icons.google className="size-5" />
              Continue with Google
            </Button>
          </Field>

          <FieldDescription className="text-center">
            Already have an account?{" "}
            <Link href="/signin" className="underline">
              Sign in
            </Link>
          </FieldDescription>
        </FieldGroup>
      </form>
    </AuthWrapper>
  );
}
