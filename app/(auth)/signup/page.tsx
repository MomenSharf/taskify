import { SignupForm } from "@/components/auth/singup-form";
import { getCurrentUser } from "@/lib/auth/auth-options";
import { redirect } from "next/navigation";

export default async function SignupPage() {
  const session = await getCurrentUser();

  if (session) {
    return redirect("/");
  }
  return <SignupForm />;
}
