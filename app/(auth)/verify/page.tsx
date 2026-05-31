import { validateEmailVerificationRequest } from "@/app/actions/auth/verification-email.action";
import VerifyCode from "@/components/Auth/verify-code";
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
      return redirect("/signin");
    }
    
    return redirect(`signin?errorMessage=${encodeURIComponent(err.message)}`);
  }
  
  if (res.redirect) return redirect(res.redirect);
  
  if(!res.attempts || !res.attempts) return redirect('/signin')

  return <VerifyCode email={email} initialCooldown={res.secondsLeft} attemptsLeftServer={res.attempts} maxAttempts={res.maxAttempts}  />;
}
