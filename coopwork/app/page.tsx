import HeroSection from "@/components/sections/HeroSection";
import StatsSection from "@/components/sections/StatsSection";
import HowItWorksSection from "@/components/sections/HowItWorksSection";
import FeaturesSection from "@/components/sections/FeaturesSection";
import EquitySection from "@/components/sections/EquitySection";
import ShowcaseSection from "@/components/sections/ShowcaseSection";
import CTASection from "@/components/sections/CTASection";
import { footer } from "@/lib/content";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-900 text-white">
      <HeroSection />
      <StatsSection />
      <HowItWorksSection />
      <FeaturesSection />
      <EquitySection />
      <ShowcaseSection />
      <CTASection />

      <footer className="border-t border-slate-800 px-6 py-10 text-center text-sm text-slate-500">
        <p className="font-semibold text-slate-300">{footer.brandName}</p>
        <p className="mt-1">{footer.tagline}</p>
      </footer>
    </main>
  );
}
