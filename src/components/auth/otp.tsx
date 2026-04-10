"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { authClient } from "@/server/better-auth/client";
import { toast } from "sonner";
import { useAuthNavigation } from "./auth-context";

export function OTP() {
  const { email } = useAuthNavigation();
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (otp.length !== 6) {
      toast.error("Please enter a valid 6-digit code");
      return;
    }

    setIsLoading(true);

    try {
      const data = await authClient.twoFactor.verifyOtp({
        code: otp,
      });

      if (data.error) {
        toast.error(data.error.message ?? "Invalid verification code");
      } else {
        toast.success("Verified successfully!");
        router.push("/dashboard");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);

    try {
      const data = await authClient.twoFactor.sendOtp();

      if (data.error) {
        toast.error(data.error.message ?? "Failed to resend code");
      } else {
        toast.success("Verification code sent!");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
      console.error(error);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="font-serif text-3xl font-normal tracking-tight text-white">
          Verify your identity
        </CardTitle>
        <CardDescription className="border-b pb-4 text-sm">
          Enter the 6-digit code sent to{" "}
          {email && <span className="font-semibold">{email}</span>}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label
              htmlFor="otp"
              className="block w-full text-center text-sm font-normal"
            >
              Verification Code
            </Label>
            <div className="flex justify-center">
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={setOtp}
                disabled={isLoading}
                containerClassName="gap-2"
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} className="h-12 w-12" />
                  <InputOTPSlot index={1} className="h-12 w-12" />
                  <InputOTPSlot index={2} className="h-12 w-12" />
                  <InputOTPSlot index={3} className="h-12 w-12" />
                  <InputOTPSlot index={4} className="h-12 w-12" />
                  <InputOTPSlot index={5} className="h-12 w-12" />
                </InputOTPGroup>
              </InputOTP>
            </div>
          </div>
          <Button
            type="submit"
            variant="gradient"
            className="h-11 w-full border font-medium transition-colors"
            disabled={isLoading || otp.length !== 6}
          >
            {isLoading ? "Verifying..." : "Verify"}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm">
          Didn&apos;t receive the code?{" "}
          <Button
            type="button"
            onClick={handleResend}
            disabled={isResending}
            className="font-medium transition-colors hover:underline disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isResending ? "Resending..." : "Resend code"}
          </Button>
        </p>
      </CardContent>
    </Card>
  );
}
