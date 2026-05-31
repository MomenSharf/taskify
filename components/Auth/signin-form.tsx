"use client";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { SigninInput, signinSchema } from "@/lib/validations/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Icons } from "../Icons";
import { AuthWrapper } from "./auth-wrapper";
import { Spinner } from "../ui/spinner";

export function SigninForm() {
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = useForm<SigninInput>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: SigninInput) => {
    const res = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
    });

    if (!res) {
      toast.error("Something went wrong. Try again later.");
      return;
    }

    if (res.error) {
      toast.error(mapAuthError(res.error));

      if (res.error === "EMAIL_NOT_VERIFIED") {
        router.push(`/verify?email=${encodeURIComponent(data.email)}`);
      }

      return;
    }

    toast.success("Login successful");
  };

  function mapAuthError(error: string) {
    switch (error) {
      case "MISSING_CREDENTIALS":
        return "Please fill in all fields";
      case "INVALID_EMAIL":
        return "No account found with this email";
      case "INVALID_PASSWORD":
        return "Incorrect password";
      case "NO_PASSWORD_ACCOUNT":
        return "This account uses a different sign-in method";
      case "EMAIL_NOT_VERIFIED":
        return "Please verify your email before continuing";
      case "CredentialsSignin":
        return "Email or password is incorrect";
      default:
        return "Something went wrong. Please try again";
    }
  }

  return (
    <AuthWrapper
      imgUrl="/assets/images/signin-page.jpg"
      icon={<LogIn className="size-4" />}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-2xl font-bold">Welcome back</h1>
            <p className="text-sm text-muted-foreground">
              Login to your account
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

                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            name="password"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <div className="flex items-center justify-between">
                  <FieldLabel htmlFor="password">Password</FieldLabel>

                  <Link
                    href="/forgot-password"
                    className="text-sm underline-offset-2 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>

                <div className="relative">
                  <Input
                    {...field}
                    id="password"
                    className="pr-10"
                    type={showPassword ? "text" : "password"}
                    aria-invalid={fieldState.invalid}
                  />

                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="absolute right-0 top-0 rounded-l-none bg-background"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                </div>

                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Field>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting && <Spinner data-icon="inline-start" />}
              Login
            </Button>
          </Field>

          <FieldSeparator>Or continue with</FieldSeparator>

          <Field className="grid grid-cols-1 gap-3">
            <Button variant="outline" type="button">
              <Icons.google className="size-5" />
              Continue with Google
            </Button>
          </Field>

          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="underline">
              Sign up
            </Link>
          </p>
        </FieldGroup>
      </form>
    </AuthWrapper>
  );
}
