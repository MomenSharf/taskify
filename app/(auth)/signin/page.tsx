import { SigninForm } from "@/components/Auth/signin-form";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function SigninPage() {
  const session = await getCurrentUser();

  if (session) {
    return redirect("/");
  }
  return <SigninForm />;
}
