"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Globe, ArrowLeft, Mail, Check } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSelector } from "@/components/LanguageSelector";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const generateResetToken = (): string => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Validation
    if (!email) {
      setError(t("auth.forgotPassword.error.fillFields"));
      setIsLoading(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError(t("auth.forgotPassword.error.invalidEmail"));
      setIsLoading(false);
      return;
    }

    // Check if user exists in localStorage
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const userExists = users.find((u: any) => u.email === email);

    if (userExists) {
      // Generate reset token
      const resetToken = generateResetToken();
      const resetTokenExpiry = Date.now() + 3600000; // 1 hour from now

      // Store reset token with email
      const resetTokens = JSON.parse(localStorage.getItem("passwordResetTokens") || "{}");
      resetTokens[email] = {
        token: resetToken,
        expiresAt: resetTokenExpiry
      };
      localStorage.setItem("passwordResetTokens", JSON.stringify(resetTokens));

      // In a real app, you would send an email with the reset link
      // For demo purposes, we'll redirect to the reset page with the token
      // In production, this would be sent via email
      router.push(`/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`);
    } else {
      // Still show success message for security (don't reveal if email exists)
      setSuccess(true);
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-all duration-200 hover:scale-105 group"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
            {t("auth.forgotPassword.backToLogin")}
          </Link>
          <LanguageSelector />
        </div>

        <div className="flex items-center justify-center gap-2 mb-8">
          <Globe className="h-10 w-10 text-blue-600" />
          <span className="text-3xl font-bold text-gray-900">Localo</span>
        </div>

        <Card className="border-0 shadow-xl">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center">
                <Mail className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-center">{t("auth.forgotPassword.title")}</CardTitle>
            <CardDescription className="text-center">
              {t("auth.forgotPassword.description")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md text-sm mb-4 flex items-start gap-2">
                <Check className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <span>{t("auth.forgotPassword.success")}</span>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">
                  {t("auth.forgotPassword.email")}
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading || success}
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={isLoading || success}
              >
                {isLoading ? t("auth.forgotPassword.sending") : t("auth.forgotPassword.sendResetLink")}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-gray-600">Remember your password? </span>
              <Link
                href="/login"
                className="text-blue-600 hover:text-blue-700 font-medium transition-all duration-200 hover:underline hover:scale-105 inline-block"
              >
                {t("auth.login.signIn")}
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

