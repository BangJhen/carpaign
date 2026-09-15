import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Carpaign - Turn Vehicle Inventory Into Content",
  description: "Platform yang menghubungkan inventory kendaraan, production creator, distribution, dan outcome sales dalam satu workflow.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" className={cn(plusJakartaSans.variable, "dark")} suppressHydrationWarning>
      <body className="antialiased min-h-screen font-sans" suppressHydrationWarning>
          <TooltipProvider>{children}</TooltipProvider>
          <Toaster
            theme="dark"
            toastOptions={{
              style: {
                background: '#1A1C20',
                border: '1px solid rgba(255,255,255,0.08)',
                color: '#fff',
              },
            }}
          />
        </body>
    </html>
  );
}
