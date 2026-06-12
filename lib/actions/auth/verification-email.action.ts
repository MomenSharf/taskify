"use server";

import { authService } from "@/lib/services/auth.service";
import { safeAction } from "../save-action";

export const validateEmailVerification = async (email: string) =>
  safeAction(async () => {
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

export const verifyCode = async (email: string, token: string) =>
  safeAction(async () => {
    const res = await authService.verifyCode(email, token);

    return {
      message: "Your email has been verified. You can now sign in.",
      email: res.email,
    };
  });
export const sendVerificationCode = async (email: string) =>
  safeAction(async () => {
    const res = await authService.sendVerificationCode(email);

    return {
      message: "A new verification code has been sent to your email.",
      email: res.to,
    };
  });
