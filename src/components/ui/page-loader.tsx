import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface PageLoaderProps {
  label?: string;
  className?: string;
  minHeight?: string;
}

export function PageLoader({
  label = "Memuat...",
  className,
  minHeight = "min-h-[55vh]",
}: PageLoaderProps) {
  return (
    <div
      className={cn(
        "w-full flex flex-col items-center justify-center p-8 animate-in fade-in duration-300 relative",
        minHeight,
        className
      )}
    >
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-primary/[0.05] rounded-full blur-3xl pointer-events-none" />

      <div className="relative flex flex-col items-center gap-4">
        {/* Circular Spinner Ring */}
        <div className="relative flex items-center justify-center">
          {/* Static track */}
          <div className="size-11 rounded-full border-[2.5px] border-white/[0.08]" />
          {/* Animated spinning gold arc */}
          <div className="absolute inset-0 size-11 rounded-full border-[2.5px] border-transparent border-t-primary border-r-primary/70 animate-spin" />
        </div>

        {/* Text */}
        {label && (
          <p className="text-[13px] font-medium text-white/50 tracking-wide select-none">
            {label}
          </p>
        )}
      </div>
    </div>
  );
}
