"use server";

import prisma from "@/lib/db/prisma";
import { AppError, badRequest, notFound } from "@/lib/errors/app-error";
import { sendVerificationEmail } from "@/lib/mailer";

/* =========================
   CREATE & SEND CODE
========================= */

export const createAndSendVerificationCode = async (identifier: string) => {
  try {
    await prisma.verificationToken.deleteMany({
      where: { identifier },
    });

    const token = "000000"; // replace with real OTP generator
    //!!1 const token = crypto.randomInt(100000, 1000000).toString()
    const expires = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.verificationToken.create({
      data: { identifier, token, expires },
    });

    const sendRes = await sendVerificationEmail(identifier, token);

    if (!sendRes.success) {
      throw badRequest("Failed to send verification email");
    }

    return {
      success: true,
      message: "Verification code sent",
    };
  } catch (error) {
    throw AppError.from(error);
  }
};

/* =========================
   RESEND CODE
========================= */

export const resendVerificationEmail = async (email: string) => {
  try {
    await prisma.verificationToken.deleteMany({
      where: { identifier: email },
    });

    return await createAndSendVerificationCode(email);
  } catch (error) {
    throw AppError.from(error);
  }
};

/* =========================
   VERIFY CODE
========================= */

export const verifyCode = async (email: string, token: string) => {
  try {
    const record = await prisma.verificationToken.findFirst({
      where: { identifier: email, token },
      orderBy: { createdAt: "desc" },
    });

    if (!record) {
      throw notFound("Verification code not found");
    }

    if (record.expires < new Date()) {
      await prisma.verificationToken.delete({
        where: { id: record.id },
      });

      throw badRequest("Verification code expired");
    }

    if (record.token !== token) {
      if (record.attempts >= record.maxAttempts) {
        await prisma.verificationToken.delete({
          where: { id: record.id },
        });

        throw badRequest("Too many attempts. Request a new code.");
      }

      const updated = await prisma.verificationToken.update({
        where: {
          id: record.id,
        },
        data: {
          attempts: { increment: 1 },
        },
      });

      const remaining = updated.maxAttempts - updated.attempts;

      throw badRequest(`Invalid verification code. ${remaining} attempts left`);
    }

    await prisma.user.update({
      where: { email },
      data: {
        emailVerified: new Date(),
      },
    });

    await prisma.verificationToken.deleteMany({
      where: { identifier: email },
    });

    return {
      success: true,
      message: "Email verified successfully",
    };
  } catch (error) {
    throw AppError.from(error);
  }
};

/* =========================
   VALIDATION CHECK
========================= */

export const validateEmailVerificationRequest = async (email: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) throw notFound("User not found");

    if (user.emailVerified) {
      
      return {
        redirect: `/signin?errorMessage=${encodeURIComponent(
          "Email already verified",
        )}`,
      };
    }

    const lastCode = await prisma.verificationToken.findFirst({
      where: { identifier: email },
      orderBy: { createdAt: "desc" },
    });

    if (!lastCode) {
      throw badRequest("No verification code sent to this email");
    }

    const diff = Date.now() - lastCode.createdAt.getTime();
    const secondsLeft = diff < 60 * 1000 ? 60 - Math.floor(diff / 1000) : 0;

    return {
      secondsLeft,
      attempts: lastCode.attempts,
      maxAttempts: lastCode.maxAttempts,
    };
  } catch (error) {
    throw AppError.from(error);
  }
};
