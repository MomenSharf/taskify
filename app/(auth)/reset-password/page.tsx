import { verifyToken } from "@/app/actions/auth/forgot-password.action";
import ResetPassword from "@/components/Auth/reset-password";
import { getCurrentUser } from "@/lib/auth";
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
  try {
    await verifyToken(token, email);
  } catch (err: unknown) {
    if (!(err instanceof Error)) {
      return redirect("signin");
    }

    return redirect(`signin?errorMessage=${encodeURIComponent(err.message)}`);
  }

  return <ResetPassword token={token} email={email} />;
}
