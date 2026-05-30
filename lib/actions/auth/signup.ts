"use server";

import { hash } from "bcrypt";
import { createAndSendVerificationCode } from "./verification-email";
import { AppError } from "@/lib/errors/app-error";
import { signupSchema, SignupInput } from "@/lib/validations/auth";
import db from "@/lib/db";

export const signup = async (data: SignupInput) => {
  try {
    const { email, password, name } = signupSchema.parse(data);

    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new AppError(
        existingUser.password
          ? "This email is already registered. Please sign in instead."
          : "This email is already registered with Google. Please sign in with Google.",
        400,
        existingUser.password ? "EMAIL_ALREADY_EXISTS" : "GOOGLE_ACCOUNT_EXISTS"
      );
    }

    const sendRes = await createAndSendVerificationCode(email);

    if (!sendRes.success) {
      throw new AppError(
        sendRes.message,
        500,
        "VERIFICATION_EMAIL_FAILED"
      );
    }

    const user = await db.user.create({
      data: {
        email: email.toLowerCase(),
        password: await hash(password, 10),
        name,
      },
    });

    if (!user) {
      throw new AppError("Failed to create user.", 500, "USER_CREATE_FAILED");
    }

    return {
      success: true,
      message: "Verification code sent to email.",
    };
  } catch (err: unknown) {
    if (err instanceof AppError) throw err;
    throw new AppError(
      "Failed to register account",
      500,
      "SIGNUP_FAILED"
    );
  }
};