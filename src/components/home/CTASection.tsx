"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export function CTASection() {
  const { t } = useLanguage();

  return (
    <section className="container mx-auto px-4 py-20">
      <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50 to-purple-50">
        <CardContent className="p-12 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">{t("home.cta.title")}</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            {t("home.cta.description")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8" asChild>
              <a href="#departamentos" className="inline-flex items-center">
                {t("home.cta.startButton")}
                <ArrowRight className="h-5 w-5" />
              </a>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8">
              {t("home.cta.learnMoreButton")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

