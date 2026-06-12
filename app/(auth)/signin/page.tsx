import { SigninForm } from "@/components/auth/signin-form";
import { getCurrentUser } from "@/lib/auth/auth-options";
import { redirect } from "next/navigation";

export default async function SigninPage() {
  const session = await getCurrentUser();

  if (session) {
    return redirect("/");
  }
  return <SigninForm />;
}
