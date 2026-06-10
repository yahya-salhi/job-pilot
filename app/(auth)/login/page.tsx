"use client";

import { useEffect, useState } from "react";
import { signInWithOAuthAction, type OAuthProvider } from "@/actions/auth";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const ERROR_MESSAGES: Record<string, string> = {
  oauth_failed: "Sign-in failed. Please try again.",
  missing_verifier: "Your sign-in session expired. Please try again.",
  exchange_failed: "We couldn't complete your sign-in. Please try again.",
  invalid_provider: "That sign-in method isn't supported.",
};

const LoginPage = () => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [pendingProvider, setPendingProvider] = useState<OAuthProvider | null>(null);

  useEffect(() => {
    const error = new URLSearchParams(window.location.search).get("error");
    if (error) {
      setErrorMessage(ERROR_MESSAGES[error] ?? ERROR_MESSAGES.oauth_failed);
    }
  }, []);

  const handleOAuthLogin = async (provider: OAuthProvider) => {
    setErrorMessage(null);
    setPendingProvider(provider);
    await signInWithOAuthAction(provider);
  };

  return (
    <div className="flex flex-col min-h-screen bg-surface">
      <Navbar />

      <main className="grow flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-md bg-background border border-border-light rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8">
            <h1 className="text-3xl font-extrabold text-text-primary tracking-tight mb-2">
              Welcome back
            </h1>
            <p className="text-text-secondary mb-8">
              Sign in to your account to continue.
            </p>

            {errorMessage && (
              <div
                role="alert"
                className="mb-6 px-4 py-3 rounded-md bg-error/10 border border-error/40 text-error text-sm"
              >
                {errorMessage}
              </div>
            )}

            <div className="space-y-4">
              <button
                onClick={() => handleOAuthLogin("google")}
                disabled={pendingProvider !== null}
                className="w-full flex items-center justify-center gap-3 bg-surface text-text-primary border border-border-muted hover:bg-surface-secondary font-semibold text-sm px-6 py-3 rounded-md transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <img
                  src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                  alt="Google"
                  className="w-5 h-5"
                />
                {pendingProvider === "google"
                  ? "Redirecting…"
                  : "Continue with Google"}
              </button>

              <button
                onClick={() => handleOAuthLogin("github")}
                disabled={pendingProvider !== null}
                className="w-full flex items-center justify-center gap-3 bg-text-primary text-white hover:bg-opacity-90 font-semibold text-sm px-6 py-3 rounded-md transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <img
                  src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
                  alt="GitHub"
                  className="w-5 h-5 invert"
                />
                {pendingProvider === "github"
                  ? "Redirecting…"
                  : "Continue with GitHub"}
              </button>
            </div>
          </div>

          <div className="bg-surface-secondary px-8 py-4 border-t border-border-light">
            <p className="text-xs text-center text-text-secondary">
              By continuing, you agree to our{" "}
              <a href="#" className="underline hover:text-text-primary">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="underline hover:text-text-primary">
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LoginPage;
