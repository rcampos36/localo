"use client";

import { Button } from "@/components/ui/button";
import { Globe, LogOut, User, Shield } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSelector } from "@/components/LanguageSelector";

interface NavigationProps {
  onLogout?: () => void;
}

export function Navigation({ onLogout }: NavigationProps) {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const { t } = useLanguage();

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 transition-all duration-200 hover:scale-105 group">
            <Globe className="h-8 w-8 text-blue-600 transition-transform duration-200 group-hover:rotate-12" />
            <span className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">Localo</span>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <a href="#departamentos" className="text-gray-700 hover:text-blue-600 transition-all duration-200 hover:scale-105 relative group">
              {t("nav.departamentos")}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-200 group-hover:w-full"></span>
            </a>
            <a href="#features" className="text-gray-700 hover:text-blue-600 transition-all duration-200 hover:scale-105 relative group">
              {t("nav.features")}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-200 group-hover:w-full"></span>
            </a>
            <a href="#about" className="text-gray-700 hover:text-blue-600 transition-all duration-200 hover:scale-105 relative group">
              {t("nav.about")}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-200 group-hover:w-full"></span>
            </a>
          </div>
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/dashboard">
                    <User className="h-4 w-4" />
                    <span className="hidden md:inline">{user?.name}</span>
                  </Link>
                </Button>
                <Button variant="ghost" onClick={onLogout}>
                  <LogOut className="h-4 w-4" />
                  {t("nav.logout")}
                </Button>
                <LanguageSelector />
                {isAdmin && (
                  <Button variant="ghost" asChild>
                    <Link href="/admin">
                      <Shield className="h-4 w-4" />
                      <span className="hidden md:inline">Admin</span>
                    </Link>
                  </Button>
                )}
              </>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/login">{t("nav.signIn")}</Link>
                </Button>
                <Button asChild>
                  <Link href="/register">{t("nav.getStarted")}</Link>
                </Button>
                <LanguageSelector />
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

