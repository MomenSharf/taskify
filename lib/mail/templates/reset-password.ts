export const resetPasswwordTemplate = (
  resetlink: string,
) => ({
  subject: "Taskify - Reset Password Link",
  text: `Reset your password using this link: ${resetlink}`,
  html: `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Reset Password</title>
</head>

<body style="margin:0;padding:0;background:#f4f4f5;font-family:Arial,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">
    <tr>
      <td align="center">

        <table
          width="100%"
          cellpadding="0"
          cellspacing="0"
          style="
            max-width:600px;
            background:#ffffff;
            border-radius:16px;
            overflow:hidden;
            box-shadow:0 4px 20px rgba(0,0,0,0.08);
          "
        >

          <!-- Header -->
          <tr>
            <td
              align="center"
              style="background:#111827;padding:32px 24px;color:#ffffff;"
            >
              <h1 style="margin:0;font-size:28px;">
                Taskify
              </h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding:40px 32px;text-align:center;">

              <h2 style="margin:0 0 16px;color:#111827;font-size:24px;">
                Reset Your Password
              </h2>

              <p style="margin:0 0 24px;color:#6b7280;font-size:16px;line-height:1.6;">
                We received a request to reset your password. Click the button below to create a new one.
              </p>

              <!-- Button -->
              <a
                href="${resetlink}"
                style="
                  display:inline-block;
                  background:#111827;
                  color:#ffffff;
                  padding:14px 28px;
                  border-radius:10px;
                  text-decoration:none;
                  font-weight:600;
                  font-size:16px;
                "
              >
                Reset Password
              </a>

              <p style="margin:24px 0 0;color:#6b7280;font-size:13px;line-height:1.6;">
                If the button doesn’t work, copy and paste this link:
              </p>

              <p style="word-break:break-all;font-size:12px;color:#9ca3af;">
                ${resetlink}
              </p>

              <p style="margin-top:24px;color:#ef4444;font-size:13px;line-height:1.6;">
                This link will expire in 15 minutes for your security.
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td
              style="
                padding:24px;
                text-align:center;
                background:#fafafa;
                color:#9ca3af;
                font-size:12px;
              "
            >
              If you didn’t request this password reset, you can safely ignore this email.
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
`,
});