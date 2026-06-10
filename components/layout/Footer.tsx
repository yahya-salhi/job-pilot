import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="w-full bg-surface border-t border-border-light py-8 px-6 md:px-8 mt-auto">
      <div className="max-w-7xl w-full mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="JobPilot Logo"
            width={120}
            height={32}
            className="object-contain h-8 w-auto"
          />
        </Link>

        {/* Links */}
        <div className="flex items-center gap-6 text-sm text-text-secondary">
          <Link
            href="/dashboard"
            className="hover:text-accent transition-colors duration-200"
          >
            Dashboard
          </Link>
          <Link
            href="/privacy-policy"
            className="hover:text-accent transition-colors duration-200"
          >
            Privacy Policy
          </Link>
          <Link
            href="/terms-and-conditions"
            className="hover:text-accent transition-colors duration-200"
          >
            Terms & Condition
          </Link>
        </div>
      </div>
    </footer>
  );
}
