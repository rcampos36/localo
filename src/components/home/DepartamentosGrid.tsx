"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { MapPin, ArrowRight, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import departamentosData from "@/data/el-salvador-departamentos.json";

export function DepartamentosGrid() {
  const router = useRouter();
  const { t } = useLanguage();
  const { isAuthenticated } = useAuth();
  const { isSubscribed } = useSubscription();

  const handleDepartamentoClick = (e: React.MouseEvent, departamentoId: string) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      // Store the intended destination
      if (typeof window !== "undefined") {
        sessionStorage.setItem("redirectAfterLogin", `/departamento/${departamentoId}`);
      }
      router.push("/login");
      return;
    }

    if (!isSubscribed) {
      // Store the intended destination
      if (typeof window !== "undefined") {
        sessionStorage.setItem("redirectAfterSubscription", `/departamento/${departamentoId}`);
      }
      router.push("/subscription");
      return;
    }

    // User is authenticated and subscribed, proceed to departamento page
    router.push(`/departamento/${departamentoId}`);
  };

  const gradients = [
    "from-blue-50 to-blue-100",
    "from-purple-50 to-purple-100",
    "from-green-50 to-green-100",
    "from-orange-50 to-orange-100",
    "from-pink-50 to-pink-100",
    "from-cyan-50 to-cyan-100",
    "from-indigo-50 to-indigo-100",
    "from-teal-50 to-teal-100",
  ];

  return (
    <section id="departamentos" className="container mx-auto px-4 py-20">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 mb-4">
          <Sparkles className="h-5 w-5 text-blue-600" />
          <Badge variant="secondary" className="text-sm font-medium">
            {t("home.departamentos.badge")}
          </Badge>
        </div>
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          {t("home.departamentos.title")}
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-6">
          {t("home.departamentos.description")}
        </p>
        <Separator className="max-w-md mx-auto" />
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {departamentosData.features.map((feature, index) => {
          const { id, code } = feature.properties;
          const name = t(`departamentos.${id}.name`) || feature.properties.name;
          const capital = t(`departamentos.${id}.capital`) || (feature.properties as any).capital || "";
          const description = t(`departamentos.${id}.description`) || (feature.properties as any).description || `Discover the beauty and culture of ${name}`;
          const cardImage = (feature.properties as any).cardImage || "";
          const gradient = gradients[index % gradients.length];
          
          return (
            <div 
              key={id} 
              onClick={(e) => handleDepartamentoClick(e, id)}
              className="block h-full cursor-pointer"
            >
              <Card 
                className="border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group overflow-hidden relative h-full rounded-2xl"
              >
                {/* Background Image */}
                {cardImage ? (
                  <div className="absolute inset-0 z-0">
                    <Image
                      src={cardImage}
                      alt={name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/60 to-black/90"></div>
                  </div>
                ) : (
                  <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />
                )}
                
                {/* Gradient accent bar */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient} z-10`} />
                
                <CardHeader className="pb-3 pt-5 relative z-10">
                  <div className="flex items-start justify-between mb-3">
                    <Badge 
                      variant="outline" 
                      className="text-xs font-bold bg-white/95 backdrop-blur-sm border-white/40 text-gray-900 shadow-xl"
                    >
                      {code}
                    </Badge>
                    <div className="h-2.5 w-2.5 rounded-full bg-green-400 animate-pulse shadow-lg shadow-green-400/70" title={t("home.departamentos.available")} />
                  </div>
                  <CardTitle className="text-xl mb-2 text-white font-bold group-hover:text-blue-200 transition-colors duration-300 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                    {name}
                  </CardTitle>
                  {capital && (
                    <CardDescription className="flex items-center gap-1.5 text-sm text-white font-medium drop-shadow-[0_1px_4px_rgba(0,0,0,0.7)]">
                      <MapPin className="h-3.5 w-3.5 text-blue-300" />
                      <span>{capital}</span>
                    </CardDescription>
                  )}
                </CardHeader>
                
                <Separator className="my-3 bg-white/30 relative z-10" />
                
                <CardContent className="pt-0 relative z-10">
                  <p className="text-sm text-white font-medium mb-5 line-clamp-2 leading-relaxed drop-shadow-[0_1px_4px_rgba(0,0,0,0.7)]">
                    {description}
                  </p>
                  <Button 
                    className="w-full group/btn bg-white/95 hover:bg-white text-gray-900 font-semibold shadow-xl hover:shadow-2xl transition-all pointer-events-none border-0"
                  >
                    <span className="inline-flex items-center">
                      {t("home.departamentos.explore")}
                      <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                    </span>
                  </Button>
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>
    </section>
  );
}

