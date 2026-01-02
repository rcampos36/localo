"use client";

import { useState, useEffect } from "react";
import { notFound, useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, MapPin, Users, Calendar, Camera, Utensils, 
  Waves, Mountain, Building2, Heart, Star, Clock, Navigation,
  ChevronRight, TrendingUp, Award, Info, Share2, BookOpen,
  Thermometer, Droplets, Compass, Image as ImageIcon, Map, Shield
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import departamentosData from "@/data/el-salvador-departamentos.json";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { LanguageSelector } from "@/components/LanguageSelector";

// Activity type icons mapping
const activityIcons = {
  beaches: Waves,
  adventure: Mountain,
  culture: Building2,
  food: Utensils,
  nature: Camera,
  history: Building2,
};

const activityColors = {
  beaches: { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-700", icon: "bg-blue-100 text-blue-600" },
  adventure: { bg: "bg-green-50", border: "border-green-200", text: "text-green-700", icon: "bg-green-100 text-green-600" },
  culture: { bg: "bg-purple-50", border: "border-purple-200", text: "text-purple-700", icon: "bg-purple-100 text-purple-600" },
  food: { bg: "bg-orange-50", border: "border-orange-200", text: "text-orange-700", icon: "bg-orange-100 text-orange-600" },
  nature: { bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700", icon: "bg-emerald-100 text-emerald-600" },
  history: { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700", icon: "bg-amber-100 text-amber-600" },
};

// Default images for places based on category
const getDefaultPlaceImage = (category: string): string => {
  const categoryImages: Record<string, string> = {
    "Nature": "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop",
    "Culture": "https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=800&h=600&fit=crop",
    "Beach": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop",
    "Adventure": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
    "History": "https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=800&h=600&fit=crop",
    "Food": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=600&fit=crop",
  };
  return categoryImages[category] || categoryImages["Nature"];
};

// Background images for adventure activities based on activity category
const getAdventureActivityImage = (activityCategory: string, activityName: string): string => {
  const category = activityCategory?.toLowerCase() || "";
  const name = activityName?.toLowerCase() || "";
  
  // Map activity categories to appropriate adventure images
  const imageMap: Record<string, string> = {
    "hiking": "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&h=600&fit=crop",
    "cycling": "https://images.unsplash.com/photo-1544191696-7713d1e78c69?w=800&h=600&fit=crop",
    "mountain biking": "https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=800&h=600&fit=crop",
    "water sports": "https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=800&h=600&fit=crop",
    "surfing": "https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=800&h=600&fit=crop",
    "volcano": "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&h=600&fit=crop",
    "rock climbing": "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=600&fit=crop",
    "wellness": "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=600&fit=crop",
    "yoga": "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=600&fit=crop",
    "ziplining": "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop",
    "rafting": "https://images.unsplash.com/photo-1511882150382-421056c89033?w=800&h=600&fit=crop",
    "kayaking": "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop",
  };
  
  // Check category first
  if (imageMap[category]) {
    return imageMap[category];
  }
  
  // Check activity name for keywords
  for (const [key, image] of Object.entries(imageMap)) {
    if (name.includes(key)) {
      return image;
    }
  }
  
  // Default adventure image
  return "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop";
};

// Background images for culture activities based on activity category
const getCultureActivityImage = (activityCategory: string, activityName: string): string => {
  const category = activityCategory?.toLowerCase() || "";
  const name = activityName?.toLowerCase() || "";
  
  // Map activity categories to appropriate culture images
  const imageMap: Record<string, string> = {
    "museum": "https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=800&h=600&fit=crop",
    "cultural tour": "https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=800&h=600&fit=crop",
    "walking tour": "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=600&fit=crop",
    "artisan": "https://images.unsplash.com/photo-1564422170191-4bd34960fa46?w=800&h=600&fit=crop",
    "artisan tour": "https://images.unsplash.com/photo-1564422170191-4bd34960fa46?w=800&h=600&fit=crop",
    "crafts": "https://images.unsplash.com/photo-1564422170191-4bd34960fa46?w=800&h=600&fit=crop",
    "architecture": "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=600&fit=crop",
    "colonial": "https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=800&h=600&fit=crop",
    "cathedral": "https://images.unsplash.com/photo-1539650116574-75c0c6d73a9e?w=800&h=600&fit=crop",
    "church": "https://images.unsplash.com/photo-1539650116574-75c0c6d73a9e?w=800&h=600&fit=crop",
    "market": "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop",
    "local market": "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop",
    "shopping": "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop",
    "tours": "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=600&fit=crop",
    "festival": "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=600&fit=crop",
    "traditions": "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=600&fit=crop",
    "history": "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=600&fit=crop",
    "historical": "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=600&fit=crop",
  };
  
  // Check category first
  if (imageMap[category]) {
    return imageMap[category];
  }
  
  // Check activity name for keywords
  for (const [key, image] of Object.entries(imageMap)) {
    if (name.includes(key)) {
      return image;
    }
  }
  
  // Default culture image
  return "https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=800&h=600&fit=crop";
};

// Background images for food activities based on activity category
const getFoodActivityImage = (activityCategory: string, activityName: string): string => {
  const category = activityCategory?.toLowerCase() || "";
  const name = activityName?.toLowerCase() || "";
  
  const imageMap: Record<string, string> = {
    "food tour": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=600&fit=crop",
    "tasting": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=600&fit=crop",
    "coffee": "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&h=600&fit=crop",
    "coffee tasting": "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&h=600&fit=crop",
    "restaurant": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop",
    "dining": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop",
    "culinary": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=600&fit=crop",
    "market": "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&h=600&fit=crop",
    "cooking": "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&h=600&fit=crop",
    "local cuisine": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=600&fit=crop",
    "street food": "https://images.unsplash.com/photo-1562967914-608f82629710?w=800&h=600&fit=crop",
    "pupusa": "https://images.unsplash.com/photo-1562967914-608f82629710?w=800&h=600&fit=crop",
  };
  
  if (imageMap[category]) {
    return imageMap[category];
  }
  
  for (const [key, image] of Object.entries(imageMap)) {
    if (name.includes(key)) {
      return image;
    }
  }
  
  return "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=600&fit=crop";
};

// Background images for nature activities based on activity category
const getNatureActivityImage = (activityCategory: string, activityName: string): string => {
  const category = activityCategory?.toLowerCase() || "";
  const name = activityName?.toLowerCase() || "";
  
  const imageMap: Record<string, string> = {
    "bird watching": "https://images.unsplash.com/photo-1444464666168-49d633b86797?w=800&h=600&fit=crop",
    "wildlife": "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop",
    "nature walk": "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop",
    "hiking": "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&h=600&fit=crop",
    "forest": "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop",
    "cloud forest": "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop",
    "ecosystem": "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop",
    "flora": "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&h=600&fit=crop",
    "fauna": "https://images.unsplash.com/photo-1444464666168-49d633b86797?w=800&h=600&fit=crop",
    "park": "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop",
    "national park": "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop",
    "sightseeing": "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&h=600&fit=crop",
  };
  
  if (imageMap[category]) {
    return imageMap[category];
  }
  
  for (const [key, image] of Object.entries(imageMap)) {
    if (name.includes(key)) {
      return image;
    }
  }
  
  return "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop";
};

// Background images for beach activities based on activity category
const getBeachActivityImage = (activityCategory: string, activityName: string): string => {
  const category = activityCategory?.toLowerCase() || "";
  const name = activityName?.toLowerCase() || "";
  
  const imageMap: Record<string, string> = {
    "surfing": "https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=800&h=600&fit=crop",
    "water sports": "https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=800&h=600&fit=crop",
    "beach": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop",
    "relaxation": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop",
    "swimming": "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800&h=600&fit=crop",
    "snorkeling": "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop",
    "diving": "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop",
    "fishing": "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop",
    "sunset": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop",
    "beach relaxation": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop",
  };
  
  if (imageMap[category]) {
    return imageMap[category];
  }
  
  for (const [key, image] of Object.entries(imageMap)) {
    if (name.includes(key)) {
      return image;
    }
  }
  
  return "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop";
};

// Background images for history activities based on activity category
const getHistoryActivityImage = (activityCategory: string, activityName: string): string => {
  const category = activityCategory?.toLowerCase() || "";
  const name = activityName?.toLowerCase() || "";
  
  const imageMap: Record<string, string> = {
    "historical": "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=600&fit=crop",
    "history": "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=600&fit=crop",
    "archaeological": "https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=800&h=600&fit=crop",
    "ruins": "https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=800&h=600&fit=crop",
    "monument": "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=600&fit=crop",
    "memorial": "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=600&fit=crop",
    "battlefield": "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=600&fit=crop",
    "historic site": "https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=800&h=600&fit=crop",
    "heritage": "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=600&fit=crop",
  };
  
  if (imageMap[category]) {
    return imageMap[category];
  }
  
  for (const [key, image] of Object.entries(imageMap)) {
    if (name.includes(key)) {
      return image;
    }
  }
  
  return "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=600&fit=crop";
};

export default function DepartamentoPage() {
  const params = useParams();
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { t } = useLanguage();
  const { isAuthenticated, isAdmin } = useAuth();
  const { isSubscribed } = useSubscription();
  
  const departamentoId = params?.id as string;

  // Check authentication and subscription
  useEffect(() => {
    if (!isAuthenticated) {
      // Store the intended destination
      if (typeof window !== "undefined") {
        sessionStorage.setItem("redirectAfterLogin", `/departamento/${departamentoId}`);
      }
      router.push("/login");
      return;
    }

    // Check subscription status
    if (!isSubscribed) {
      // Store the intended destination
      if (typeof window !== "undefined") {
        sessionStorage.setItem("redirectAfterSubscription", `/departamento/${departamentoId}`);
      }
      router.push("/subscription");
      return;
    }
  }, [isAuthenticated, isSubscribed, departamentoId, router]);

  // Show nothing while checking auth/subscription
  if (!isAuthenticated || !isSubscribed) {
    return null;
  }
  
  const departamento = departamentosData.features.find(
    (f) => f.properties.id === departamentoId
  );

  if (!departamento) {
    notFound();
  }

  // Load admin-saved data from localStorage if available
  const getAdminData = () => {
    if (typeof window !== "undefined") {
      const savedData = localStorage.getItem("adminDepartamentosData");
      if (savedData) {
        const allData = JSON.parse(savedData);
        return allData[departamentoId] || null;
      }
    }
    return null;
  };

  const adminData = getAdminData();
  const baseProps = departamento.properties as any;

  const { code } = departamento.properties;
  const name = t(`departamentos.${departamentoId}.name`) || departamento.properties.name;
  const capital = t(`departamentos.${departamentoId}.capital`) || baseProps.capital || "";
  
  // Use admin data if available, otherwise use default
  const defaultDescription = adminData?.description || baseProps.description || `Discover the beauty and culture of ${name}, El Salvador.`;
  const description = t(`departamentos.${departamentoId}.description`) || defaultDescription;
  const activities = adminData?.activities || baseProps.activities || {};
  const highlights = baseProps.highlights || [];
  const heroImage = adminData?.heroImage || adminData?.cardImage || baseProps.heroImage || baseProps.cardImage || "";
  const bestTimeToVisit = baseProps.bestTimeToVisit || "";
  const travelTips = baseProps.travelTips || [];
  
  // Enhanced departamento information
  const location = baseProps.location || {};
  const climate = baseProps.climate || {};
  const statistics = baseProps.statistics || {};
  const placesToVisit = baseProps.placesToVisit || [];

  // Get all activity categories
  const categories = Object.keys(activities).filter(cat => activities[cat] && activities[cat].length > 0);
  
  // Filter activities by selected category
  const filteredActivities = selectedCategory 
    ? { [selectedCategory]: activities[selectedCategory] }
    : activities;

  // Count total activities
  const totalActivities = Object.values(activities).reduce((sum: number, items: any) => sum + (items?.length || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm shadow-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Button variant="ghost" className="gap-2 group">
                <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
                {t("departamento.backToMap")}
              </Button>
            </Link>
            <div className="flex items-center gap-4">
              <LanguageSelector />
              {isAdmin && (
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/admin">
                    <Shield className="h-4 w-4" />
                    <span className="hidden md:inline">Admin</span>
                  </Link>
                </Button>
              )}
              <Button variant="ghost" size="sm" className="gap-2">
                <Share2 className="h-4 w-4" />
                {t("departamento.share")}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-[500px] md:h-[600px] overflow-hidden">
        {heroImage ? (
          <>
            <div className="absolute inset-0">
              <Image
                src={heroImage}
                alt={name}
                fill
                className="object-cover"
                priority
                unoptimized
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70"></div>
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600">
            <div className="absolute inset-0 bg-black/20"></div>
          </div>
        )}
        <div className="container mx-auto px-4 h-full flex items-center relative z-10">
          <div className="text-white max-w-3xl">
            <Badge className="mb-4 bg-white/20 text-white border-white/30 backdrop-blur-sm">
              <MapPin className="h-3 w-3 mr-1" />
              {t("departamento.badge")}
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">{name}</h1>
            <p className="text-xl md:text-2xl mb-6 leading-relaxed">{description}</p>
            <div className="flex flex-wrap gap-4">
              {capital && (
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                  <Building2 className="h-4 w-4" />
                  <span className="text-sm font-medium">{t("departamento.capital")}: {capital}</span>
                </div>
              )}
              {totalActivities > 0 && (
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                  <Award className="h-4 w-4" />
                  <span className="text-sm font-medium">{totalActivities} {t("departamento.activities")}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-blue-50 to-transparent z-10"></div>
      </section>

      {/* Quick Stats Bar */}
      <section className="bg-white border-b shadow-sm -mt-12 relative z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <MapPin className="h-4 w-4 text-blue-600" />
                <span className="text-xs text-gray-500">{t("departamento.code")}</span>
              </div>
              <p className="text-lg font-bold text-gray-900">{code}</p>
            </div>
            {bestTimeToVisit && (
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Clock className="h-4 w-4 text-green-600" />
                  <span className="text-xs text-gray-500">{t("departamento.bestTime")}</span>
                </div>
                <p className="text-sm font-semibold text-gray-900">{bestTimeToVisit.split(',')[0]}</p>
              </div>
            )}
            {totalActivities > 0 && (
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <TrendingUp className="h-4 w-4 text-purple-600" />
                  <span className="text-xs text-gray-500">{t("departamento.activities")}</span>
                </div>
                <p className="text-lg font-bold text-gray-900">{totalActivities}</p>
              </div>
            )}
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Star className="h-4 w-4 text-yellow-500" />
                <span className="text-xs text-gray-500">{t("departamento.rating")}</span>
              </div>
              <p className="text-lg font-bold text-gray-900">4.8★</p>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Departamento Information */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-1 w-12 bg-blue-600 rounded-full"></div>
          <h2 className="text-3xl font-bold text-gray-900">{t("departamento.about")} {name}</h2>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Location Information */}
          {(location.region || location.coordinates || location.area) && (
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Compass className="h-5 w-5 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl">{t("departamento.location.title")}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {location.region && (
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{t("departamento.location.region")}</p>
                      <p className="text-sm text-gray-600">{location.region}</p>
                    </div>
                  </div>
                )}
                {location.coordinates && (
                  <div className="flex items-start gap-2">
                    <Navigation className="h-4 w-4 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{t("departamento.location.coordinates")}</p>
                      <p className="text-sm text-gray-600 font-mono">{location.coordinates}</p>
                    </div>
                  </div>
                )}
                {location.area && (
                  <div className="flex items-start gap-2">
                    <Map className="h-4 w-4 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{t("departamento.location.area")}</p>
                      <p className="text-sm text-gray-600">{location.area}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Climate Information */}
          {(climate.temperature || climate.rainfall || climate.season) && (
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Thermometer className="h-5 w-5 text-green-600" />
                  </div>
                  <CardTitle className="text-xl">{t("departamento.climate.title")}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {climate.temperature && (
                  <div className="flex items-start gap-2">
                    <Thermometer className="h-4 w-4 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{t("departamento.climate.temperature")}</p>
                      <p className="text-sm text-gray-600">{climate.temperature}</p>
                    </div>
                  </div>
                )}
                {climate.rainfall && (
                  <div className="flex items-start gap-2">
                    <Droplets className="h-4 w-4 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{t("departamento.climate.rainfall")}</p>
                      <p className="text-sm text-gray-600">{climate.rainfall}</p>
                    </div>
                  </div>
                )}
                {climate.season && (
                  <div className="flex items-start gap-2">
                    <Calendar className="h-4 w-4 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{t("departamento.climate.bestSeason")}</p>
                      <p className="text-sm text-gray-600">{climate.season}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Key Statistics */}
          {(statistics.population || statistics.municipalities || statistics.elevation) && (
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-purple-600" />
                  </div>
                  <CardTitle className="text-xl">{t("departamento.statistics.title")}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {statistics.population && (
                  <div className="flex items-start gap-2">
                    <Users className="h-4 w-4 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{t("departamento.statistics.population")}</p>
                      <p className="text-sm text-gray-600">{statistics.population}</p>
                    </div>
                  </div>
                )}
                {statistics.municipalities && (
                  <div className="flex items-start gap-2">
                    <Building2 className="h-4 w-4 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{t("departamento.statistics.municipalities")}</p>
                      <p className="text-sm text-gray-600">{statistics.municipalities}</p>
                    </div>
                  </div>
                )}
                {statistics.elevation && (
                  <div className="flex items-start gap-2">
                    <Mountain className="h-4 w-4 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{t("departamento.statistics.elevation")}</p>
                      <p className="text-sm text-gray-600">{statistics.elevation}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Extended Description */}
        {description && (
          <Card className="border-0 shadow-lg mt-6">
            <CardContent className="p-6">
              <p className="text-gray-700 leading-relaxed">{description}</p>
            </CardContent>
          </Card>
        )}
      </section>

      {/* Places to Visit Section */}
      {placesToVisit.length > 0 && (
        <section className="container mx-auto px-4 py-12">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-1 w-12 bg-blue-600 rounded-full"></div>
            <h2 className="text-3xl font-bold text-gray-900">{t("departamento.placesToVisit.title")}</h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {placesToVisit.map((place: any, index: number) => {
              // Get image - use place image, or default based on category, or fallback
              const placeImage = place.images && place.images.length > 0 
                ? place.images[0] 
                : place.image 
                ? place.image
                : getDefaultPlaceImage(place.category || "Nature");
              
              return (
              <Card key={index} className="border-0 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 group overflow-hidden relative min-h-[500px]">
                {/* Background Image */}
                <div className="absolute inset-0">
                  <Image
                    src={placeImage}
                    alt={place.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    unoptimized
                  />
                </div>
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/70 to-black/60"></div>
                
                {/* Content Overlay */}
                <div className="relative z-10 h-full flex flex-col min-h-[500px]">
                  {/* Top Badges */}
                  <div className="absolute top-4 left-4 right-4 flex items-start justify-between z-20">
                    {place.category && (
                      <Badge className="bg-white/90 text-gray-900 backdrop-blur-sm">
                        {place.category}
                      </Badge>
                    )}
                    {place.images && place.images.length > 1 && (
                      <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full">
                        <ImageIcon className="h-3 w-3 text-white" />
                        <span className="text-xs text-white">{place.images.length}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Card Content - positioned at bottom */}
                  <div className="mt-auto p-6">
                    <CardHeader className="p-0 mb-3">
                      <CardTitle className="text-xl text-white group-hover:text-blue-200 transition-colors drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                        {place.name}
                      </CardTitle>
                      {place.location && (
                        <CardDescription className="flex items-center gap-1.5 text-white/90 drop-shadow-[0_1px_4px_rgba(0,0,0,0.7)] mt-2">
                          <MapPin className="h-3.5 w-3.5 text-blue-300" />
                          <span>{place.location}</span>
                        </CardDescription>
                      )}
                    </CardHeader>
                    
                    <CardContent className="p-0">
                      <p className="text-sm text-white mb-4 line-clamp-2 leading-relaxed drop-shadow-[0_1px_4px_rgba(0,0,0,0.7)]">
                        {place.description}
                      </p>
                      
                      {/* Additional Info */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {place.rating && (
                          <Badge variant="outline" className="text-xs bg-white/20 border-white/40 text-white backdrop-blur-sm">
                            <Star className="h-3 w-3 mr-1 fill-yellow-300 text-yellow-300" />
                            {place.rating}
                          </Badge>
                        )}
                        {place.distance && (
                          <Badge variant="outline" className="text-xs bg-white/20 border-white/40 text-white backdrop-blur-sm">
                            <Navigation className="h-3 w-3 mr-1" />
                            {place.distance}
                          </Badge>
                        )}
                      </div>
                      
                      {/* Location Information */}
                      {place.coordinates && (
                        <div className="p-3 bg-white/20 backdrop-blur-sm rounded-lg border border-white/30">
                          <div className="flex items-center gap-2 mb-2">
                            <Navigation className="h-4 w-4 text-blue-300" />
                            <span className="text-xs font-semibold text-white">Coordinates</span>
                          </div>
                          <p className="text-xs font-mono text-white/90 mb-2">{place.coordinates}</p>
                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${place.coordinates}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-300 hover:text-blue-200 inline-flex items-center gap-1 transition-colors"
                          >
                            {t("departamento.placesToVisit.viewOnMaps")}
                            <ChevronRight className="h-3 w-3" />
                          </a>
                        </div>
                      )}
                    </CardContent>
                  </div>
                </div>
              </Card>
              );
            })}
          </div>
        </section>
      )}

      {/* Highlights Section */}
      {highlights.length > 0 && (
        <section className="container mx-auto px-4 py-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-1 w-12 bg-blue-600 rounded-full"></div>
            <h2 className="text-3xl font-bold text-gray-900">{t("departamento.highlights.title")}</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {highlights.map((highlight: string, index: number) => {
              const [title, subtitle] = highlight.split(' - ');
              return (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 group">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                        <Heart className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 mb-1">{title}</h3>
                        {subtitle && (
                          <p className="text-sm text-gray-600">{subtitle}</p>
                        )}
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>
      )}

      {/* Activities Section with Category Filter */}
      {Object.keys(activities).length > 0 && (
        <section className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="h-1 w-12 bg-blue-600 rounded-full"></div>
                <h2 className="text-3xl font-bold text-gray-900">{t("departamento.activities.title")}</h2>
              </div>
              <p className="text-gray-600">{t("departamento.activities.description")} {name}</p>
            </div>
          </div>

          {/* Category Filter Pills */}
          {categories.length > 1 && (
            <div className="flex flex-wrap gap-3 mb-8">
              <Button
                variant={selectedCategory === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(null)}
                className="rounded-full"
              >
                {t("departamento.activities.allActivities")}
              </Button>
              {categories.map((category) => {
                const Icon = activityIcons[category as keyof typeof activityIcons] || Camera;
                const colors = activityColors[category as keyof typeof activityColors] || activityColors.beaches;
                return (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className="rounded-full gap-2"
                  >
                    <Icon className="h-4 w-4" />
                    {t(`departamento.activities.${category}`)}
                  </Button>
                );
              })}
            </div>
          )}
          
          {/* Activities Grid */}
          {Object.entries(filteredActivities).map(([category, items]: [string, any]) => {
            if (!items || items.length === 0) return null;
            
            const Icon = activityIcons[category as keyof typeof activityIcons] || Camera;
            const colors = activityColors[category as keyof typeof activityColors] || activityColors.beaches;
            
            return (
              <div key={category} className="mb-16">
                {selectedCategory === null && (
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`h-14 w-14 rounded-xl flex items-center justify-center ${colors.icon} shadow-lg`}>
                      <Icon className="h-7 w-7" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 capitalize">
                        {category === "adventure" ? t("departamento.activities.adventureActivities") : 
                         category === "beaches" ? t("departamento.activities.beachesWaterSports") :
                         category === "culture" ? t("departamento.activities.cultureHeritage") :
                         category === "food" ? t("departamento.activities.foodDining") :
                         category === "nature" ? t("departamento.activities.natureWildlife") :
                         category === "history" ? t("departamento.activities.historicalSites") : category}
                      </h3>
                      <p className="text-sm text-gray-600">{items.length} {items.length === 1 ? t("departamento.activities.activity") : t("departamento.activities.activities")}</p>
                    </div>
                  </div>
                )}
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {items.map((activity: any, index: number) => {
                    // Get background image for all activity categories
                    const activityImage = activity.image || (
                      category === "adventure" 
                        ? getAdventureActivityImage(activity.category, activity.name)
                        : category === "culture"
                        ? getCultureActivityImage(activity.category, activity.name)
                        : category === "food"
                        ? getFoodActivityImage(activity.category, activity.name)
                        : category === "nature"
                        ? getNatureActivityImage(activity.category, activity.name)
                        : category === "beaches"
                        ? getBeachActivityImage(activity.category, activity.name)
                        : category === "history"
                        ? getHistoryActivityImage(activity.category, activity.name)
                        : null
                    );
                    
                    return (
                    <Card key={index} className={`border-0 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 ${colors.bg} ${colors.border} border-2 overflow-hidden group`}>
                      {activityImage ? (
                        <div className="relative h-56 w-full overflow-hidden">
                          <Image
                            src={activityImage}
                            alt={activity.name}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                            unoptimized
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
                          <div className="absolute top-4 right-4 z-10">
                            {activity.category && (
                              <Badge className="bg-white/90 text-gray-900 backdrop-blur-sm">
                                {activity.category}
                              </Badge>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className={`h-56 w-full ${colors.bg} flex flex-col items-center justify-center relative overflow-hidden`}>
                          <div className={`absolute inset-0 ${colors.bg} opacity-50`}></div>
                          <Icon className={`h-16 w-16 ${colors.text} relative z-10 mb-2`} />
                          {activity.category && (
                            <Badge className="relative z-10 bg-white/90 text-gray-900">
                              {activity.category}
                            </Badge>
                          )}
                        </div>
                      )}
                      <CardHeader className="pb-3">
                        <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">
                          {activity.name}
                        </CardTitle>
                        <div className="flex flex-wrap items-center gap-3 mt-2">
                          {activity.difficulty && (
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${
                                activity.difficulty.toLowerCase() === 'easy' ? 'border-green-300 text-green-700 bg-green-50' :
                                activity.difficulty.toLowerCase() === 'medium' ? 'border-yellow-300 text-yellow-700 bg-yellow-50' :
                                activity.difficulty.toLowerCase() === 'hard' ? 'border-red-300 text-red-700 bg-red-50' :
                                'border-gray-300 text-gray-700 bg-gray-50'
                              }`}
                            >
                              <Info className="h-3 w-3 mr-1" />
                              {activity.difficulty}
                            </Badge>
                          )}
                          {activity.duration && (
                            <Badge variant="outline" className="text-xs">
                              <Clock className="h-3 w-3 mr-1" />
                              {activity.duration}
                            </Badge>
                          )}
                          {activity.category && (
                            <Badge variant="outline" className="text-xs">
                              {activity.category}
                            </Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className={`text-sm mb-4 ${colors.text} leading-relaxed`}>
                          {activity.description}
                        </p>
                        <div className="space-y-2 pt-4 border-t border-gray-200">
                          {activity.bestTime && (
                            <div className="flex items-center gap-2 text-xs text-gray-600">
                              <Calendar className="h-3.5 w-3.5" />
                              <span className="font-medium">{t("departamento.activities.bestTime")}</span>
                              <span>{activity.bestTime}</span>
                            </div>
                          )}
                          {activity.location && (
                            <div className="flex items-center gap-2 text-xs text-gray-600">
                              <MapPin className="h-3.5 w-3.5" />
                              <span>{activity.location}</span>
                            </div>
                          )}
                          {activity.coordinates && (
                            <div className="flex items-center gap-2 text-xs">
                              <Navigation className="h-3.5 w-3.5 text-blue-600" />
                              <span className="font-mono text-gray-600">{activity.coordinates}</span>
                              <a
                                href={`https://www.google.com/maps/search/?api=1&query=${activity.coordinates}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-700 ml-auto"
                              >
                                {t("departamento.activities.map")}
                              </a>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </section>
      )}

      {/* Travel Tips Section */}
      {travelTips.length > 0 && (
        <section className="container mx-auto px-4 py-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-1 w-12 bg-blue-600 rounded-full"></div>
            <h2 className="text-3xl font-bold text-gray-900">{t("departamento.travelTips.title")}</h2>
          </div>
          <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 overflow-hidden">
            <CardHeader className="bg-white/50 backdrop-blur-sm border-b">
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-blue-600" />
                {t("departamento.travelTips.expertTips")} {name}
              </CardTitle>
              <CardDescription>
                {t("departamento.travelTips.description")}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-4">
                {travelTips.map((tip: string, index: number) => (
                  <div key={index} className="flex items-start gap-4 p-4 bg-white/60 backdrop-blur-sm rounded-lg hover:bg-white/80 transition-colors">
                    <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-purple-500 text-white rounded-lg flex items-center justify-center flex-shrink-0 text-sm font-bold shadow-md">
                      {index + 1}
                    </div>
                    <p className="text-gray-700 leading-relaxed flex-1">{tip}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      {/* Related Departamentos */}
      <section className="container mx-auto px-4 py-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-1 w-12 bg-blue-600 rounded-full"></div>
            <h2 className="text-3xl font-bold text-gray-900">{t("departamento.nearby.title")}</h2>
          </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {departamentosData.features
            .filter(f => f.properties.id !== departamentoId)
            .slice(0, 4)
            .map((dept, index) => {
              const deptProps = dept.properties as any;
              const cardImage = deptProps.cardImage || deptProps.heroImage || "";
              const deptName = t(`departamentos.${dept.properties.id}.name`) || dept.properties.name;
              
              // Gradient fallback colors
              const gradients = [
                "from-blue-400 to-purple-400",
                "from-green-400 to-teal-400",
                "from-orange-400 to-pink-400",
                "from-indigo-400 to-blue-400",
              ];
              const gradient = gradients[index % gradients.length];
              
              const handleNearbyClick = (e: React.MouseEvent, nearbyId: string) => {
                e.preventDefault();
                
                if (!isAuthenticated) {
                  if (typeof window !== "undefined") {
                    sessionStorage.setItem("redirectAfterLogin", `/departamento/${nearbyId}`);
                  }
                  router.push("/login");
                  return;
                }

                if (!isSubscribed) {
                  if (typeof window !== "undefined") {
                    sessionStorage.setItem("redirectAfterSubscription", `/departamento/${nearbyId}`);
                  }
                  router.push("/subscription");
                  return;
                }

                router.push(`/departamento/${nearbyId}`);
              };
              
              return (
                <div 
                  key={dept.properties.id} 
                  onClick={(e) => handleNearbyClick(e, dept.properties.id)}
                  className="cursor-pointer"
                >
                  <Card className="border-0 shadow-lg hover:shadow-xl transition-all hover:-translate-y-2 group overflow-hidden relative h-full">
                    {/* Background Image */}
                    {cardImage ? (
                      <div className="absolute inset-0 z-0">
                        <Image
                          src={cardImage}
                          alt={deptName}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                          unoptimized
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/60 to-black/85"></div>
                      </div>
                    ) : (
                      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} group-hover:opacity-90 transition-opacity`}></div>
                    )}
                    
                    <CardContent className="p-6 text-center relative z-10 h-full flex flex-col">
                      <div className="flex-1">
                        <h3 className={`font-bold text-lg mb-2 group-hover:text-blue-200 transition-colors ${cardImage ? 'text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]' : 'text-gray-900'}`}>
                          {deptName}
                        </h3>
                        <p className={`text-sm mb-3 ${cardImage ? 'text-white/90 drop-shadow-[0_1px_4px_rgba(0,0,0,0.7)]' : 'text-gray-600'}`}>
                          {t("departamento.nearby.description")}
                        </p>
                      </div>
                      <Button 
                        variant={cardImage ? "secondary" : "outline"} 
                        size="sm" 
                        className={`w-full ${cardImage ? 'bg-white/95 hover:bg-white text-gray-900' : 'group-hover:bg-blue-600 group-hover:text-white'} transition-colors`}
                      >
                        <span className="inline-flex items-center">
                          {t("departamento.nearby.discover")}
                          <ChevronRight className="h-4 w-4" />
                        </span>
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-12">
        <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-600 to-purple-600 text-white overflow-hidden">
          <CardContent className="p-12 text-center">
            <h2 className="text-4xl font-bold mb-4">{t("departamento.cta.title")} {name}?</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              {t("departamento.cta.description")} {name} {t("departamento.cta.hasToOffer")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="gap-2">
                <Calendar className="h-5 w-5" />
                {t("departamento.cta.planTrip")}
              </Button>
              <Button size="lg" variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20 gap-2">
                <BookOpen className="h-5 w-5" />
                {t("departamento.cta.downloadGuide")}
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
