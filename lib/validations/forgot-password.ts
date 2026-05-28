"use server";

import { sendResetPasswordEmail } from "@/lib/mailer";
import { db } from "@/lib/prisma";
import crypto from "crypto";
import bcrypt from "bcryptjs";

// 🔑 Generate & send password reset token
export const createAndSendPasswordResetToken = async (email: string) => {
  try {
    // Check if user exists
    const user = await db.user.findUnique({ where: { email } });
    if (!user) {
      return { success: false, message: "No account found with this email" };
    }

    // Delete old tokens for this email
    await db.verificationToken.deleteMany({ where: { email } });

    // Create secure random token
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    const resetToken = await db.verificationToken.create({
      data: { email, token, expiresAt },
    });

    if (!resetToken) {
      return { success: false, message: "Failed to create reset token" };
    }

    const resetUrl = `${
      process.env.NEXT_PUBLIC_BASE_URL
    }/reset?token=${token}&email=${encodeURIComponent(email)}`;

    const sendRes = await sendResetPasswordEmail(email, resetUrl);
    if (!sendRes.success) {
      return { success: false, message: "Failed to send reset email" };
    }

    return {
      success: true,
      message: "Password reset link sent to your email",
    };
  } catch {
    return { success: false, message: "Failed to create reset token" };
  }
};

// ✅ Verify token & reset password
export const resetPassword = async ({
  token,
  password,
  confirmPassword,
}: {
  token: string;
  password: string;
  confirmPassword: string;
}) => {
  try {
    if (password !== confirmPassword) {
      return {
        success: false,
        message: "Passwords do not match. Please try again.",
      };
    }
    const record = await db.verificationToken.findFirst({
      where: { token },
      orderBy: { createdAt: "desc" },
    });

    if (!record)
      return { success: false, message: "Invalid or expired token." };

    if (record.expiresAt < new Date()) {
      await db.verificationToken.delete({ where: { id: record.id } });
      return { success: false, message: "Token expired, request a new one." };
    }

    const user = await db.user.findUnique({
      where: { email: record.email },
    });

    if (!user) {
      return { success: false, message: "User not found." };
    }

    const isSamePassword = await bcrypt.compare(password, user.password ?? '');
    if (isSamePassword) {
      return {
        success: false,
        message: "New password must be different from the old one.",
      };
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    await db.user.update({
      where: { email: record.email },
      data: { password: hashedPassword },
    });

    // Delete used tokens
    await db.verificationToken.deleteMany({ where: { email: record.token } });

    return { success: true, message: "Password reset successfully." };
  } catch {
    return { success: false, message: "Failed to reset password." };
  }
};

export async function verifyToken(token: string) {
  try {
    const foundToken = await db.verificationToken.findUnique({
      where: { token },
    });

    if (!foundToken) {
      return { success: false, message: "Invalid token" };
    }

    if (foundToken.expiresAt < new Date()) {
      return { success: false, message: "Token expired" };
    }

    return { success: true, message: "Token is valid", token: foundToken };
  } catch (error) {
    console.error("Token verification error:", error);
    return { success: false, message: "Something went wrong" };
  }
}
