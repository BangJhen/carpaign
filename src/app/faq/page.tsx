import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { FaqView } from "@/components/views/FaqView";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function FaqPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const role = (session?.user as any)?.role;
  if (role === "dealership" || role === "dealer") {
    redirect("/dealer/faq");
  }

  return (
    <DashboardLayout title="FAQ & Peraturan">
      <FaqView />
    </DashboardLayout>
  );
}
