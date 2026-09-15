export default function RootLoading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#111316]">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] bg-primary/[0.07] rounded-full blur-3xl pointer-events-none" />

      <div className="relative flex flex-col items-center gap-5">
        {/* Animated Brand Pulse */}
        <div className="relative flex items-center justify-center size-14">
          <div className="absolute inset-0 rounded-2xl bg-primary/20 animate-ping opacity-30" />
          <div className="relative size-12 rounded-2xl bg-[#17191d] border border-white/10 flex items-center justify-center shadow-2xl">
            <div className="size-4 rounded-full bg-primary animate-pulse" />
          </div>
        </div>

        {/* Loading Text */}
        <div className="flex flex-col items-center gap-1.5">
          <p className="text-[13px] font-medium tracking-wide text-white/80">Memuat Halaman</p>
          <div className="flex gap-1">
            <span className="size-1.5 rounded-full bg-primary/60 animate-bounce [animation-delay:-0.3s]" />
            <span className="size-1.5 rounded-full bg-primary/60 animate-bounce [animation-delay:-0.15s]" />
            <span className="size-1.5 rounded-full bg-primary/60 animate-bounce" />
          </div>
        </div>
      </div>
    </div>
  );
}
