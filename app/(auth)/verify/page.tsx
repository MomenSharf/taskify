import VerifyCode from "@/components/auth/verify-code";
import { validateEmailVerification } from "@/lib/actions/auth/verification-email.action";
import { getCurrentUser } from "@/lib/auth/auth-options";
import { redirect } from "next/navigation";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const session = await getCurrentUser();

  const email = (await searchParams).email;

  if (session) {
    redirect("/");
  }
  if (!email || Array.isArray(email)) {
    return redirect("/signin");
  }
  const res = await validateEmailVerification(email);

  if (res.error) {
    redirect(
      `/signin?errorMessage=${encodeURIComponent(
        res.error?.message ?? "Something went wrong. Please try again.",
      )}`,
    );
  }

  const data = res.data;

  if (data.status === "already_verified") {
    redirect(
      `/signin?errorMessage=${encodeURIComponent(
        "Your email has already been verified. Please sign in.",
      )}`,
    );
  }

  return (
    <VerifyCode
      email={email}
      initialCooldown={data.secondsLeft ?? 0}
      
    />
  );
}
