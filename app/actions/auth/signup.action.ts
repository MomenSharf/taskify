"use server";

import prisma from "@/lib/db/prisma";
import { AppError, badRequest } from "@/lib/errors/app-error";
import { SignupInput, signupSchema } from "@/lib/validations/auth";
import { hash } from "bcrypt";
import { createAndSendVerificationCode } from "./verification-email.action";

export const signup = async (data: SignupInput) => {
  try {
    const { email, password, name } = signupSchema.parse(data);

    const normalizedEmail = email.toLowerCase();

    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      throw badRequest(
        existingUser.password
          ? "Email already registered. Please sign in instead."
          : "Email already registered with Google. Please sign in with Google."
      );
    }

    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        password: await hash(password, 10),
        name,
      },
    });

    if (!user) {
      throw badRequest("Failed to create user");
    }

    const sendRes = await createAndSendVerificationCode(normalizedEmail);

    if (!sendRes.success) {
      throw badRequest("Failed to send verification email");
    }

    return {
      success: true,
      message: "Verification code sent to email.",
    };
  } catch (error) {
    throw AppError.from(error);
  }
};