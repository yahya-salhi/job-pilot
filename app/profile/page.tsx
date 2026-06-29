import { requireAuthenticatedPage } from "@/lib/require-user";
import { Footer } from "@/components/layout/Footer";
import { ProfileClient } from "@/components/profile/ProfileClient";
import { dbToForm, type ProfileDbRow } from "@/mappers/profile-mapper";
import type { InsforgeClient } from "@/agent/types";

async function getProfile(insforge: InsforgeClient, userId: string): Promise<ProfileDbRow | null> {
  const { data } = await insforge.database
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();
  return data as ProfileDbRow | null;
}

export default async function ProfilePage() {
  const { user, insforge } = await requireAuthenticatedPage();

  const profile = await getProfile(insforge, user.id);
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
