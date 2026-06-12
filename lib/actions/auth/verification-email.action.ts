"use server";

import { authService } from "@/lib/services/auth.service";
import { tryCatchAsync } from "@/lib/utils/try-catch";

export const validateEmailVerification = async (email: string) =>
  tryCatchAsync(async () => {
    const res = await authService.validateEmailVerificationRequest(email);

    const messages = {
      ok: "A new verification code has been sent to your email.",
      already_verified: "Your email is already verified.",
    };
    return {
      message: messages[res.status],
      ...res,
    };
  });

export const verifyVerificationCode = async (email: string, token: string) =>
  tryCatchAsync(async () => {
    const res = await authService.verifyCode(email, token);

    return {
      message: "Your email has been verified. You can now sign in.",
      email: res.email,
    };
  });

export const sendVerificationCode = async (email: string) =>
  tryCatchAsync(async () => {
    const res = await authService.sendVerificationCode(email);

    return {
      message: "A new verification code has been sent to your email.",
      email: res.to,
    };
  });
