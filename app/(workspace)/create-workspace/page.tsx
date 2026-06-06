import { Logo } from "@/components/ui/logo";
import CreateWorkspaceStepper from "@/components/workspace/create-workspace-stepper";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function page() {
  const session = await getCurrentUser();
  if (!session) return redirect("/signin");
  return (
    <div className="container mx-auto px-4">
      <header className="flex justify-between items-center gap-3 p-5">
        <Logo />
        <p className="font-semibold truncate">mwmnshrfaldin{session.email}</p>
      </header>
      <main className="flex items-center justify-center h-[calc(100vh-88px)]">
        <CreateWorkspaceStepper />
      </main>
    </div>
  );
}
