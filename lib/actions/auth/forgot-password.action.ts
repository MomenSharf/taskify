'use server'

import { authService } from "@/lib/services/auth.service";
import { tryCatchAsync } from "@/lib/utils/try-catch";

export const sendResetPasswordLink = async (email: string) =>
  tryCatchAsync(async () => {
    const res = await authService.sendPasswordResetToken(email);

    return {
      message: "Password reset link sent successfully.",
      email: res.to,
    };
  });
  
export const resetPassword = async (data: {
  email: string;
  token: string;
  newPassword: string;
}) =>
  tryCatchAsync(async () => {
    const res = await authService.resetPassword(data);

      console.log(`🚀 ~ resetPassword ~ "Password reset successfully.":`, "Password reset successfully.")
    return {
      message: "Password reset successfully.",
      email: res.email,
    };
  });
