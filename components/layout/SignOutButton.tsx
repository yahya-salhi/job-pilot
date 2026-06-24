"use client";

import { useRouter } from "next/navigation";
import { insforge } from "@/lib/insforge-client";
import { signOutAction } from "@/actions/auth";

export function SignOutButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    await insforge.auth.signOut();
    await signOutAction();
    router.push("/");
    router.refresh();
  };

  return (
    <button
      onClick={handleSignOut}
      className="bg-surface text-text-primary border border-border-muted hover:bg-surface-secondary font-medium text-sm px-4 py-2 rounded-md transition-all duration-200"
    >
      Sign Out
    </button>
  );
}
