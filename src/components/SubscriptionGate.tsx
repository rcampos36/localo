"use client";

import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Crown, Lock, Zap } from "lucide-react";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { useLanguage } from "@/contexts/LanguageContext";

interface SubscriptionGateProps {
  children: ReactNode;
  fallback?: ReactNode;
  showUpgradePrompt?: boolean;
}

export function SubscriptionGate({ 
  children, 
  fallback,
  showUpgradePrompt = true 
}: SubscriptionGateProps) {
  const { isSubscribed } = useSubscription();
  const router = useRouter();
  const { t } = useLanguage();

  if (isSubscribed) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  if (!showUpgradePrompt) {
    return null;
  }

  return (
    <Card className="border-2 border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="h-16 w-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
            <Lock className="h-8 w-8 text-white" />
          </div>
        </div>
        <CardTitle className="text-2xl">{t("subscriptionGate.title")}</CardTitle>
        <CardDescription className="text-base mt-2">
          {t("subscriptionGate.description")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <Zap className="h-4 w-4 text-yellow-600" />
            <span>{t("subscriptionGate.feature1")}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <Zap className="h-4 w-4 text-yellow-600" />
            <span>{t("subscriptionGate.feature2")}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <Zap className="h-4 w-4 text-yellow-600" />
            <span>{t("subscriptionGate.feature3")}</span>
          </div>
        </div>
        <div className="flex gap-3 pt-4">
          <Button
            onClick={() => router.push("/subscription")}
            className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white"
          >
            <Crown className="h-4 w-4 mr-2" />
            {t("subscriptionGate.upgrade")}
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push("/subscription")}
            className="flex-1"
          >
            {t("subscriptionGate.startTrial")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

