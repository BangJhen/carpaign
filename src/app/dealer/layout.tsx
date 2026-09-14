import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dealer Dashboard - Carpaign",
  description: "Portal manajemen kampanye dan inventory kendaraan untuk dealer.",
};

export default function DealerRouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // The actual layout (sidebar, header) is handled per-page via DealerLayout component.
  // This layout.tsx only injects metadata at the route group level.
  return <>{children}</>;
}
