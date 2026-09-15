import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { SupportView } from "@/components/views/SupportView";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function BantuanPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const role = (session?.user as any)?.role;
  if (role === "dealership" || role === "dealer") {
    redirect("/dealer/bantuan");
  }

  return (
    <DashboardLayout title="Hubungi Admin">
      <SupportView />
    </DashboardLayout>
  );
}
