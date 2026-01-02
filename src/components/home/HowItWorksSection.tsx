"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

export function HowItWorksSection() {
  const { t } = useLanguage();

  return (
    <section className="container mx-auto px-4 py-20">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">{t("home.howItWorks.title")}</h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          {t("home.howItWorks.description")}
        </p>
      </div>
      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <Card className="border-0 shadow-lg text-center">
          <CardHeader>
            <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-blue-600">1</span>
            </div>
            <CardTitle>{t("home.howItWorks.step1.title")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              {t("home.howItWorks.step1.description")}
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg text-center">
          <CardHeader>
            <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-green-600">2</span>
            </div>
            <CardTitle>{t("home.howItWorks.step2.title")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              {t("home.howItWorks.step2.description")}
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg text-center">
          <CardHeader>
            <div className="h-16 w-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-purple-600">3</span>
            </div>
            <CardTitle>{t("home.howItWorks.step3.title")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              {t("home.howItWorks.step3.description")}
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

