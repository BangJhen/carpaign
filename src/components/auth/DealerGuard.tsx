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
      } else if ((session.user as any)?.role !== "dealer") {
        // Creator mengakses dealer dashboard → redirect ke creator dashboard
        router.push("/dashboard");
      }
    }
  }, [isPending, session, router]);

  if (isPending) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="size-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: "#B87333", borderTopColor: "transparent" }} />
          <p className="text-sm text-muted-foreground animate-pulse">Memuat sesi...</p>
        </div>
      </div>
    );
  }

  if (!session || (session.user as any)?.role !== "dealer") {
    return null;
  }

  return <>{children}</>;
}
