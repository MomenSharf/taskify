import { Navbar1 } from "@/components/navbar1";
import { Hero115 } from "@/components/hero115";

// Shadcnblocks.com Pages are best installed using the shadcn cli - it will install the blocks as well.
// %insert cli command%

export default function LandingPage1() {
  return (
    <main className="flex w-full flex-col">
      <Navbar1 />
      <Hero115 />
    </main>
  );
}
