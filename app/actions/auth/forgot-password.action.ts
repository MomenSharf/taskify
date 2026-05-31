"use server";

import prisma from "@/lib/db/prisma";
import {
  notFound,
  badRequest,
  AppError,
} from "@/lib/errors/app-error";
import { sendResetPasswordEmail } from "@/lib/mailer";
import bcrypt from "bcrypt";
import crypto from "crypto";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

/* =========================
   CREATE RESET TOKEN
========================= */

export const createAndSendPasswordResetToken = async (email: string) => {
  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) throw notFound("User not found");

    await prisma.verificationToken.deleteMany({
      where: { identifier: email },
    });

    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.verificationToken.create({
      data: { identifier: email, token, expires },
    });

    const resetUrl = `${BASE_URL}/reset?token=${token}&email=${encodeURIComponent(email)}`;

    const sendRes = await sendResetPasswordEmail(email, resetUrl);

    if (!sendRes.success) {
      throw badRequest("Failed to send email. Try again later.");
    }

    return {
      success: true,
      message: "Reset link sent to your email",
    };
  } catch (error) {
    throw AppError.from(error);
  }
};

/* =========================
   RESET PASSWORD
========================= */

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
      throw badRequest("Passwords do not match");
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) throw notFound("User not found");

    const record = await prisma.verificationToken.findUnique({
      where: { identifier_token: { identifier: email, token } },
    });

    if (!record) {
      throw badRequest("Invalid or expired token");
    }

    if (record.expires < new Date()) {
      await prisma.verificationToken.delete({
        where: { identifier_token: { identifier: email, token } },
      });

      throw badRequest("Token expired. Request a new one");
    }

    const isSamePassword = await bcrypt.compare(
      password,
      user.password ?? ""
    );

    if (isSamePassword) {
      throw badRequest("New password must be different from old password");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });

    await prisma.verificationToken.deleteMany({
      where: { identifier: email },
    });

    return {
      success: true,
      message: "Password reset successfully",
    };
  } catch (error) {
    throw AppError.from(error);
  }
};

/* =========================
   VERIFY TOKEN
========================= */

export async function verifyToken(token: string, email: string) {
  try {
    const foundToken = await prisma.verificationToken.findUnique({
      where: { identifier_token: { identifier: email, token } },
    });

    if (!foundToken) {
      throw badRequest("Invalid token");
    }

    if (foundToken.expires < new Date()) {
      await prisma.verificationToken.delete({
        where: { identifier_token: { identifier: email, token } },
      });

      throw badRequest("Token expired");
    }

    return {
      success: true,
      message: "Token is valid",
      token: foundToken,
    };
  } catch (error) {
    throw AppError.from(error);
  }
}