import { profileApi } from "@/lib/api";
import ProfileClient from "./profile-client";

export default async function ProfilePage() {
  const [profile, sessions] = await Promise.all([
    profileApi.get(),
    profileApi.getSessions(),
  ]);
  return <ProfileClient profile={profile} sessions={sessions} />;
}
