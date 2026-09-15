"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Home,
  Megaphone,
  BarChart2,
  Wallet,
  Trophy,
  Crown,
  Headset,
  HelpCircle,
  ChevronRight,
  Medal,
  LogOut
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

const navMain = [
  { href: "/creator/dashboard", label: "Dashboard", icon: Home },
  { href: "/creator/campaigns", label: "Campaigns", icon: Megaphone },
  { href: "/creator/analitik", label: "Analitik", icon: BarChart2 },
  { href: "/creator/pendapatan", label: "Pendapatan", icon: Wallet },
  { href: "/creator/rank-rewards", label: "Rank & Rewards", icon: Trophy },
  { href: "/creator/leaderboard", label: "Leaderboard", icon: Crown },
];

const navSupport = [
  { href: "/creator/bantuan", label: "Hubungi Admin", icon: Headset },
  { href: "/creator/faq", label: "FAQ & Peraturan", icon: HelpCircle },
];

import { useSession, signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();

  const handleLogout = async () => {
    await signOut();
    router.push("/login");
  };

  // Helper untuk inisial nama
  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  // Capitalize role
  const formatRole = (role?: string) => {
    if (!role) return "Kreator";
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  return (
    <Sidebar className="border-r-white/5 bg-[#0a0a0c]" variant="sidebar">
      {/* Logo Section */}
      <SidebarHeader className="py-8">
        <div className="flex flex-col items-center justify-center w-full gap-2">
          <img 
            src="/carpaign-logo.png" 
            alt="Carpaign Logo" 
            className="h-12 w-auto object-contain" 
          />
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/70">
            Kreator Portal
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-4 gap-6">
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              {navMain.map(({ href, label, icon: Icon }) => {
                const isActive = pathname === href || (href !== "/creator/dashboard" && pathname.startsWith(href));
                return (
                  <SidebarMenuItem key={href}>
                    <SidebarMenuButton
                      render={<Link href={href} />}
                      isActive={isActive}
                      tooltip={label}
                      className={cn(
                        "h-11 transition-all duration-300 rounded-lg px-3",
                        isActive
                          ? "bg-gradient-to-r from-primary/20 via-primary/5 to-transparent border border-primary/30 text-foreground font-semibold shadow-[0_0_15px_rgba(212,175,55,0.1)]"
                          : "text-muted-foreground hover:bg-white/5 hover:text-foreground font-medium"
                      )}
                    >
                      <Icon className={cn("size-[18px]", isActive ? "text-primary" : "text-muted-foreground/70")} />
                      <span className="ml-2">{label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Active Campaigns */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-[11px] font-semibold text-foreground/90 tracking-wide px-1 mb-3">
            Campaign Aktif Diikuti
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              <SidebarMenuItem>
                <SidebarMenuButton
                  render={<Link href="/creator/campaigns" />}
                  className="h-auto py-2.5 px-3 text-muted-foreground hover:bg-white/5 hover:text-foreground transition-all rounded-lg flex items-center gap-3"
                >
                  <div className="size-10 rounded bg-muted/20 border border-white/5 flex items-center justify-center shrink-0">
                    <span className="text-[10px] text-muted-foreground/50">Car</span>
                  </div>
                  <div className="flex flex-col gap-0.5 overflow-hidden">
                    <span className="text-sm font-medium text-foreground truncate">Falcon Pictures</span>
                    <span className="text-[11px] text-muted-foreground truncate">Toyota Avanza 2022</span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Support */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-[11px] font-semibold text-foreground/90 tracking-wide px-1 mb-3 mt-2">
            Butuh Bantuan?
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1.5">
              {navSupport.map(({ href, label, icon: Icon }) => {
                const isActive = pathname === href || pathname.startsWith(href);
                return (
                  <SidebarMenuItem key={href}>
                    <SidebarMenuButton
                      render={<Link href={href} />}
                      isActive={isActive}
                      className={cn(
                        "h-10 px-3 transition-all rounded-lg font-medium",
                        isActive
                          ? "bg-white/10 text-white font-semibold border border-white/10 shadow-xs"
                          : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                      )}
                    >
                      <Icon className={cn("size-[18px]", isActive ? "text-white" : "text-muted-foreground/70")} />
                      <span className="ml-2">{label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* User Profile Footer */}
      <SidebarFooter className="p-4 border-t border-white/5 flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              render={<Link href="/creator/profile" />}
              isActive={pathname === "/creator/profile"}
              className={cn(
                "h-auto py-2 px-2 transition-all rounded-xl flex items-center justify-between group",
                pathname === "/creator/profile"
                  ? "bg-white/10 text-white border border-white/15 shadow-sm"
                  : "hover:bg-white/5 text-muted-foreground hover:text-white"
              )}
            >
              <div className="flex items-center gap-3">
                <Avatar className="size-9 border border-white/10">
                  <AvatarImage src={session?.user?.image || ""} alt={session?.user?.name || "User"} />
                  <AvatarFallback className="bg-muted text-muted-foreground text-xs font-semibold">
                    {getInitials(session?.user?.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start gap-0.5">
                  <span className="text-sm font-semibold text-foreground truncate max-w-[120px]">
                    {session?.user?.name || "Memuat..."}
                  </span>
                  <div className="flex items-center gap-1 text-[10px] font-medium text-primary bg-primary/10 px-1.5 py-0.5 rounded-full border border-primary/20">
                    <Medal className="size-3" />
                    {formatRole((session?.user as any)?.role)} Level {(session?.user as any)?.tier || 1}
                  </div>
                </div>
              </div>
              <ChevronRight className="size-4 text-muted-foreground/50 group-hover:text-foreground/80 transition-colors" />
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              className="h-10 mt-1 px-3 text-red-500/80 hover:bg-red-500/10 hover:text-red-500 transition-all rounded-lg font-medium"
            >
              <LogOut className="size-[18px]" />
              <span className="ml-2">Keluar</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
