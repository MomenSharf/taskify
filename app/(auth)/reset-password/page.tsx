import ResetPassword from "@/components/auth/reset-password";
import { getCurrentUser } from "@/lib/auth/auth-options";
import { authService } from "@/lib/services/auth.service";
import { tryCatchAsync } from "@/lib/utils/try-catch";
import { redirect } from "next/navigation";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const token = (await searchParams).token;
  const email = (await searchParams).email;

  const session = await getCurrentUser();

  if (session) {
    return redirect("/");
  }

  if (!token || !email || Array.isArray(token) || Array.isArray(email)) {
    return redirect(
      `signin?errorMessage=${encodeURIComponent("Invalid reset link")}`,
    );
  }
  const res = await tryCatchAsync(
    async () => await authService.validateResetLinkRequest(email, token),
  );

  if(res.error) {
    return redirect(`forgot-password?errorMessage=${encodeURIComponent(res.error.message)}`);
  }
  

  return <ResetPassword token={token} email={email} />;
}
