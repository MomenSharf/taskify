export const verificationTemplate = (
  verificationCode: string,
) => ({
  subject: "Taskify - Verification Code",
  text: `Your verification code is: ${verificationCode}`,
  html: "...",
});