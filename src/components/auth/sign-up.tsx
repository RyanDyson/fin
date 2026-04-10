"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { authClient } from "@/server/better-auth/client";
import { toast } from "sonner";
import { useAuthNavigation } from "./auth-context";
import { Mode } from "./auth-context";

export function SignUp() {
  const { setMode, setEmail: setContextEmail } = useAuthNavigation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
      const signUpResult = await authClient.signUp.email({
        email,
        password,
        name,
      });

      if (signUpResult.error) {
        toast.error(signUpResult.error.message ?? "Failed to create account");
        return;
      }

      const enableResult = await authClient.twoFactor.enable({ password });

      if (enableResult.error) {
        toast.error(
          enableResult.error.message ?? "Failed to enable two-factor auth",
        );
        return;
      }

      await authClient.signOut();

      const signInResult = await authClient.signIn.email({ email, password });

      if (signInResult.error) {
        toast.error(signInResult.error.message ?? "Failed to sign in");
        return;
      }

      if (signInResult.data && "twoFactorRedirect" in signInResult.data) {
        await authClient.twoFactor.sendOtp();
        toast.success(
          "Account created! Check your email for a verification code.",
        );
        setContextEmail(email);
        setMode(Mode.OTP);
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGitHubSignIn = async () => {
    const data = await authClient.signIn.social({
      provider: "github",
      callbackURL: "/dashboard",
    });

    if (data.error) {
      console.error(data.error);
      toast.error(data.error.message);
    }
  };

  return (
    <Card className="w-full max-w-md px-0">
      <CardHeader className="px-0 text-left">
        <CardTitle className="text-card-foreground px-6 text-3xl font-normal tracking-tight">
          Create account
        </CardTitle>
        <CardDescription className="border-b px-6 pb-4 text-sm">
          description here
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-normal">
              Full Name
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={isLoading}
              className="h-11"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-normal">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="user@nextmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              className="h-11"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-normal">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Create a strong password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              className="h-11"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-sm font-normal">
              Confirm Password
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={isLoading}
              className="h-11"
            />
          </div>
          <Button
            type="submit"
            variant="gradient"
            className="h-11 w-full border font-medium transition-colors"
            disabled={isLoading}
          >
            {isLoading ? "Creating account..." : "Sign Up"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="border-border flex flex-col gap-4 border-t pt-6">
        <Button
          variant="outline"
          type="button"
          className="flex h-11 w-full items-center justify-center gap-2 transition-colors"
          onClick={handleGitHubSignIn}
        >
          Sign up with GitHub
        </Button>
      </CardFooter>
    </Card>
  );
}
