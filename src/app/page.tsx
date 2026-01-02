"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Navigation } from "@/components/home/Navigation";
import { HeroSection } from "@/components/home/HeroSection";
import { DepartamentosGrid } from "@/components/home/DepartamentosGrid";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { StatsSection } from "@/components/home/StatsSection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { CTASection } from "@/components/home/CTASection";
import { Footer } from "@/components/home/Footer";

export default function Home() {
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50">
      <Navigation onLogout={handleLogout} />
      <HeroSection />
      <DepartamentosGrid />
      <FeaturesSection />
      <StatsSection />
      <HowItWorksSection />
      <CTASection />
      <Footer />
    </div>
  );
}
