"use client";

import { DealerSidebar } from "@/components/layout/DealerSidebar";
import { DealerHeader } from "@/components/layout/DealerHeader";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { DealerGuard } from "@/components/auth/DealerGuard";

interface DealerLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export function DealerLayout({ children, title }: DealerLayoutProps) {
  return (
    <DealerGuard>
      <SidebarProvider>
        <div className="flex min-h-screen w-full bg-background selection:bg-primary/30">
          <DealerSidebar />
          <SidebarInset className="flex w-full flex-col bg-background min-w-0">
            <DealerHeader title={title} />
            <main className="flex-1 overflow-x-hidden p-4 md:p-6 lg:p-8">
              {children}
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </DealerGuard>
  );
}
