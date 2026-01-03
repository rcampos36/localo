"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { smoothScrollTo } from "@/lib/utils";

export function HeroSection() {
  const { t } = useLanguage();

  const handleScrollToDepartamentos = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    smoothScrollTo("departamentos", 80);
  };

  return (
    <section className="relative w-full h-screen min-h-[600px] overflow-hidden">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src="https://videos.pexels.com/video-files/2169879/2169879-uhd_3840_2160_30fps.mp4" type="video/mp4" />
      </video>
      
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70 z-10"></div>
      
      {/* Content */}
      <div className="relative z-20 container mx-auto px-4 h-full flex items-center">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="mb-4 bg-white/20 text-white border-white/30 backdrop-blur-sm" variant="secondary">
            {t("home.hero.badge")}
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
            {t("home.hero.title")}
            <span className="text-blue-300"> {t("home.hero.titleHighlight")}</span>
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto drop-shadow-md">
            {t("home.hero.description")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 bg-white text-gray-900 hover:bg-gray-100" asChild>
              <a href="#departamentos" onClick={handleScrollToDepartamentos} className="inline-flex items-center">
                {t("home.hero.exploreButton")}
                <ArrowRight className="h-5 w-5" />
              </a>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm">
              {t("home.hero.learnMoreButton")}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}


