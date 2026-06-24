import { createInsforgeServer } from "@/lib/insforge-server";
import { Navbar } from "@/components/layout/Navbar";

export async function NavbarShell() {
  let user = null;
  try {
    const insforge = await createInsforgeServer();
    const { data } = await insforge.auth.getCurrentUser();
    user = data?.user ?? null;
  } catch {
  }

  return <Navbar user={user} />;
}
