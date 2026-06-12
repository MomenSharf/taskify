import prisma from "@/lib/db/prisma";
import { AppErrors } from "@/lib/errors/app-errors";
import { hash } from "bcrypt";
import { mailService } from "../mail/mail.service";
import { verificationTemplate } from "../mail/templates/verification";
import { SignupInput } from "../validations/auth";
import { userService } from "./user.service";
import crypto from "crypto";
import { resetPasswwordTemplate } from "../mail/templates/reset-password";
import { compare } from "bcrypt";
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
      data: { identifier, token, expires, type: "EMAIL_VERIFICATION" },
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
      where: { identifier: email, type: "EMAIL_VERIFICATION" },
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
    } as const;
  },

  async verifyCode(email: string, token: string) {
    const record = await prisma.verificationToken.findFirst({
      where: { identifier: email, type: "EMAIL_VERIFICATION" },
      orderBy: { createdAt: "desc" },
    });

    if (!record)
      throw AppErrors.notFound(
        "Verification code not found. Please request a new code.",
      );

    if (record.expires < new Date()) {
      await prisma.verificationToken.delete({ where: { id: record.id } });
      throw AppErrors.badRequest(
        "Verification code expire. Please request a new code",
      );
    }

    if (record.attempts >= record.maxAttempts) {
      await prisma.verificationToken.delete({ where: { id: record.id } });
      throw AppErrors.badRequest("Too many attempts. Request a new code.");
    }

    const isValid = await compare(token, record.token);

    if (!isValid) {
      const updated = await prisma.verificationToken.update({
        where: { id: record.id },
        data: { attempts: { increment: 1 } },
      });

      if (updated.attempts >= updated.maxAttempts) {
        await prisma.verificationToken.delete({ where: { id: record.id } });
        throw AppErrors.badRequest("Too many attempts. Request a new code.");
      }

      const attemptsLeft = Math.max(0, updated.maxAttempts - updated.attempts);

      throw AppErrors.badRequest(
        `Invalid verification code. ${attemptsLeft} attempt${attemptsLeft === 1 ? "" : "s"} left. Please request a new code.`,
      );
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

  // Reset Password
  async sendPasswordResetToken(email: string) {
    const user = await userService.getUserByEmail(email);

    if (!user) {
      throw AppErrors.notFound("User not found");
    }

    if (!user.emailVerified) {
      throw AppErrors.unauthorized(
        "Please verify your email before continuing",
      );
    }

    await prisma.verificationToken.deleteMany({
      where: { identifier: email, type: "PASSWORD_RESET" },
    });

    const token = crypto.randomBytes(32).toString("hex");
    const hashedToken = await hash(token, 10);

    const expires = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token: hashedToken,
        expires,
        type: "PASSWORD_RESET",
      },
    });

    const resetUrl = `${process.env.BASE_URL}/reset-password?token=${hashedToken}&email=${encodeURIComponent(email)}`;

    const template = resetPasswwordTemplate(resetUrl);

    await mailService.send({
      to: email,
      ...template,
    });

    return {
      sent: true,
      to: email,
    } as const;
  },

  async validateResetLinkRequest(email: string, token: string) {
    const user = await userService.getUserByEmail(email);

    if (!user) {
      throw AppErrors.notFound("User not found");
    }

    if (!user.emailVerified) {
      throw AppErrors.unauthorized("User email not verifyed"); //
    }

    const record = await prisma.verificationToken.findFirst({
      where: { identifier: email, token, type: "PASSWORD_RESET" },
      orderBy: { createdAt: "desc" },
    });

    if (!record) throw AppErrors.notFound("Password reset link not valid");

    if (record.expires < new Date()) {
      await prisma.verificationToken.delete({ where: { id: record.id } });
      throw AppErrors.badRequest("Password reset link has expired");
    }

    return { email, userId: user.id };
  },

  async resetPassword({
    email,
    token,
    newPassword,
  }: {
    email: string;
    token: string;
    newPassword: string;
  }) {
    const { userId } = await this.validateResetLinkRequest(email, token);

    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: {
          password: await hash(newPassword, 10),
        },
      }),
      prisma.verificationToken.deleteMany({
        where: { identifier: email },
      }),
    ]);

    return {
      email,
    };
  },
};
