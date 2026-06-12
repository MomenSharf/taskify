export const verificationTemplate = (
  verificationCode: string,
) => ({
  subject: "Taskify - Verification Code",
  text: `Your verification code is: ${verificationCode}`,
  html: `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Verification Code</title>
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
          <tr>
            <td
              align="center"
              style="
                background:#111827;
                padding:32px 24px;
                color:#ffffff;
              "
            >
              <h1 style="margin:0;font-size:28px;">
                Taskify
              </h1>
            </td>
          </tr>

          <tr>
            <td style="padding:40px 32px;text-align:center;">
              <h2
                style="
                  margin:0 0 16px;
                  color:#111827;
                  font-size:24px;
                "
              >
                Verify Your Email
              </h2>

              <p
                style="
                  margin:0 0 32px;
                  color:#6b7280;
                  font-size:16px;
                  line-height:1.6;
                "
              >
                Use the verification code below to complete your sign in.
              </p>

              <div
                style="
                  display:inline-block;
                  background:#f3f4f6;
                  border:1px solid #e5e7eb;
                  border-radius:12px;
                  padding:18px 32px;
                  margin-bottom:32px;
                "
              >
                <span
                  style="
                    font-size:36px;
                    font-weight:700;
                    letter-spacing:8px;
                    color:#111827;
                  "
                >
                  ${verificationCode}
                </span>
              </div>

              <p
                style="
                  margin:0;
                  color:#6b7280;
                  font-size:14px;
                  line-height:1.6;
                "
              >
                This code will expire in 10 minutes.
              </p>
            </td>
          </tr>

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
              If you didn't request this code, you can safely ignore this
              email.
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