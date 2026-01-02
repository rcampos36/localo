"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, Check, Crown, CreditCard, Calendar, 
  Zap, Shield, Clock, AlertCircle, Loader2
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSelector } from "@/components/LanguageSelector";

export default function SubscriptionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthenticated } = useAuth();
  const { 
    subscription, 
    isSubscribed, 
    isTrialActive, 
    daysRemainingInTrial,
    initializeTrial,
    activateSubscription 
  } = useSubscription();
  const { t } = useLanguage();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [isNewUser, setIsNewUser] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    // Check if this is a new user registration
    const newUserParam = searchParams.get("newUser");
    if (newUserParam === "true") {
      setIsNewUser(true);
      // Auto-start trial for new users
      if (subscription?.status === "none") {
        initializeTrial();
      }
    }
  }, [isAuthenticated, router, searchParams, subscription, initializeTrial]);

  if (!isAuthenticated) {
    return null;
  }

  const handleStartTrial = () => {
    if (subscription?.status === "trial" || subscription?.status === "active") {
      return;
    }
    initializeTrial();
    
    // Check for redirect destination after starting trial
    const redirectPath = typeof window !== "undefined" 
      ? sessionStorage.getItem("redirectAfterSubscription") 
      : null;
    
    if (redirectPath) {
      sessionStorage.removeItem("redirectAfterSubscription");
      router.push(redirectPath);
    }
  };

  const handlePurchase = async () => {
    setIsProcessing(true);
    setError("");

    try {
      // In a real implementation, this would create a Stripe checkout session
      // For now, we'll simulate the payment process
      // TODO: Replace with actual Stripe integration
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      // Generate a mock payment ID
      const paymentId = `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const amount = 49.99; // Lifetime access price
      
      activateSubscription(paymentId, amount);
      
      // In production, redirect to Stripe Checkout:
      // const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
      // const { error } = await stripe.redirectToCheckout({ sessionId: session.id });
    } catch (err) {
      setError(t("subscription.error.paymentFailed"));
      console.error("Payment error:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusBadge = () => {
    if (subscription?.isLifetime) {
      return (
        <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
          <Crown className="h-3 w-3 mr-1" />
          {t("subscription.status.lifetime")}
        </Badge>
      );
    }
    if (isTrialActive) {
      return (
        <Badge className="bg-blue-500 text-white">
          <Clock className="h-3 w-3 mr-1" />
          {t("subscription.status.trial")} - {daysRemainingInTrial} {t("subscription.daysLeft")}
        </Badge>
      );
    }
    if (subscription?.status === "expired") {
      return (
        <Badge variant="destructive">
          <AlertCircle className="h-3 w-3 mr-1" />
          {t("subscription.status.expired")}
        </Badge>
      );
    }
    return (
      <Badge variant="secondary">
        {t("subscription.status.none")}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm shadow-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard">
              <Button variant="ghost" className="gap-2 group">
                <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
                {t("subscription.backToDashboard")}
              </Button>
            </Link>
            <div className="flex items-center gap-4">
              <LanguageSelector />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t("subscription.title")}
          </h1>
          <p className="text-xl text-gray-600">
            {t("subscription.description")}
          </p>
          {isNewUser && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg max-w-2xl mx-auto">
              <p className="text-blue-800 font-medium">
                {t("subscription.welcomeMessage")}
              </p>
            </div>
          )}
        </div>

        {/* Current Status */}
        {isSubscribed && (
          <Card className="mb-8 border-2 border-blue-200 bg-blue-50/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-600" />
                  {t("subscription.currentStatus")}
                </CardTitle>
                {getStatusBadge()}
              </div>
            </CardHeader>
            <CardContent>
              {isTrialActive && (
                <div className="space-y-2">
                  <p className="text-gray-700">
                    {t("subscription.trialInfo", { days: daysRemainingInTrial })}
                  </p>
                  <p className="text-sm text-gray-600">
                    {t("subscription.trialDescription")}
                  </p>
                </div>
              )}
              {subscription?.isLifetime && (
                <div className="space-y-2">
                  <p className="text-gray-700 font-semibold">
                    {t("subscription.lifetimeActive")}
                  </p>
                  <p className="text-sm text-gray-600">
                    {t("subscription.lifetimeDescription")}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Pricing Card */}
        <Card className="mb-8 border-2 border-purple-200 shadow-xl">
          <CardHeader className="text-center pb-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Crown className="h-6 w-6 text-yellow-500" />
              <CardTitle className="text-3xl">{t("subscription.plan.lifetime.title")}</CardTitle>
            </div>
            <CardDescription className="text-lg">
              {t("subscription.plan.lifetime.subtitle")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-6">
              <div className="flex items-baseline justify-center gap-2">
                <span className="text-5xl font-bold text-gray-900">$49.99</span>
                <span className="text-gray-600">{t("subscription.oneTime")}</span>
              </div>
              <p className="text-sm text-gray-500 mt-2">{t("subscription.noRecurring")}</p>
            </div>

            <Separator className="my-6" />

            {/* Features */}
            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-3">
                <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900">{t("subscription.features.lifetime")}</p>
                  <p className="text-sm text-gray-600">{t("subscription.features.lifetimeDesc")}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900">{t("subscription.features.allContent")}</p>
                  <p className="text-sm text-gray-600">{t("subscription.features.allContentDesc")}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900">{t("subscription.features.updates")}</p>
                  <p className="text-sm text-gray-600">{t("subscription.features.updatesDesc")}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900">{t("subscription.features.support")}</p>
                  <p className="text-sm text-gray-600">{t("subscription.features.supportDesc")}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              {!isSubscribed && subscription?.status === "none" && (
                <>
                  <Button
                    onClick={handleStartTrial}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                    size="lg"
                  >
                    <Zap className="h-5 w-5 mr-2" />
                    {t("subscription.startTrial")}
                  </Button>
                  <Button
                    onClick={handlePurchase}
                    disabled={isProcessing}
                    className="w-full"
                    variant="outline"
                    size="lg"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        {t("subscription.processing")}
                      </>
                    ) : (
                      <>
                        <CreditCard className="h-5 w-5 mr-2" />
                        {t("subscription.purchaseLifetime")}
                      </>
                    )}
                  </Button>
                </>
              )}
              
              {isTrialActive && (
                <Button
                  onClick={handlePurchase}
                  disabled={isProcessing}
                  className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white"
                  size="lg"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      {t("subscription.processing")}
                    </>
                  ) : (
                    <>
                      <Crown className="h-5 w-5 mr-2" />
                      {t("subscription.upgradeNow")}
                    </>
                  )}
                </Button>
              )}

              {subscription?.isLifetime && (
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-green-700 font-semibold">
                    {t("subscription.alreadySubscribed")}
                  </p>
                </div>
              )}

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Trial Info Card */}
        {!isSubscribed && subscription?.status === "none" && (
          <Card className="border-blue-200 bg-blue-50/50">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                <CardTitle>{t("subscription.trialCard.title")}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                {t("subscription.trialCard.description")}
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>{t("subscription.trialCard.noPayment")}</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>{t("subscription.trialCard.fullAccess")}</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>{t("subscription.trialCard.cancelAnytime")}</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Payment Security */}
        <Card className="mt-8 border-gray-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
              <Shield className="h-4 w-4" />
              <span>{t("subscription.security")}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

