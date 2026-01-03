"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "./AuthContext";

export type SubscriptionStatus = "trial" | "active" | "expired" | "none";
export type PaymentStatus = "pending" | "completed" | "failed" | "refunded";

export interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  date: string;
  paymentMethod?: string;
  transactionId?: string;
}

export interface Subscription {
  status: SubscriptionStatus;
  trialStartDate: string | null;
  trialEndDate: string | null;
  subscriptionStartDate: string | null;
  isLifetime: boolean;
  payments: Payment[];
}

interface SubscriptionContextType {
  subscription: Subscription | null;
  isSubscribed: boolean;
  isTrialActive: boolean;
  daysRemainingInTrial: number;
  initializeTrial: () => void;
  activateSubscription: (paymentId: string, amount: number) => void;
  addPayment: (payment: Payment) => void;
  refreshSubscription: () => void;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

const TRIAL_DURATION_DAYS = 7;

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (user) {
      loadSubscription();
    }
  }, [user]);

  const loadSubscription = () => {
    if (typeof window === "undefined" || !user) return;

    const subscriptions = JSON.parse(localStorage.getItem("subscriptions") || "{}");
    const userSubscription = subscriptions[user.email];

    if (userSubscription) {
      setSubscription(userSubscription);
    } else {
      // Initialize with no subscription
      setSubscription({
        status: "none",
        trialStartDate: null,
        trialEndDate: null,
        subscriptionStartDate: null,
        isLifetime: false,
        payments: [],
      });
    }
  };

  const initializeTrial = () => {
    if (typeof window === "undefined" || !user) return;

    const now = new Date();
    const trialEnd = new Date(now);
    trialEnd.setDate(trialEnd.getDate() + TRIAL_DURATION_DAYS);

    const newSubscription: Subscription = {
      status: "trial",
      trialStartDate: now.toISOString(),
      trialEndDate: trialEnd.toISOString(),
      subscriptionStartDate: null,
      isLifetime: false,
      payments: [],
    };

    setSubscription(newSubscription);
    saveSubscription(newSubscription);
  };

  const activateSubscription = (paymentId: string, amount: number) => {
    if (typeof window === "undefined" || !user) return;

    const now = new Date();
    const payment: Payment = {
      id: paymentId,
      amount,
      currency: "USD",
      status: "completed",
      date: now.toISOString(),
      paymentMethod: "stripe",
      transactionId: paymentId,
    };

    const updatedSubscription: Subscription = {
      status: "active",
      trialStartDate: subscription?.trialStartDate || null,
      trialEndDate: subscription?.trialEndDate || null,
      subscriptionStartDate: now.toISOString(),
      isLifetime: true,
      payments: [...(subscription?.payments || []), payment],
    };

    setSubscription(updatedSubscription);
    saveSubscription(updatedSubscription);
  };

  const addPayment = (payment: Payment) => {
    if (typeof window === "undefined" || !user || !subscription) return;

    const updatedSubscription: Subscription = {
      ...subscription,
      payments: [...subscription.payments, payment],
    };

    setSubscription(updatedSubscription);
    saveSubscription(updatedSubscription);
  };

  const saveSubscription = (sub: Subscription) => {
    if (typeof window === "undefined" || !user) return;

    const subscriptions = JSON.parse(localStorage.getItem("subscriptions") || "{}");
    subscriptions[user.email] = sub;
    localStorage.setItem("subscriptions", JSON.stringify(subscriptions));
  };

  const refreshSubscription = () => {
    loadSubscription();
  };

  // Calculate subscription status based on dates
  const getEffectiveStatus = (): SubscriptionStatus => {
    if (!subscription) return "none";

    // If lifetime subscription is active, always return active
    if (subscription.isLifetime && subscription.subscriptionStartDate) {
      return "active";
    }

    // Check trial status
    if (subscription.status === "trial" && subscription.trialEndDate) {
      const now = new Date();
      const trialEnd = new Date(subscription.trialEndDate);
      if (now > trialEnd) {
        return "expired";
      }
      return "trial";
    }

    return subscription.status;
  };

  const effectiveStatus = getEffectiveStatus();
  const isSubscribed = effectiveStatus === "active" || effectiveStatus === "trial";
  const isTrialActive = effectiveStatus === "trial";

  const daysRemainingInTrial = (): number => {
    if (!subscription?.trialEndDate) return 0;
    const now = new Date();
    const trialEnd = new Date(subscription.trialEndDate);
    const diff = trialEnd.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return Math.max(0, days);
  };

  // Prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  return (
    <SubscriptionContext.Provider
      value={{
        subscription,
        isSubscribed,
        isTrialActive,
        daysRemainingInTrial: daysRemainingInTrial(),
        initializeTrial,
        activateSubscription,
        addPayment,
        refreshSubscription,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error("useSubscription must be used within a SubscriptionProvider");
  }
  return context;
}


