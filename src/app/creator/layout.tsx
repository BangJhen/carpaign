import type { Metadata } from "next";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Creator Portal Carpaign",
  description: "Portal kreator otomotif Carpaign untuk eksplorasi kampanye dan reward.",
};

export default async function CreatorRouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    redirect("/login");
  }

  const role = (session.user as any)?.role;
  if (role === "dealership" || role === "dealer") {
    redirect("/dealer/dashboard");
  }

  return <DashboardLayout>{children}</DashboardLayout>;
}
