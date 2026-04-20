"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { authClient } from "@/server/better-auth/client";
import { toast } from "sonner";
import { useAuthNavigation, Mode } from "./auth-context";

export function ResetPassword() {
  const { setMode } = useAuthNavigation();
  const [step, setStep] = useState<"request" | "reset">("request");
  const [requestEmail, setRequestEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const urlToken = params.get("token");
      if (urlToken) {
        setStep("reset");
        setResetToken(urlToken);
      }
    }
  }, []);

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!requestEmail) {
      toast.error("Please enter your email address");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/forget-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: requestEmail,
          redirectTo: "/auth",
        }),
      });

      if (!response.ok) {
        const errorData = (await response.json()) as { message?: string };
        toast.error(errorData?.message ?? "Failed to send reset email");
      } else {
        toast.success("Password reset link sent! Check your email.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    setIsLoading(true);

    try {
      const data = await authClient.resetPassword({
        newPassword: password,
        token: resetToken,
      });

      if (data.error) {
        toast.error(data.error.message ?? "Failed to reset password");
      } else {
        toast.success("Password reset successfully!");
        setTimeout(() => {
          setMode(Mode.LOGIN);
        }, 1500);
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (step === "request") {
    return (
      <Card className="w-full max-w-md">
        <CardHeader className="px-0 text-left">
          <CardTitle className="text-card-foreground px-6 text-3xl font-normal tracking-tight">
            Reset Password
          </CardTitle>
          <CardDescription className="border-b px-6 pb-4 text-sm">
            Enter your email address and we&apos;ll send you a link to reset
            your password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRequestReset} className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-normal">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="user@nextmail.com"
                value={requestEmail}
                onChange={(e) => setRequestEmail(e.target.value)}
                required
                disabled={isLoading}
                className="h-11 rounded-full"
              />
            </div>
            <Button
              type="submit"
              variant="gradient"
              className="h-11 w-full rounded-full border font-medium transition-colors"
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Reset Password"}
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md px-0">
      <CardHeader className="text-center">
        <CardTitle className="font-serif text-3xl font-normal tracking-tight text-white">
          Set New Password
        </CardTitle>
        <CardDescription className="border-b pb-4 text-sm">
          Enter your new password below
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleResetPassword} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-normal">
              New Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              minLength={8}
              className="h-11 rounded-sm"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-sm font-normal">
              Confirm Password
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm your new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={isLoading}
              minLength={8}
              className="h-11 rounded-sm"
            />
          </div>
          <Button
            type="submit"
            variant="gradient"
            className="h-11 w-full rounded-sm border font-medium transition-colors"
            disabled={isLoading}
          >
            {isLoading ? "Resetting..." : "Reset Password"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
