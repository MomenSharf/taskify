import nodemailer from "nodemailer";
import { AppError } from "./errors/app-error";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

type SendEmailOptions = {
  to: string;
  subject: string;
  html: string;
  text?: string;
};

const sendEmail = async ({
  to,
  subject,
  html,
  text,
}: SendEmailOptions) => {
  try {
    return await transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject,
      text,
      html,
    });
  } catch {
    throw new AppError("Email service failed to send message", 500);
  }
};

const createEmailTemplate = ({
  title,
  description,
  content,
  footer,
}: {
  title: string;
  description: string;
  content: string;
  footer: string;
}) => {
  return `
    <div style="background:#f4f6fb;padding:30px 12px;font-family:Arial,sans-serif;">
      <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:10px;overflow:hidden;border:1px solid #e5e7eb;">

        <div style="background:#4f46e5;padding:22px;text-align:center;">
          <h1 style="color:#fff;margin:0;font-size:22px;font-weight:700;">
            Taskify
          </h1>
        </div>

        <div style="padding:28px 22px;">
          <h2 style="margin:0 0 10px;color:#111827;font-size:20px;">
            ${title}
          </h2>

          <p style="margin:0 0 20px;color:#6b7280;font-size:14px;line-height:1.5;">
            ${description}
          </p>

          <div style="text-align:center;margin:20px 0;">
            ${content}
          </div>

          <p style="margin-top:24px;color:#9ca3af;font-size:12px;line-height:1.5;">
            ${footer}
          </p>
        </div>

      </div>
    </div>
  `;
};

export const sendVerificationEmail = async (
  email: string,
  verificationCode: string,
) => {
  const html = createEmailTemplate({
    title: "Verify your email",
    description: "Use the code below to complete your registration.",
    content: `
      <div style="
        display:inline-block;
        background:#eef2ff;
        color:#3730a3;
        padding:14px 22px;
        border-radius:8px;
        font-size:26px;
        font-weight:700;
        letter-spacing:4px;
      ">
        ${verificationCode}
      </div>
    `,
    footer: "This code expires in 10 minutes. Ignore if you didn't request it.",
  });

  await sendEmail({
    to: email,
    subject: "Taskify - Verification Code",
    text: `Your verification code is: ${verificationCode}`,
    html,
  });

  return {
    success: true,
    message: "Verification email sent successfully",
  };
};

export const sendResetPasswordEmail = async (
  email: string,
  resetUrl: string,
) => {
  const html = createEmailTemplate({
    title: "Reset your password",
    description: "Click the button below to reset your password.",
    content: `
      <a
        href="${resetUrl}"
        style="
          display:inline-block;
          background:#4f46e5;
          color:#ffffff;
          text-decoration:none;
          padding:12px 20px;
          border-radius:8px;
          font-size:14px;
          font-weight:600;
        "
      >
        Reset Password
      </a>
    `,
    footer: "This link expires in 10 minutes. Ignore if not requested.",
  });

  await sendEmail({
    to: email,
    subject: "Taskify - Password Reset",
    text: `Reset your password using this link: ${resetUrl}`,
    html,
  });

  return {
    success: true,
    message: "Password reset email sent successfully",
  };
};