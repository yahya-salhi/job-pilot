"use client";

import { useEffect, useState } from "react";
import { insforge } from "@/lib/insforge-client";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { UserSchema } from "@insforge/sdk";

const DashboardPage = () => {
  const [user, setUser] = useState<UserSchema | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await insforge.auth.getCurrentUser();
      setUser(data?.user);
      setLoading(false);
    };

    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-surface">
      <Navbar />

      <main className="grow p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-text-primary mb-4">
            Welcome, {user?.profile?.name || user?.email}
          </h1>
          <p className="text-text-secondary">
            You are successfully logged in to your dashboard.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DashboardPage;
