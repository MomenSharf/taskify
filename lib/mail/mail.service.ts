import { AppErrors } from "../errors/app-errors";
import { transporter } from "./transporter";

export const mailService = {
  async send({
    to,
    subject,
    html,
    text,
  }: {
    to: string;
    subject: string;
    html: string;
    text?: string;
  }) {
    try {
      await transporter.sendMail({
        from: `"Auth App" <${process.env.SMTP_USER}>`,
        to,
        subject,
        html,
        text,
      });
    } catch (err) {
      throw AppErrors.internal("Email sending failed", {
        error: err,
      });
    }
  },
};
