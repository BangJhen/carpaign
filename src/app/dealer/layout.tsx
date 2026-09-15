import type { Metadata } from "next";
import { DealerLayout } from "@/components/layout/DealerLayout";

export const metadata: Metadata = {
  title: "Dealer Dashboard - Carpaign",
  description: "Portal manajemen kampanye dan inventory kendaraan untuk dealer.",
};

export default function DealerRouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DealerLayout>{children}</DealerLayout>;
}
