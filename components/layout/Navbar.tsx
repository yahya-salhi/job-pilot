"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { insforge } from "@/lib/insforge-client";
import { signOutAction } from "@/actions/auth";
import { useRouter } from "next/navigation";
import { UserSchema } from "@insforge/sdk";

export function Navbar() {
  const [user, setUser] = useState<UserSchema | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await insforge.auth.getCurrentUser();
      setUser(data?.user);
    };

    fetchUser();
  }, []);

  const handleSignOut = async () => {
    await insforge.auth.signOut(); // revoke session on the backend
    await signOutAction(); // clear auth cookies server-side
    setUser(null);
    router.push("/");
    router.refresh();
  };

  return (
    <header className="w-full h-16 bg-surface border-b border-border-light flex items-center justify-between px-6 md:px-8 sticky top-0 z-50">
      <div className="flex items-center gap-8 max-w-7xl w-full mx-auto justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="JobPilot Logo"
            width={120}
            height={32}
            priority
            className="object-contain h-8 w-auto"
            style={{ height: 'auto' }}
          />
        </Link>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/dashboard"
            className="text-text-dark hover:text-accent font-medium text-sm transition-colors duration-200"
          >
            Dashboard
          </Link>
          <Link
            href="/find-jobs"
            className="text-text-dark hover:text-accent font-medium text-sm transition-colors duration-200"
          >
            Find Jobs
          </Link>
          <Link
            href="/profile"
            className="text-text-dark hover:text-accent font-medium text-sm transition-colors duration-200"
          >
            Profile
          </Link>
        </nav>

        {/* Right CTA Button */}
        <div>
          {user ? (
            <button
              onClick={handleSignOut}
              className="bg-surface text-text-primary border border-border-muted hover:bg-surface-secondary font-medium text-sm px-4 py-2 rounded-md transition-all duration-200"
            >
              Sign Out
            </button>
          ) : (
            <Link
              href="/login"
              className="bg-text-primary text-white hover:bg-opacity-90 font-medium text-sm px-4 py-2 rounded-md transition-all duration-200"
            >
              Start for free
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
