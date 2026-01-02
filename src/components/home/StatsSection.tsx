"use client";

import { useLanguage } from "@/contexts/LanguageContext";

export function StatsSection() {
  const { t } = useLanguage();

  return (
    <section className="container mx-auto px-4 py-20">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white">
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-5xl font-bold mb-2">14</div>
            <div className="text-blue-100">{t("home.stats.departamentos")}</div>
          </div>
          <div>
            <div className="text-5xl font-bold mb-2">262</div>
            <div className="text-blue-100">{t("home.stats.municipios")}</div>
          </div>
          <div>
            <div className="text-5xl font-bold mb-2">6.5M+</div>
            <div className="text-blue-100">{t("home.stats.people")}</div>
          </div>
        </div>
      </div>
    </section>
  );
}

