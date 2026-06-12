import prisma from "@/lib/db/prisma";
import { hash } from "bcrypt";
import { AppErrors } from "@/lib/errors/app-errors";
import { SignupInput } from "../validations/auth";
import { verificationTemplate } from "../mail/templates/verification";
import { mailService } from "../mail/mail.service";
import { userService } from "./user.service";
import { email } from "zod";
import { redirect } from "next/navigation";

export const authService = {
  // Sign Up
  async signupUser(data: SignupInput) {
    const normalizedEmail = data.email.toLowerCase();

    const existingUser = await userService.getUserByEmail(normalizedEmail);

    if (existingUser) {
      if (!existingUser.emailVerified) {
        await this.sendVerificationCode(existingUser.email);

        throw AppErrors.badRequest(
          "Email already registered but not verified. A new verification code has been sent.",
        );
      }

      throw AppErrors.badRequest(
        existingUser.password
          ? "Email already registered. Please sign in instead."
          : "Email registered with Google. Please sign in with Google.",
      );
    }

    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        password: await hash(data.password, 10),
        name: data.name,
      },
    });

    await this.sendVerificationCode(user.email);

    return {
      email: user.email,
    };
  },

  // Verification
  async sendVerificationCode(identifier: string) {
    await prisma.verificationToken.deleteMany({
      where: { identifier },
    });

    const token = "000000"; // replace with real OTP generator
    //!!! const token = crypto.randomInt(100000, 1000000).toString()
    const expires = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.verificationToken.create({
      data: { identifier, token, expires },
    });

    const template = verificationTemplate(token);

    await mailService.send({
      to: identifier,
      ...template,
    });

    return {
      sent: true,
      to: identifier,
    } as const;
  },

  async validateEmailVerificationRequest(email: string) {
    const user = await userService.getUserByEmail(email);

    if (!user) {
      throw AppErrors.notFound("User not found");
    }

    if (user.emailVerified) {
      return {
        status: "already_verified",
      } as const;
    }

    const lastCode = await prisma.verificationToken.findFirst({
      where: { identifier: email },
      orderBy: { createdAt: "desc" },
    });

    if (!lastCode) {
      throw AppErrors.badRequest("No verification code sent to this email");
    }

    const diff = Date.now() - lastCode.createdAt.getTime();
    const secondsLeft = diff < 60 * 1000 ? 60 - Math.floor(diff / 1000) : 0;

    return {
      status: "ok",
      secondsLeft,
      attempts: lastCode.attempts,
      maxAttempts: lastCode.maxAttempts,
    } as const;
  },

  async verifyCode(email: string, token: string) {
    const record = await prisma.verificationToken.findFirst({
      where: { identifier: email, token },
      orderBy: { createdAt: "desc" },
    });

    if (!record) throw AppErrors.notFound("Verification code not found");

    if (record.expires < new Date()) {
      await prisma.verificationToken.delete({ where: { id: record.id } });
      throw AppErrors.badRequest("Verification code expired");
    }

    if (record.attempts >= record.maxAttempts) {
      await prisma.verificationToken.delete({ where: { id: record.id } });
      throw AppErrors.badRequest("Too many attempts. Request a new code.");
    }

    await prisma.$transaction([
      prisma.user.update({
        where: { email },
        data: { emailVerified: new Date() },
      }),
      prisma.verificationToken.deleteMany({
        where: { identifier: email },
      }),
    ]);

    return {
      email,
    } as const;
  },
};
