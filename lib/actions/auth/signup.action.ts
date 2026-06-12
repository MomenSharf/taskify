"use server";

import { authService } from "@/lib/services/auth.service";
import { signupSchema } from "@/lib/validations/auth";
import { safeAction } from "../save-action";

export const signup = async (data: unknown) =>
  safeAction(async () => {
    const parsed = signupSchema.parse(data);

    const email = await authService.signupUser(parsed);

    return {
      message: "Verification code sent to email.",
      email,
    };
  });