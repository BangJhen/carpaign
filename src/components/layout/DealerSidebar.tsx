"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Car,
  Megaphone,
  InboxIcon,
  CreditCard,
  Building2,
  Headset,
  HelpCircle,
  LogOut,
  ChevronRight,
  Plus,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession, signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

const DEALER_ACCENT = "#B87333";

const navMain = [
  { href: "/dealer/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dealer/inventory", label: "Inventory Kendaraan", icon: Car },
  { href: "/dealer/campaigns", label: "Manajemen Kampanye", icon: Megaphone },
  { href: "/dealer/submissions", label: "Review Konten", icon: InboxIcon },
  { href: "/dealer/billing", label: "Keuangan", icon: CreditCard },
  { href: "/dealer/profile", label: "Profil Dealer", icon: Building2 },
];

const navSupport = [
  { href: "/bantuan", label: "Hubungi Admin", icon: Headset },
  { href: "/faq", label: "FAQ & Peraturan", icon: HelpCircle },
];

export function DealerSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();

  const handleLogout = async () => {
    await signOut();
    router.push("/login");
  };

  const getInitials = (name?: string) => {
    if (!name) return "D";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <Sidebar className="border-r-white/5 bg-[#0a0a0c]" variant="sidebar">
      {/* Logo Section */}
      <SidebarHeader className="py-8">
        <div className="px-4">
          <div className="flex items-center gap-2.5">
            <div
              className="size-8 rounded-lg flex items-center justify-center"
              style={{ background: `${DEALER_ACCENT}20`, border: `1px solid ${DEALER_ACCENT}40` }}
            >
              <Building2 className="size-4" style={{ color: DEALER_ACCENT }} />
            </div>
            <div>
              <span className="text-[15px] font-semibold tracking-tight text-white">
                Carpaign
              </span>
              <div
                className="text-[9px] font-bold uppercase tracking-[0.18em] mt-[-1px]"
                style={{ color: DEALER_ACCENT }}
              >
                Dealer Portal
              </div>
            </div>
          </div>

          {/* Quick Add Campaign CTA */}
          <Link
            href="/dealer/campaigns/create"
            className="mt-5 flex items-center justify-center gap-2 w-full h-9 rounded-lg text-[12px] font-semibold uppercase tracking-widest transition-all"
            style={{
              background: `linear-gradient(135deg, ${DEALER_ACCENT}20, ${DEALER_ACCENT}10)`,
              border: `1px solid ${DEALER_ACCENT}40`,
              color: DEALER_ACCENT,
            }}
          >
            <Plus className="size-3.5" />
            Buat Kampanye
          </Link>
        </div>
      </SidebarHeader>

      {/* Main Nav */}
      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/30 px-2 mb-1">
            Menu Utama
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5">
              {navMain.map(({ href, label, icon: Icon }) => {
                const isActive =
                  pathname === href ||
                  (href !== "/dealer/dashboard" && pathname.startsWith(href));
                return (
                  <SidebarMenuItem key={href}>
                    <SidebarMenuButton
                      render={<Link href={href} />}
                      isActive={isActive}
                      tooltip={label}
                      className={cn(
                        "h-10 rounded-lg px-3 text-[13px] font-medium transition-all",
                        isActive
                          ? "text-white"
                          : "text-white/50 hover:text-white/80 hover:bg-white/5"
                      )}
                      style={
                        isActive
                          ? {
                              background: `linear-gradient(90deg, ${DEALER_ACCENT}18, ${DEALER_ACCENT}08)`,
                              borderLeft: `2px solid ${DEALER_ACCENT}`,
                              paddingLeft: "10px",
                            }
                          : {}
                      }
                    >
                      <Icon
                        className="size-4 flex-shrink-0"
                        style={isActive ? { color: DEALER_ACCENT } : {}}
                      />
                      <span className="flex-1">{label}</span>
                      {isActive && (
                        <ChevronRight
                          className="size-3 opacity-60"
                          style={{ color: DEALER_ACCENT }}
                        />
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Support Nav */}
        <SidebarGroup className="mt-4">
          <SidebarGroupLabel className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/30 px-2 mb-1">
            Bantuan
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5">
              {navSupport.map(({ href, label, icon: Icon }) => (
                <SidebarMenuItem key={href}>
                  <SidebarMenuButton
                    render={<Link href={href} />}
                    className="h-10 rounded-lg px-3 text-[13px] font-medium text-white/50 hover:text-white/80 hover:bg-white/5 transition-all"
                  >
                    <Icon className="size-4 flex-shrink-0" />
                    <span>{label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer / User Profile */}
      <SidebarFooter className="p-4 border-t border-white/5">
        <div className="flex items-center gap-3">
          <Avatar className="size-9 rounded-lg border border-white/10">
            <AvatarImage src={(session?.user as any)?.image || ""} />
            <AvatarFallback
              className="rounded-lg text-[11px] font-bold"
              style={{ background: `${DEALER_ACCENT}20`, color: DEALER_ACCENT }}
            >
              {getInitials(session?.user?.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-semibold text-white truncate">
              {session?.user?.name || "Dealer"}
            </p>
            <p className="text-[11px] font-medium" style={{ color: `${DEALER_ACCENT}99` }}>
              Dealer
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="size-8 rounded-lg flex items-center justify-center text-white/30 hover:text-white/70 hover:bg-white/5 transition-all"
            title="Logout"
          >
            <LogOut className="size-3.5" />
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
