"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Globe, ArrowLeft, Lock, Check, AlertCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSelector } from "@/components/LanguageSelector";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useLanguage();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);
  const [email, setEmail] = useState("");

  useEffect(() => {
    // Check if token is valid
    const token = searchParams.get("token");
    const emailParam = searchParams.get("email");

    if (!token || !emailParam) {
      setTokenValid(false);
      setError(t("auth.resetPassword.error.invalidToken"));
      return;
    }

    setEmail(emailParam);

    // Validate token
    const resetTokens = JSON.parse(localStorage.getItem("passwordResetTokens") || "{}");
    const tokenData = resetTokens[emailParam];

    if (!tokenData || tokenData.token !== token) {
      setTokenValid(false);
      setError(t("auth.resetPassword.error.invalidToken"));
      return;
    }

    // Check if token is expired
    if (Date.now() > tokenData.expiresAt) {
      setTokenValid(false);
      setError(t("auth.resetPassword.error.invalidToken"));
      return;
    }

    setTokenValid(true);
  }, [searchParams, t]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Validation
    if (!password || !confirmPassword) {
      setError(t("auth.resetPassword.error.fillFields"));
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError(t("auth.resetPassword.error.passwordsMatch"));
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError(t("auth.resetPassword.error.passwordLength"));
      setIsLoading(false);
      return;
    }

    // Validate token again
    const token = searchParams.get("token");
    const resetTokens = JSON.parse(localStorage.getItem("passwordResetTokens") || "{}");
    const tokenData = resetTokens[email];

    if (!tokenData || tokenData.token !== token || Date.now() > tokenData.expiresAt) {
      setError(t("auth.resetPassword.error.invalidToken"));
      setIsLoading(false);
      return;
    }

    // Update user password
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const userIndex = users.findIndex((u: any) => u.email === email);

    if (userIndex === -1) {
      setError(t("auth.resetPassword.error.userNotFound"));
      setIsLoading(false);
      return;
    }

    // Update password
    users[userIndex].password = password;
    localStorage.setItem("users", JSON.stringify(users));

    // Remove used reset token
    delete resetTokens[email];
    localStorage.setItem("passwordResetTokens", JSON.stringify(resetTokens));

    setSuccess(true);

    // Redirect to login after 2 seconds
    setTimeout(() => {
      router.push("/login");
    }, 2000);

    setIsLoading(false);
  };

  if (tokenValid === null) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50 flex items-center justify-center px-4">
        <Card className="border-0 shadow-xl max-w-md w-full">
          <CardContent className="p-8 text-center">
            <div className="text-gray-600">Loading...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (tokenValid === false) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="flex items-center justify-between mb-6">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-all duration-200 hover:scale-105 group"
            >
              <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
              {t("auth.resetPassword.backToLogin")}
            </Link>
            <LanguageSelector />
          </div>

          <Card className="border-0 shadow-xl">
            <CardHeader className="space-y-1">
              <div className="flex justify-center mb-4">
                <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="h-8 w-8 text-red-600" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-center">Invalid Reset Link</CardTitle>
              <CardDescription className="text-center">
                {error}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" asChild>
                <Link href="/forgot-password">
                  Request New Reset Link
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-all duration-200 hover:scale-105 group"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
            {t("auth.resetPassword.backToLogin")}
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
                <Lock className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-center">{t("auth.resetPassword.title")}</CardTitle>
            <CardDescription className="text-center">
              {t("auth.resetPassword.description")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md text-sm mb-4 flex items-start gap-2">
                <Check className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <span>{t("auth.resetPassword.success")}</span>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-700">
                  {t("auth.resetPassword.password")}
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder={t("auth.resetPassword.password")}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading || success}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                  {t("auth.resetPassword.confirmPassword")}
                </label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder={t("auth.resetPassword.confirmPassword")}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
                {isLoading ? t("auth.resetPassword.resetting") : t("auth.resetPassword.resetPassword")}
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


