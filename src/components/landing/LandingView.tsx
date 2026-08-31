import { LenisProvider } from "@/components/landing/LenisProvider";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { DemoVideoSection } from "@/components/landing/DemoVideoSection";
import { TestimonialMarquee } from "@/components/landing/TestimonialMarquee";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { CampaignPreviewSection } from "@/components/landing/CampaignPreviewSection";
import { FaqSection } from "@/components/landing/FaqSection";
import { CtaSection } from "@/components/landing/CtaSection";
import { LandingFooter } from "@/components/landing/LandingFooter";

export function LandingView() {
  return (
    <LenisProvider>
      <div
        className="min-h-screen selection:bg-[#D4AF37] selection:text-[#111316]"
        style={{ background: "#111316", color: "#F5F5E9" }}
      >
        <LandingNavbar />
        <main>
          <HeroSection />
          <DemoVideoSection />
          <TestimonialMarquee />
          <HowItWorksSection />
          <FeaturesSection />
          <CampaignPreviewSection />
          <FaqSection />
          <CtaSection />
        </main>
        <LandingFooter />
      </div>
    </LenisProvider>
  );
}
