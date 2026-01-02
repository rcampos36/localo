"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { t } = useLanguage();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Validation
    if (!name || !email || !password || !confirmPassword) {
      setError(t("auth.register.error.fillFields"));
      setIsLoading(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError(t("auth.register.error.invalidEmail"));
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError(t("auth.register.error.passwordsMatch"));
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError(t("auth.register.error.passwordLength"));
      setIsLoading(false);
      return;
    }

    // Check if user already exists
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const userExists = users.find((u: any) => u.email === email);

    if (userExists) {
      setError(t("auth.register.error.userExists"));
      setIsLoading(false);
      return;
    }

    // Create new user (default role is "user")
    const newUser = { name, email, password, role: "user" };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    // Set auth state using context
    login({ email, name, role: "user" });
    
    // Redirect to subscription page for new users
    router.push("/subscription?newUser=true");
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
            {t("auth.register.backToHome")}
          </Link>
          <LanguageSelector />
        </div>

        <div className="flex items-center justify-center gap-2 mb-8">
          <Globe className="h-10 w-10 text-blue-600" />
          <span className="text-3xl font-bold text-gray-900">Localo</span>
        </div>

        <Card className="border-0 shadow-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">{t("auth.register.title")}</CardTitle>
            <CardDescription className="text-center">
              {t("auth.register.description")}
            </CardDescription>
            <div className="mt-4 flex items-center justify-center">
              <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg">
                <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-sm font-medium text-blue-600">{t("auth.register.emailSignup")}</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Google Sign-In */}
            <div className="mb-6">
              <GoogleSignIn mode="register" />
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
                <label htmlFor="name" className="text-sm font-medium text-gray-700">
                  {t("auth.register.fullName")}
                </label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">
                  {t("auth.register.email")}
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
                <label htmlFor="password" className="text-sm font-medium text-gray-700">
                  {t("auth.register.password")}
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder={t("auth.register.password")}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                  {t("auth.register.confirmPassword")}
                </label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder={t("auth.register.confirmPassword")}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
                {isLoading ? t("auth.register.creatingAccount") : t("auth.register.createAccount")}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-gray-600">{t("auth.register.hasAccount")} </span>
              <Link
                href="/login"
                className="text-blue-600 hover:text-blue-700 font-medium transition-all duration-200 hover:underline hover:scale-105 inline-block"
              >
                {t("auth.register.signIn")}
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

