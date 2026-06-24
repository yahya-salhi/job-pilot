import { redirect } from "next/navigation";
import { requireUser, AuthError } from "@/lib/require-user";
import { Footer } from "@/components/layout/Footer";
import { ProfileClient } from "@/components/profile/ProfileClient";
import { dbToForm } from "@/mappers/profile-mapper";

export default async function ProfilePage() {
  let user: any, insforge: any;
  try {
    ({ user, insforge } = await requireUser());
  } catch (error) {
    if (error instanceof AuthError) redirect("/login");
    throw error;
  }

  const { data: profile } = await insforge.database
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const initialProfile = dbToForm(profile, user);

  return (
    <div className="flex flex-col min-h-screen bg-surface">
      <main className="grow">
        <ProfileClient initialProfile={initialProfile} />
      </main>
      <Footer />
    </div>
  );
}
