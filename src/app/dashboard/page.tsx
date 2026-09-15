import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardRedirectPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    redirect("/login");
  }

  const role = (session.user as any)?.role;
  if (role === "dealership" || role === "dealer") {
    redirect("/dealer/dashboard");
  } else {
    redirect("/creator/dashboard");
  }
}
