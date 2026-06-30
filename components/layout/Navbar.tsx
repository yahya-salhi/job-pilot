"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import type { UserSchema } from "@insforge/sdk";
import { SignOutButton } from "./SignOutButton";

const navLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/find-jobs", label: "Find Jobs" },
  { href: "/profile", label: "Profile" },
];

function NavLink({
  href,
  children,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  const pathname = usePathname();
  const isActive =
    pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`font-medium text-sm transition-colors duration-200 ${
        isActive ? "text-accent" : "text-text-dark hover:text-accent"
      }`}
    >
      {children}
    </Link>
  );
}

export function Navbar({ user }: { user: UserSchema | null }) {
  const [isOpen, setIsOpen] = useState(false);

  const close = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [close]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <header className="w-full h-16 bg-surface border-b border-border-light flex items-center justify-between px-6 md:px-8 sticky top-0 z-50">
      <div className="flex items-center gap-8 max-w-7xl w-full mx-auto justify-between">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Image
            src="/logo.png"
            alt="JobPilot Logo"
            width={120}
            height={32}
            priority
            style={{ width: "auto", height: "auto" }}
          />
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <NavLink key={link.href} href={link.href}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden lg:block">
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

        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="lg:hidden w-11 h-11 flex items-center justify-center rounded-md hover:bg-surface-secondary transition-colors -mr-2"
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {isOpen ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </>
            ) : (
              <>
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={close}
          aria-hidden="true"
        />
      )}

      <div
        className={`fixed inset-y-0 right-0 w-[280px] bg-surface shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between px-4 h-16 border-b border-border-light shrink-0">
            <Link href="/" onClick={close} className="flex items-center gap-2">
              <Image
                src="/logo.png"
                alt="JobPilot Logo"
                width={120}
                height={32}
                style={{ width: "auto", height: "auto" }}
              />
            </Link>
            <button
              onClick={close}
              className="w-11 h-11 flex items-center justify-center rounded-md hover:bg-surface-secondary transition-colors"
              aria-label="Close menu"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <nav className="flex-1 flex flex-col gap-6 px-4 pt-6">
            {navLinks.map((link) => (
              <NavLink key={link.href} href={link.href} onClick={close}>
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="px-4 pb-8 pt-4 border-t border-border-light shrink-0">
            {user ? (
              <SignOutButton />
            ) : (
              <Link
                href="/login"
                onClick={close}
                className="block w-full text-center bg-text-primary text-white hover:bg-opacity-90 font-medium text-sm px-4 py-2 rounded-md transition-all duration-200"
              >
                Start for free
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
