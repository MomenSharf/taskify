import VerifyCode from "@/components/Auth/VerifyCode";
import { validateEmailVerificationRequest } from "@/lib/actions/auth/verification-email";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const email = (await searchParams).email;

  const session = await getCurrentUser();

  if (session) {
    return redirect("/");
  }

  if (!email || Array.isArray(email)) {
    return redirect("/signin");
  }
  let res;
  try {
    res = await validateEmailVerificationRequest(email);
  } catch (err: unknown) {
    if (!(err instanceof Error)) {
      return redirect("signin");
    }

    return redirect(`signin?errorMessage=${encodeURIComponent(err.message)}`);
  }

  if (res.redirect) redirect(res.redirect);

  return <VerifyCode email={email} initialCooldown={res.secondsLeft} />;
}
