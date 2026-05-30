import ForgotPassword from "@/components/Auth/ForgotPassword";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function ForgotPasswordPage() {
  const session = await getCurrentUser();

  if (session) {
    return redirect("/");
  }
  return <ForgotPassword />;
}
