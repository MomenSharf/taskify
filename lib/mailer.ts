import nodemailer from "nodemailer";

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
};

const sendEmail = async ({ to, subject, html }: SendEmailOptions) => {
  await transporter.sendMail({
    from: `Taskify <${process.env.FROM_EMAIL || process.env.SMTP_USER}>`,
    to,
    subject,
    html,
  });
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
    <div
      style="
        background-color:#f4f7fb;
        padding:40px 20px;
        font-family:Arial,sans-serif;
      "
    >
      <div
        style="
          max-width:600px;
          margin:0 auto;
          background:#ffffff;
          border-radius:16px;
          overflow:hidden;
          border:1px solid #e5e7eb;
        "
      >
        <div
          style="
            background:#4f46e5;
            padding:32px;
            text-align:center;
          "
        >
          <h1
            style="
              color:#ffffff;
              margin:0;
              font-size:28px;
              font-weight:700;
            "
          >
            Taskify
          </h1>
        </div>

        <div style="padding:40px 32px;">
          <h2
            style="
              margin:0 0 16px;
              color:#111827;
              font-size:24px;
            "
          >
            ${title}
          </h2>

          <p
            style="
              margin:0 0 32px;
              color:#6b7280;
              font-size:16px;
              line-height:1.7;
            "
          >
            ${description}
          </p>

          <div style="text-align:center;">
            ${content}
          </div>

          <p
            style="
              margin-top:32px;
              color:#9ca3af;
              font-size:14px;
              line-height:1.6;
            "
          >
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
  try {
    const html = createEmailTemplate({
      title: "Verify Your Email",
      description:
        "Welcome to Taskify. Use the verification code below to confirm your email address and activate your account.",
      content: `
        <div
          style="
            display:inline-block;
            background:#eef2ff;
            color:#4338ca;
            padding:18px 32px;
            border-radius:12px;
            font-size:32px;
            font-weight:700;
            letter-spacing:8px;
          "
        >
          ${verificationCode}
        </div>
      `,
      footer:
        "This verification code will expire in 10 minutes. If you did not create a Taskify account, you can safely ignore this email.",
    });

    await sendEmail({
      to: email,
      subject: "Verify Your Taskify Account",
      html,
    });

    return {
      success: true,
      message: "Verification email sent successfully",
    };
  } catch {
    return {
      success: false,
      message: "Failed to send verification email",
    };
  }
};

export const sendResetPasswordEmail = async (
  email: string,
  resetUrl: string,
) => {
  try {
    const html = createEmailTemplate({
      title: "Reset Your Password",
      description:
        "We received a request to reset your Taskify account password. Click the button below to continue.",
      content: `
        <a
          href="${resetUrl}"
          style="
            display:inline-block;
            background:#4f46e5;
            color:#ffffff;
            text-decoration:none;
            padding:14px 28px;
            border-radius:10px;
            font-size:16px;
            font-weight:600;
          "
        >
          Reset Password
        </a>
      `,
      footer:
        "This password reset link will expire in 10 minutes. If you did not request a password reset, please ignore this email.",
    });

    await sendEmail({
      to: email,
      subject: "Reset Your Taskify Password",
      html,
    });

    return {
      success: true,
      message: "Password reset email sent successfully",
    };
  } catch {
    return {
      success: false,
      message: "Failed to send password reset email",
    };
  }
};
