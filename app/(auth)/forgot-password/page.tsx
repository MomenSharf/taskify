import ForgotPassword from "@/components/auth/forgot-password";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function ForgotPasswordPage() {
  const session = await getCurrentUser();

  if (session) {
    return redirect("/");
  }
  return <ForgotPassword />;
}
