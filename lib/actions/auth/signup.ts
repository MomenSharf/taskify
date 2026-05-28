"use server";

import { db } from "@/lib/db";
import { hash } from "bcrypt";
import { createAndSendVerificationCode } from "./verification-email";
import { AppError } from "@/lib/errors/app-error";
import { signupSchema, SignupInput } from "@/lib/validations/auth";

export const signup = async (data: SignupInput) => {
  try {
    const { email, password, name } = signupSchema.parse(data)

    const existingUser = await db.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      throw new AppError(
        existingUser.password
          ? "This email is already registered. Please sign in instead."
          : "This email is already registered with Google. Please sign in with Google",
        400
      )
    }

    const user = await db.user.create({
      data: {
        email: email.toLowerCase(),
        password: await hash(password, 10),
        name,
      },
    })

    if (!user) {
      throw new AppError("Failed to create user.", 500)
    }

    const sendRes = await createAndSendVerificationCode(email)

    if (!sendRes.success) {
      throw new AppError(sendRes.message, 400)
    }

    return { success: true, message: "Verification code sent to email." }
  } catch (err: unknown) {
    if (err instanceof AppError) throw err
    throw new AppError("Failed to register account", 500)
  }
}

// export async function verifyRegisterCode({
//   email,
//   code,
// }: {
//   email: string;
//   code: string;
// }) {
//   try {
//     const record = await db.verificationToken.findUnique({
//       where: {
//         identifier_token: {
//           identifier: email,
//           token: code,
//         },
//       },
//     });

//     if (!record) throw new AppError("No code found for this email.", 400);

//     if (record.expires < new Date()) {
//       await db.verificationToken.deleteMany({ where: { identifier: email } });

//       throw new AppError("Code expired, request a new one.", 500);
//     }

//     if (record.code !== code) {
//       throw new AppError("Invalid code.", 500);
//     }

//     const user = await db.user.update({
//       where: { email },
//       data: {
//         emailVerified: new Date(),
//       },
//     });

//     await db.verificationCode.deleteMany({ where: { email } });

//     return { success: true, user };
//   } catch (error) {
//     return handleError(error);
//   }
// }
