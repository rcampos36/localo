"use client";

import { Globe } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="container mx-auto px-4 py-12 border-t">
      <div className="grid md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Globe className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">Localo</span>
          </div>
          <p className="text-gray-600">
            {t("home.footer.description")}
          </p>
        </div>
        <div>
          <h3 className="font-semibold mb-4">{t("home.footer.explore")}</h3>
          <ul className="space-y-2 text-gray-600">
            <li><a href="#features" className="hover:text-blue-600 transition-colors duration-200 hover:translate-x-1 inline-block">{t("home.footer.features")}</a></li>
            <li><a href="/departamento/san-salvador" className="hover:text-blue-600 transition-colors duration-200 hover:translate-x-1 inline-block">{t("nav.departamentos")}</a></li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mb-4">{t("home.footer.resources")}</h3>
          <ul className="space-y-2 text-gray-600">
            <li><a href="#" className="hover:text-blue-600 transition-colors duration-200 hover:translate-x-1 inline-block">{t("home.footer.about")}</a></li>
            <li><a href="#" className="hover:text-blue-600 transition-colors duration-200 hover:translate-x-1 inline-block">{t("home.footer.helpCenter")}</a></li>
            <li><a href="#" className="hover:text-blue-600 transition-colors duration-200 hover:translate-x-1 inline-block">{t("home.footer.contact")}</a></li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mb-4">{t("home.footer.legal")}</h3>
          <ul className="space-y-2 text-gray-600">
            <li><a href="#" className="hover:text-blue-600 transition-colors duration-200 hover:translate-x-1 inline-block">{t("home.footer.terms")}</a></li>
            <li><a href="#" className="hover:text-blue-600 transition-colors duration-200 hover:translate-x-1 inline-block">{t("home.footer.privacy")}</a></li>
            <li><a href="#" className="hover:text-blue-600 transition-colors duration-200 hover:translate-x-1 inline-block">{t("home.footer.cookies")}</a></li>
          </ul>
        </div>
      </div>
      <div className="mt-8 pt-8 border-t text-center text-gray-600">
        <p>{t("home.footer.copyright")}</p>
      </div>
    </footer>
  );
}


