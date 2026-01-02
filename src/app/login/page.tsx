"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Globe, ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSelector } from "@/components/LanguageSelector";
import { GoogleSignIn } from "@/components/GoogleSignIn";
import { Separator } from "@/components/ui/separator";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Simple validation
    if (!email || !password) {
      setError(t("auth.login.error.fillFields"));
      setIsLoading(false);
      return;
    }

    // Check if user exists in localStorage (simple demo auth)
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const user = users.find(
      (u: any) => u.email === email && u.password === password
    );

    if (user) {
      // Set auth state using context - include role from stored user data
      login({ 
        email: user.email, 
        name: user.name,
        role: user.role || "user"
      });
      
      // Check for redirect destination
      const redirectPath = typeof window !== "undefined" 
        ? sessionStorage.getItem("redirectAfterLogin") 
        : null;
      
      if (redirectPath) {
        sessionStorage.removeItem("redirectAfterLogin");
        router.push(redirectPath);
      } else {
        router.push("/");
      }
      router.refresh(); // Refresh to update the UI
    } else {
      setError(t("auth.login.error.invalid"));
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-all duration-200 hover:scale-105 group"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
            {t("auth.login.backToHome")}
          </Link>
          <LanguageSelector />
        </div>

        <div className="flex items-center justify-center gap-2 mb-8">
          <Globe className="h-10 w-10 text-blue-600" />
          <span className="text-3xl font-bold text-gray-900">Localo</span>
        </div>

        <Card className="border-0 shadow-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">{t("auth.login.title")}</CardTitle>
            <CardDescription className="text-center">
              {t("auth.login.description")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Google Sign-In */}
            <div className="mb-6">
              <GoogleSignIn mode="login" />
            </div>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">{t("auth.or")}</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">
                  {t("auth.login.email")}
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-sm font-medium text-gray-700">
                    {t("auth.login.password")}
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                  >
                    {t("auth.login.forgotPassword")}
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder={t("auth.login.password")}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? t("auth.login.signingIn") : t("auth.login.signIn")}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-gray-600">{t("auth.login.noAccount")} </span>
              <Link
                href="/register"
                className="text-blue-600 hover:text-blue-700 font-medium transition-all duration-200 hover:underline hover:scale-105 inline-block"
              >
                {t("auth.login.signUp")}
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

