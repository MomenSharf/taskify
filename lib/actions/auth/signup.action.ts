"use server";

import { authService } from "@/lib/services/auth.service";
import { tryCatchAsync } from "@/lib/utils/try-catch";
import { signupSchema } from "@/lib/validations/auth";

export const signup = async (data: unknown) =>
  tryCatchAsync(async () => {
    const parsed = signupSchema.parse(data);

    const email = await authService.signupUser(parsed);

    return {
      message: "Verification code sent to email.",
      email,
    };
  });