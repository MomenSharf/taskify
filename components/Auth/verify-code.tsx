"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { Field, FieldError, FieldGroup } from "@/components/ui/field";

import { VerifyCodeInput, VerifyCodeSchema } from "@/lib/validations/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, MailCheck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";

import {
  resendVerificationEmail,
  verifyCode,
} from "@/app/actions/auth/verification-email.action";
import { Spinner } from "../ui/spinner";
import { AuthWrapper } from "./auth-wrapper";

export default function VerifyCode({
  email,
  initialCooldown = 0,
  attemptsLeftServer,
  maxAttempts,
}: {
  email?: string;
  initialCooldown?: number;
  attemptsLeftServer: number;
  maxAttempts: number;
}) {
  const [isPending, startTransition] = useTransition();
  const [cooldown, setCooldown] = useState(initialCooldown);
  const [attemptsLeft, setAttemptsLeft] = useState<number>(
    attemptsLeftServer,
  );
  const [isLocked, setIsLocked] = useState(() => (attemptsLeft >= maxAttempts));
  //   {attemptsLeft !== null && !isLocked && (
  //   <p className="text-sm text-muted-foreground">
  //     {attemptsLeft} attempts left
  //   </p>
  // )}

  const router = useRouter();

  const {
    handleSubmit,
    setValue,
    getValues,
    formState: { isSubmitting, errors },
  } = useForm<VerifyCodeInput>({
    resolver: zodResolver(VerifyCodeSchema),
    defaultValues: {
      code: "",
    },
    mode: "onChange",
  });

  const code = getValues("code");

  const onSubmit = useCallback(
    async (data: VerifyCodeInput) => {
      if (!email) {
        toast.error("Email is required");
        return;
      }

      try {
        await verifyCode(email, data.code);

        toast.success("Email verified successfully!");
        router.push("/signin");
      } catch (error: unknown) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Something went wrong! try again later",
        );
      }
    },
    [email, router],
  );

  const handleResend = async () => {
    if (!email) {
      toast.error("Email is required");
      return;
    }

    if (cooldown > 0) {
      toast.info(`Please wait ${cooldown} seconds before resending`);
      return;
    }

    if (isPending) return;

    startTransition(async () => {
      try {
        const res = await resendVerificationEmail(email);

        if (res?.success) {
          toast.success("Verification email resent!");
          setCooldown(60);
          return;
        }

        toast.error(res?.message || "Failed to resend email");

        if (
          res &&
          "secondsLeft" in res &&
          typeof res.secondsLeft === "number"
        ) {
          setCooldown(res.secondsLeft);
        }
      } catch (error: unknown) {
        toast.error(
          error instanceof Error ? error.message : "Failed to resend email",
        );
      }
    });
  };

  useEffect(() => {
    if (cooldown <= 0) return;

    const interval = setInterval(() => {
      setCooldown((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [cooldown]);

  return (
    <AuthWrapper
      imgUrl="/assets/images/verify-code-page.jpg"
      icon={<MailCheck className="size-4" />}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-2xl font-bold">Verification</h1>
            <p className="text-sm text-muted-foreground">
              Please enter the verification code sent to your email.
            </p>
            <p className="text-sm text-muted-foreground">{email}</p>
          </div>

          {/* OTP FIELD */}
          <Field data-invalid={!!errors.code}>
            <div className="flex flex-col gap-2 items-center">
              <p className="text-sm font-medium">Verification Code</p>

              <InputOTP
                maxLength={6}
                value={code}
                onChange={(val) => {
                  setValue("code", val, { shouldValidate: true });
                }}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>

              {errors.code && <FieldError errors={[errors.code]} />}
            </div>
          </Field>

          {/* SUBMIT */}
          <Field>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting && <Spinner data-icon="inline-start" />}
              Verify
            </Button>
          </Field>

          {/* FOOTER */}
          <div className="flex flex-col items-center gap-2 text-center">
            <Link
              href="/signin"
              className={buttonVariants({ variant: "link" })}
            >
              <ArrowLeft />
              back to Sign in
            </Link>

            {isPending ? (
              <p className="text-sm text-muted-foreground">Processing...</p>
            ) : (
              <p className="text-sm text-muted-foreground">
                Didn&apos;t receive a code?
                {cooldown > 0 ? (
                  <span className="ml-1 text-primary">
                    Resend in {cooldown}s
                  </span>
                ) : (
                  <Button
                    type="button"
                    variant="link"
                    size="sm"
                    className="ml-1 h-auto p-0"
                    onClick={handleResend}
                  >
                    Resend
                  </Button>
                )}
              </p>
            )}
          </div>
        </FieldGroup>
      </form>
    </AuthWrapper>
  );
}
