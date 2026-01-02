"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  User, Settings, MapPin, Heart, Calendar, 
  ArrowLeft, Globe, LogOut, Edit, Shield, 
  BookOpen, Star, TrendingUp, Award, Crown,
  CreditCard, Clock, CheckCircle, AlertCircle
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSelector } from "@/components/LanguageSelector";

export default function DashboardPage() {
  const router = useRouter();
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const { 
    subscription, 
    isSubscribed, 
    isTrialActive, 
    daysRemainingInTrial 
  } = useSubscription();
  const { t } = useLanguage();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  if (!isAuthenticated) {
    return null;
  }

  // Mock data for user activity
  const visitedDepartamentos = 3;
  const favoritePlaces = 5;
  const upcomingTrips = 1;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm shadow-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Button variant="ghost" className="gap-2 group">
                <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
                {t("dashboard.backToHome")}
              </Button>
            </Link>
            <div className="flex items-center gap-4">
              <LanguageSelector />
              {isAdmin && (
                <Button variant="ghost" asChild>
                  <Link href="/admin">
                    <Shield className="h-4 w-4" />
                    <span className="hidden md:inline">Admin</span>
                  </Link>
                </Button>
              )}
              <Button variant="ghost" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
                {t("nav.logout")}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <User className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{t("dashboard.welcome")}, {user?.name}!</h1>
              <p className="text-gray-600">{t("dashboard.subtitle")}</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">{t("dashboard.stats.visited")}</CardTitle>
                <MapPin className="h-5 w-5 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{visitedDepartamentos}</div>
              <p className="text-sm text-gray-500 mt-1">{t("dashboard.stats.departamentos")}</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">{t("dashboard.stats.favorites")}</CardTitle>
                <Heart className="h-5 w-5 text-red-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{favoritePlaces}</div>
              <p className="text-sm text-gray-500 mt-1">{t("dashboard.stats.places")}</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">{t("dashboard.stats.trips")}</CardTitle>
                <Calendar className="h-5 w-5 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{upcomingTrips}</div>
              <p className="text-sm text-gray-500 mt-1">{t("dashboard.stats.upcoming")}</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Account Information */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                <CardTitle>{t("dashboard.account.title")}</CardTitle>
              </div>
              <CardDescription>{t("dashboard.account.description")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">{t("dashboard.account.name")}</label>
                <p className="text-lg font-semibold text-gray-900 mt-1">{user?.name}</p>
              </div>
              <Separator />
              <div>
                <label className="text-sm font-medium text-gray-500">{t("dashboard.account.email")}</label>
                <p className="text-lg font-semibold text-gray-900 mt-1">{user?.email}</p>
              </div>
              <Separator />
              <Button variant="outline" className="w-full">
                <Edit className="h-4 w-4" />
                {t("dashboard.account.editProfile")}
              </Button>
            </CardContent>
          </Card>

          {/* Subscription Status */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                  <Crown className="h-5 w-5 text-white" />
                </div>
                <CardTitle>{t("dashboard.subscription.title")}</CardTitle>
              </div>
              <CardDescription>{t("dashboard.subscription.description")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-500">{t("dashboard.subscription.status")}</label>
                  {subscription?.isLifetime ? (
                    <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                      <Crown className="h-3 w-3 mr-1" />
                      {t("dashboard.subscription.lifetime")}
                    </Badge>
                  ) : isTrialActive ? (
                    <Badge className="bg-blue-500 text-white">
                      <Clock className="h-3 w-3 mr-1" />
                      {t("dashboard.subscription.trial")}
                    </Badge>
                  ) : (
                    <Badge variant="secondary">
                      {t("dashboard.subscription.none")}
                    </Badge>
                  )}
                </div>
                {isTrialActive && (
                  <p className="text-sm text-gray-600">
                    {t("dashboard.subscription.trialDays", { days: daysRemainingInTrial })}
                  </p>
                )}
                {subscription?.isLifetime && (
                  <p className="text-sm text-gray-600">
                    {t("dashboard.subscription.lifetimeActive")}
                  </p>
                )}
                {!isSubscribed && (
                  <p className="text-sm text-gray-600">
                    {t("dashboard.subscription.noSubscription")}
                  </p>
                )}
              </div>
              <Separator />
              <Button variant="outline" className="w-full" asChild>
                <Link href="/subscription">
                  <CreditCard className="h-4 w-4 mr-2" />
                  {t("dashboard.subscription.manage")}
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Award className="h-5 w-5 text-purple-600" />
                </div>
                <CardTitle>{t("dashboard.actions.title")}</CardTitle>
              </div>
              <CardDescription>{t("dashboard.actions.description")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/">
                  <Globe className="h-4 w-4" />
                  {t("dashboard.actions.explore")}
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/">
                  <Heart className="h-4 w-4" />
                  {t("dashboard.actions.favorites")}
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/">
                  <Calendar className="h-4 w-4" />
                  {t("dashboard.actions.trips")}
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/">
                  <BookOpen className="h-4 w-4" />
                  {t("dashboard.actions.guides")}
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start border-yellow-200 bg-yellow-50 hover:bg-yellow-100" asChild>
                <Link href="/subscription">
                  <Crown className="h-4 w-4 text-yellow-600" />
                  {t("dashboard.actions.subscription")}
                </Link>
              </Button>
              {isAdmin && (
                <Button variant="outline" className="w-full justify-start border-blue-200 bg-blue-50 hover:bg-blue-100" asChild>
                  <Link href="/admin">
                    <Shield className="h-4 w-4 text-blue-600" />
                    Admin Panel
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Payment History */}
        {subscription && subscription.payments.length > 0 && (
          <Card className="border-0 shadow-lg mt-6">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <CreditCard className="h-5 w-5 text-green-600" />
                </div>
                <CardTitle>{t("dashboard.payments.title")}</CardTitle>
              </div>
              <CardDescription>{t("dashboard.payments.description")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {subscription.payments.map((payment) => (
                  <div
                    key={payment.id}
                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                      {payment.status === "completed" ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : payment.status === "pending" ? (
                        <Clock className="h-5 w-5 text-yellow-600" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-red-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">
                        {t("dashboard.payments.lifetimeAccess")}
                      </p>
                      <p className="text-sm text-gray-600">
                        {new Date(payment.date).toLocaleDateString()} • {payment.currency} ${payment.amount.toFixed(2)}
                      </p>
                    </div>
                    <Badge
                      variant={
                        payment.status === "completed"
                          ? "default"
                          : payment.status === "pending"
                          ? "secondary"
                          : "destructive"
                      }
                    >
                      {payment.status === "completed"
                        ? t("dashboard.payments.completed")
                        : payment.status === "pending"
                        ? t("dashboard.payments.pending")
                        : t("dashboard.payments.failed")}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Activity */}
        <Card className="border-0 shadow-lg mt-6">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <CardTitle>{t("dashboard.activity.title")}</CardTitle>
            </div>
            <CardDescription>{t("dashboard.activity.description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{t("dashboard.activity.visited")}</p>
                  <p className="text-sm text-gray-600">{t("dashboard.activity.sanSalvador")}</p>
                </div>
                <Badge variant="secondary">{t("dashboard.activity.recent")}</Badge>
              </div>
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="h-10 w-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <Heart className="h-5 w-5 text-red-600" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{t("dashboard.activity.favorited")}</p>
                  <p className="text-sm text-gray-600">{t("dashboard.activity.beach")}</p>
                </div>
                <Badge variant="secondary">{t("dashboard.activity.recent")}</Badge>
              </div>
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Star className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{t("dashboard.activity.rated")}</p>
                  <p className="text-sm text-gray-600">{t("dashboard.activity.attraction")}</p>
                </div>
                <Badge variant="secondary">{t("dashboard.activity.recent")}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

