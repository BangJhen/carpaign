import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function BantuanRedirectPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const role = (session?.user as any)?.role;

  if (role === "dealership" || role === "dealer") {
    redirect("/dealer/bantuan");
  } else {
    redirect("/creator/bantuan");
  }
}
