import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ProfileView } from "@/components/views/ProfileView";

export default function ProfilePage() {
  return (
    <DashboardLayout title="Profil Kreator">
      <ProfileView />
    </DashboardLayout>
  );
}
