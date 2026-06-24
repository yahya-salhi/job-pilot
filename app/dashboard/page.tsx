import { Footer } from "@/components/layout/Footer";

export default function DashboardPage() {
  return (
    <div className="flex flex-col min-h-screen bg-surface">
      <main className="grow p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-text-primary mb-4">Dashboard</h1>
          <p className="text-text-secondary">
            You are successfully logged in.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
