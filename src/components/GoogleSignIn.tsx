"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useRouter } from "next/navigation";

declare global {
  interface Window {
    google: any;
  }
}

interface GoogleSignInProps {
  onSuccess?: () => void;
  mode?: "login" | "register";
}

export function GoogleSignIn({ onSuccess, mode = "login" }: GoogleSignInProps) {
  const { login } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();
  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load Google Identity Services script
    if (typeof window !== "undefined" && !window.google) {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = initializeGoogleSignIn;
      document.head.appendChild(script);
    } else if (window.google) {
      initializeGoogleSignIn();
    }

    return () => {
      // Cleanup if needed
    };
  }, []);

  const initializeGoogleSignIn = () => {
    if (!window.google || !buttonRef.current) return;

    try {
      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
        callback: handleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: true,
      });

      // Render the button
      if (buttonRef.current && process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) {
        window.google.accounts.id.renderButton(buttonRef.current, {
          type: "standard",
          theme: "outline",
          size: "large",
          text: mode === "login" ? "signin_with" : "signup_with",
          width: "100%",
        });
      }
    } catch (error) {
      console.error("Error initializing Google Sign-In:", error);
    }
  };

  const handleCredentialResponse = (response: any) => {
    if (!response.credential) {
      console.error("No credential received");
      return;
    }

    try {
      // Decode JWT token (in production, verify this on your backend)
      const base64Url = response.credential.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );

      const payload = JSON.parse(jsonPayload);
      
      // Extract user information
      const userData = {
        email: payload.email,
        name: payload.name || payload.given_name + " " + payload.family_name,
        picture: payload.picture,
        googleId: payload.sub,
      };

      // Save user to localStorage (in production, send to your backend)
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const existingUser = users.find((u: any) => u.email === userData.email);
      
      if (!existingUser) {
        // Create new user account
        users.push({
          email: userData.email,
          name: userData.name,
          password: null, // No password for Google users
          googleId: userData.googleId,
          picture: userData.picture,
        });
        localStorage.setItem("users", JSON.stringify(users));
      }

      // Log in the user
      login({
        email: userData.email,
        name: userData.name,
      });

      // Call success callback or redirect
      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Error processing Google credential:", error);
    }
  };

  const handleManualGoogleSignIn = () => {
    // Fallback: Manual Google sign-in simulation
    // This is a demo mode when Google Client ID is not configured
    // In production, configure NEXT_PUBLIC_GOOGLE_CLIENT_ID in your .env file
    const timestamp = Date.now();
    const mockGoogleUser = {
      email: `google.user.${timestamp}@gmail.com`,
      name: "Google User",
    };

    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const existingUser = users.find((u: any) => u.email === mockGoogleUser.email);
    
    if (!existingUser) {
      users.push({
        email: mockGoogleUser.email,
        name: mockGoogleUser.name,
        password: null,
        googleId: "google_" + timestamp,
      });
      localStorage.setItem("users", JSON.stringify(users));
    }

    login({
      email: mockGoogleUser.email,
      name: mockGoogleUser.name,
    });

    if (onSuccess) {
      onSuccess();
    } else {
      router.push("/dashboard");
    }
  };

  // If no Google Client ID is configured, show a manual button
  if (!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) {
    return (
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={handleManualGoogleSignIn}
      >
        <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="currentColor"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="currentColor"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="currentColor"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        {mode === "login" ? t("auth.google.signIn") : t("auth.google.signUp")}
      </Button>
    );
  }

  return (
    <div className="w-full">
      <div ref={buttonRef} className="w-full flex justify-center"></div>
    </div>
  );
}

