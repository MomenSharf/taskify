import { SignupForm } from "@/components/Auth/singup-form";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function SignupPage() {
  const session = await getCurrentUser();

  if (session) {
    return redirect("/");
  }
  return <SignupForm />;
}
