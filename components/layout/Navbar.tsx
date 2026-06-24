import Link from "next/link";
import Image from "next/image";
import type { UserSchema } from "@insforge/sdk";
import { SignOutButton } from "./SignOutButton";

export function Navbar({ user }: { user: UserSchema | null }) {
  return (
    <header className="w-full h-16 bg-surface border-b border-border-light flex items-center justify-between px-6 md:px-8 sticky top-0 z-50">
      <div className="flex items-center gap-8 max-w-7xl w-full mx-auto justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="JobPilot Logo"
            width={120}
            height={32}
            priority
            className="object-contain h-8"
            style={{ width: 'auto' }}
          />
        </Link>

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

        <div>
          {user ? (
            <SignOutButton />
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
