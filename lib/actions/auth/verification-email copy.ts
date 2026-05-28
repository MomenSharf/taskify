"use server";

import { sendVerificationEmail } from "@/lib/mailer";
import { db } from "@/lib/prisma";


// Save verification code to DB (delete old first)
export const createAndSendVerificationCode = async (email: string) => {
  try {
    // Delete old codes for this email

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    const verificationCode = await db.verificationCode.create({
      data: { email, code, expiresAt },
    });

    if (!verificationCode) {
      return { success: false, message: "Failed to create verification code" };
    }

    const sendRes = await sendVerificationEmail(email, code);
    if (!sendRes.success) {
      return { success: false, message: "Failed to send verification email" };
    }

    return {
      success: true,
      message: "Verification code created and email sent",
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error: unknown) {
    return { success: false, message: "Failed to create verification code" };
  }
};

export const resendVerificationEmail = async (email: string) => {
  try {
    // Get latest verification code for this email
    const lastCode = await db.verificationCode.findFirst({
      where: { email },
      orderBy: { createdAt: "desc" },
    });

    // ⏳ Add 1-minute hold logic
    if (
      lastCode &&
      new Date().getTime() - lastCode.createdAt.getTime() < 60 * 1000
    ) {
      const secondsLeft =
        60 -
        Math.floor(
          (new Date().getTime() - lastCode.createdAt.getTime()) / 1000
        );
      return {
        success: false,
        message: `Please wait ${secondsLeft}s before requesting a new code.`,
        secondsLeft,
      };
    }
    // Delete old codes for this email
    await db.verificationCode.deleteMany({ where: { email } });

    const res = await createAndSendVerificationCode(email);
    return res;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error: unknown) {
    return { success: false, message: "Failed to resend verification email" };
  }
};

export const verifyCode = async (email: string, code: string) => {
  try {
    const record = await db.verificationCode.findFirst({
      where: { email },
      orderBy: { createdAt: "desc" },
    });
    if (!record)
      return { success: false, message: "No code found for this email." };
    if (record.expiresAt < new Date()) {
      await db.verificationCode.delete({ where: { id: record.id } });
      return {
        success: false,
        message: "Code expired, request a new one.",
      };
    }
    if (record.code !== code) {
      return { success: false, message: "Invalid code." };
    }

    await db.user.update({
      where: { email },
      data: {
        emailVerified: new Date(),
      },
    });

    await db.verificationCode.deleteMany({ where: { email } });

    return { success: true, message: "Code verified." };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error: unknown) {
    return { success: false, message: "Failed to verify code." };
  }
};

export const getResendCooldown = async (email: string) => {
  try {
    const lastCode = await db.verificationCode.findFirst({
      where: { email },
      orderBy: { createdAt: "desc" },
    });

    if (!lastCode) {
      return { secondsLeft: 0 };
    }

    const diff = new Date().getTime() - lastCode.createdAt.getTime();
    const secondsLeft = diff < 60 * 1000 ? 60 - Math.floor(diff / 1000) : 0;

    return { secondsLeft };
  } catch {
    return { secondsLeft: 0 };
  }
};
