"use server";

import db from "@/lib/db";
import { AppError } from "@/lib/errors/app-error";
import { sendVerificationEmail } from "@/lib/mailer";

// Save verification code to DB (delete old first)
export const createAndSendVerificationCode = async (identifier: string) => {
  try {
    await db.verificationToken.deleteMany({ where: { identifier } });

    const token = "000000"; // replace with real OTP generator in production
    const expires = new Date(Date.now() + 10 * 60 * 1000);

    const verificationCode = await db.verificationToken.create({
      data: { identifier, token, expires },
    });

    if (!verificationCode) {
      throw new AppError(
        "Failed to create verification code",
        500,
        "CODE_CREATE_FAILED",
      );
    }

    const sendRes = await sendVerificationEmail(identifier, token);

    if (!sendRes.success) {
      throw new AppError(
        "Failed to send verification email",
        500,
        "EMAIL_SEND_FAILED",
      );
    }

    return {
      success: true,
      message: "Verification code created and email sent",
    };
  } catch (err: unknown) {
    if (err instanceof AppError) throw err;

    throw new AppError(
      "Failed to create verification code",
      500,
      "CREATE_VERIFICATION_FAILED",
    );
  }
};

// Resend verification email
export const resendVerificationEmail = async (email: string) => {
  try {
    await db.verificationToken.deleteMany({ where: { identifier: email } });

    return await createAndSendVerificationCode(email);
  } catch (err: unknown) {
    if (err instanceof AppError) throw err;

    throw new AppError(
      "Failed to resend verification email",
      500,
      "RESEND_EMAIL_FAILED",
    );
  }
};

// Verify code
export const verifyCode = async (email: string, token: string) => {
  try {
    const record = await db.verificationToken.findFirst({
      where: { identifier: email },
      orderBy: { createdAt: "desc" },
    });

    if (!record) {
      throw new AppError(
        "No code found for this email.",
        404,
        "CODE_NOT_FOUND",
      );
    }

    if (record.expires < new Date()) {
      await db.verificationToken.deleteMany({
        where: { identifier: email },
      });

      throw new AppError(
        "Code expired, request a new one.",
        400,
        "CODE_EXPIRED",
      );
    }

    if (record.token !== token) {
      throw new AppError("Invalid code.", 400, "INVALID_CODE");
    }

    await db.user.update({
      where: { email },
      data: {
        emailVerified: new Date(),
      },
    });

    await db.verificationToken.deleteMany({
      where: { identifier: email },
    });

    return {
      success: true,
      message: "Code verified.",
    };
  } catch (err: unknown) {
    if (err instanceof AppError) throw err;

    throw new AppError("Failed to verify code.", 500, "VERIFY_FAILED");
  }
};

// Validate email verification request
export const validateEmailVerificationRequest = async (email: string) => {
  try {
    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new AppError("User does not exist", 404, "USER_NOT_FOUND");
    }

    if (user.emailVerified) {
      return {
        redirect: `/signin?errorMessage=${encodeURIComponent(
          "Your email is already verified",
        )}`,
      };
    }

    const lastCode = await db.verificationToken.findFirst({
      where: { identifier: email },
      orderBy: { createdAt: "desc" },
    });

    if (!lastCode) {
      throw new AppError(
        "No verification code was sent to this email",
        400,
        "NO_CODE_SENT",
      );
    }

    const diff = Date.now() - lastCode.createdAt.getTime();
    const secondsLeft = diff < 60 * 1000 ? 60 - Math.floor(diff / 1000) : 0;

    return {
      secondsLeft,
    };
  } catch (err: unknown) {
    if (err instanceof AppError) throw err;

    throw new AppError(
      "Failed to validate verification request",
      500,
      "VALIDATION_FAILED",
    );
  }
};
