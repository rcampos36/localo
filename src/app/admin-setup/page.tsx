"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Shield, Check, X } from "lucide-react";

export default function AdminSetupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("rcrogercampos@gmail.com");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSetAdmin = () => {
    if (typeof window === "undefined") return;

    try {
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const userIndex = users.findIndex((u: any) => u.email === email);

      if (userIndex !== -1) {
        users[userIndex].role = "admin";
        localStorage.setItem("users", JSON.stringify(users));
        setMessage(`Successfully set ${email} as admin!`);
        setSuccess(true);
        
        // Also update current user if they're logged in
        const currentUser = localStorage.getItem("currentUser");
        if (currentUser) {
          const user = JSON.parse(currentUser);
          if (user.email === email) {
            user.role = "admin";
            localStorage.setItem("currentUser", JSON.stringify(user));
          }
        }
      } else {
        setMessage(`User with email ${email} not found.`);
        setSuccess(false);
      }
    } catch (error) {
      setMessage("Error: " + (error as Error).message);
      setSuccess(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
      <Card className="border-0 shadow-lg max-w-md w-full">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <Shield className="h-6 w-6 text-blue-600" />
            <CardTitle>Admin Setup</CardTitle>
          </div>
          <CardDescription>
            Set admin role for a user account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label htmlFor="email" className="text-sm font-medium text-gray-700 mb-2 block">
              Email Address
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
            />
          </div>

          <Button onClick={handleSetAdmin} className="w-full" size="lg">
            <Shield className="h-4 w-4 mr-2" />
            Set as Admin
          </Button>

          {message && (
            <div
              className={`p-4 rounded-md ${
                success
                  ? "bg-green-50 border border-green-200 text-green-700"
                  : "bg-red-50 border border-red-200 text-red-700"
              }`}
            >
              <div className="flex items-center gap-2">
                {success ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <X className="h-5 w-5" />
                )}
                <span>{message}</span>
              </div>
            </div>
          )}

          {success && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-sm text-blue-700">
                <strong>Next steps:</strong>
                <br />
                1. Log out and log back in as this user
                <br />
                2. Go to Dashboard to see the Admin Panel button
                <br />
                3. You can now access /admin to manage departamentos
              </p>
            </div>
          )}

          <div className="pt-4 border-t">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.push("/")}
            >
              Back to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

