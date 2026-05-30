import ResetPassword from "@/components/Auth/ResetPassword";
import { verifyToken } from "@/lib/actions/auth/forgot-password";
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

  // if (!token || !email || Array.isArray(token) || Array.isArray(email)) {
  //   throw new Error("Invalid reset link");
  // }

  // await verifyToken(token, email);
  if (!token || !email || Array.isArray(token) || Array.isArray(email)) {
    return redirect(
      `signin?errorMessage=${encodeURIComponent("Invalid reset link")}`,
    );
  }
  let res;
  try {
    res = await verifyToken(token, email);
  } catch (err: unknown) {
    if (!(err instanceof Error)) {
      return redirect("signin");
    }

    return redirect(`signin?errorMessage=${encodeURIComponent(err.message)}`);
  }

  return <ResetPassword token={token} email={email} />;
}
