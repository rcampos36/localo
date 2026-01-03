"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Search, Navigation } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export function FeaturesSection() {
  const { t } = useLanguage();

  return (
    <section id="features" className="container mx-auto px-4 py-20">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">{t("home.features.title")}</h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          {t("home.features.description")}
        </p>
      </div>
      <div className="grid md:grid-cols-3 gap-8">
        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader>
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <MapPin className="h-6 w-6 text-blue-600" />
            </div>
            <CardTitle>{t("home.features.interactive.title")}</CardTitle>
            <CardDescription>
              {t("home.features.interactive.description")}
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader>
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <Search className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle>{t("home.features.detailed.title")}</CardTitle>
            <CardDescription>
              {t("home.features.detailed.description")}
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader>
            <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <Navigation className="h-6 w-6 text-purple-600" />
            </div>
            <CardTitle>{t("home.features.navigation.title")}</CardTitle>
            <CardDescription>
              {t("home.features.navigation.description")}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </section>
  );
}


