"use server";

import db from "@/lib/db";
import { AppError } from "@/lib/errors/app-error";
import { sendResetPasswordEmail } from "@/lib/mailer";
import bcrypt from "bcrypt";
import crypto from "crypto";

export const createAndSendPasswordResetToken = async (email: string) => {
  try {
    const user = await db.user.findUnique({ where: { email } });

    if (!user) {
      throw new AppError("No account found with this email", 404, "USER_NOT_FOUND");
    }

    await db.verificationToken.deleteMany({ where: { identifier: email } });

    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 10 * 60 * 1000);

    const resetToken = await db.verificationToken.create({
      data: { identifier: email, token, expires },
    });

    if (!resetToken) {
      throw new AppError("Failed to create reset token", 500, "TOKEN_CREATE_FAILED");
    }

    const resetUrl = `${
      process.env.NEXT_PUBLIC_BASE_URL
    }/reset?token=${token}&email=${encodeURIComponent(email)}`;

    const sendRes = await sendResetPasswordEmail(email, resetUrl);

    if (!sendRes.success) {
      throw new AppError("Failed to send reset email", 500, "EMAIL_SEND_FAILED");
    }

    return {
      success: true,
      message: "Password reset link sent to your email",
    };
  } catch (err: unknown) {
    if (err instanceof AppError) throw err;
    throw new AppError("Internal server error", 500, "INTERNAL_ERROR");
  }
};

export const resetPassword = async ({
  token,
  email,
  password,
  confirmPassword,
}: {
  token: string;
  email: string;
  password: string;
  confirmPassword: string;
}) => {
  try {
    if (password !== confirmPassword) {
      throw new AppError(
        "Passwords do not match. Please try again.",
        400,
        "PASSWORD_MISMATCH"
      );
    }

    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new AppError("User not found.", 404, "USER_NOT_FOUND");
    }

    const record = await db.verificationToken.findUnique({
      where: { identifier_token: { identifier: email, token } },
    });

    if (!record) {
      throw new AppError("Invalid or expired token.", 400, "INVALID_TOKEN");
    }

    if (record.expires < new Date()) {
      await db.verificationToken.delete({
        where: { identifier_token: { identifier: email, token } },
      });

      throw new AppError(
        "Token expired, request a new one.",
        410,
        "TOKEN_EXPIRED"
      );
    }

    const isSamePassword = await bcrypt.compare(password, user.password ?? "");

    if (isSamePassword) {
      throw new AppError(
        "New password must be different from the old one.",
        400,
        "SAME_PASSWORD"
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.user.update({
      where: { email },
      data: { password: hashedPassword },
    });

    await db.verificationToken.deleteMany({ where: { identifier: email } });

    return { success: true, message: "Password reset successfully." };
  } catch (error: unknown) {
    if (error instanceof AppError) throw error;
    throw new AppError("Failed to reset password", 500, "RESET_FAILED");
  }
};

export async function verifyToken(token: string, email: string) {
  try {
    const foundToken = await db.verificationToken.findUnique({
      where: { identifier_token: { identifier: email, token } },
    });

    if (!foundToken) {
      throw new AppError("Invalid token", 400, "INVALID_TOKEN");
    }

    if (foundToken.expires < new Date()) {
      throw new AppError("Token expired", 410, "TOKEN_EXPIRED");
    }

    return {
      success: true,
      message: "Token is valid",
      token: foundToken,
    };
  } catch (error: unknown) {
    if (error instanceof AppError) throw error;
    throw new AppError("Something went wrong", 500, "VERIFY_FAILED");
  }
}