"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";

interface DealerGuardProps {
  children: React.ReactNode;
}

export function DealerGuard({ children }: DealerGuardProps) {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending) {
      if (!session) {
        router.push("/login");
      } else {
        const role = (session.user as any)?.role;
        if (role !== "dealership" && role !== "dealer") {
          // Creator mencoba akses portal dealer → redirect ke portal kreator
          router.push("/creator/dashboard");
        }
      }
    }
  }, [isPending, session, router]);

  if (isPending) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="size-8 rounded-full border-2 border-t-transparent animate-spin border-white/40" />
          <p className="text-sm text-muted-foreground animate-pulse">Memverifikasi akses dealer...</p>
        </div>
      </div>
    );
  }

  const role = (session?.user as any)?.role;
  if (!session || (role !== "dealership" && role !== "dealer")) {
    return null;
  }

  return <>{children}</>;
}
