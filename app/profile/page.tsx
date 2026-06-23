import { redirect } from "next/navigation";
import { createInsforgeServer } from "@/lib/insforge-server";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProfileClient } from "@/components/profile/ProfileClient";
import { dbToForm } from "@/lib/profile-mapper";

export default async function ProfilePage() {
  const insforge = await createInsforgeServer();

  const { data: authData, error: authError } =
    await insforge.auth.getCurrentUser();

  if (authError || !authData?.user) {
    redirect("/login");
  }

  const user = authData.user;

  const { data: profile } = await insforge.database
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const initialProfile = dbToForm(profile, user);

  return (
    <div className="flex flex-col min-h-screen bg-surface">
      <Navbar />
      <main className="grow">
        <ProfileClient initialProfile={initialProfile} />
      </main>
      <Footer />
    </div>
  );
}
