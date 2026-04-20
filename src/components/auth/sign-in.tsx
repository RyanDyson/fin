"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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

export function SignIn() {
  const { setMode, setEmail: setContextEmail } = useAuthNavigation();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data = await authClient.signIn.email({ email, password });

      if (data.error) {
        console.error(data.error);
        toast.error(data.error.message);
        return;
      }

      if (data.data && "twoFactorRedirect" in data.data) {
        await authClient.twoFactor.sendOtp();
        toast.success("Check your email for a verification code.");
        setContextEmail(email);
        setMode(Mode.OTP);
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md px-0">
      <CardHeader className="px-0 text-left">
        <CardTitle className="text-card-foreground px-6 text-3xl font-normal tracking-tight">
          Login
        </CardTitle>
        <CardDescription className="border-b px-6 pb-2 text-sm">
          Welcome back to Fin
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-3">
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
              className="h-11 rounded-full"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-sm font-normal">
                Password
              </Label>
              <button
                type="button"
                onClick={() => setMode(Mode.RESET_PASSWORD)}
                className="text-muted-foreground transition-color cursor-pointer text-sm hover:underline"
              >
                Reset Password
              </button>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
            {isLoading ? "Signing in..." : "Login"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="border-border flex flex-col gap-4 border-t pt-6">
        <Button
          variant="outline"
          type="button"
          className="flex h-11 w-full items-center justify-center gap-2 rounded-full transition-colors"
          onClick={handleGitHubSignIn}
        >
          Sign in with GitHub
        </Button>
      </CardFooter>
    </Card>
  );
}
