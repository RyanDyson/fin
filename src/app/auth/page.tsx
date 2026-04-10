"use client";

import { useState, useEffect } from "react";
import { AuthContext, Mode, ModeConfig } from "@/components/auth/auth-context";
import { Iphone } from "@/components/global/iphone";

export default function AuthPage() {
  const [mode, setMode] = useState<Mode>(Mode.LOGIN);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("token")) {
      setMode(Mode.RESET_PASSWORD);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ mode, setMode, email, setEmail }}>
      <div className="flex h-screen min-w-screen items-center justify-center">
        <div className="relative hidden h-full w-1/2 items-center justify-center overflow-hidden bg-zinc-950 lg:flex">
          {/* dither background */}
          <div className="absolute inset-0 z-0 opacity-60">
            {/*<Dither
              waveColor={[0.5, 1, 0.7]}
              disableAnimation={false}
              enableMouseInteraction
              mouseRadius={0.3}
              colorNum={4}
              waveAmplitude={0.3}
              waveFrequency={3}
              waveSpeed={0.05}
            />*/}
          </div>
          <div className="absolute inset-0 z-0 bg-linear-to-b from-zinc-950/40 via-transparent to-zinc-950/70" />
          {/* phone mockup */}
          <div className="relative z-10 w-80">
            <Iphone src="/preview.jpeg" />
          </div>
        </div>
        <div className="relative z-50 flex flex-col items-center justify-center gap-6 p-4 md:w-1/2">
          {ModeConfig[mode]}
          {mode === Mode.LOGIN && (
            <p className="text-muted-foreground text-center text-sm">
              Don&apos;t have an account?{" "}
              <button
                onClick={() => setMode(Mode.SIGNUP)}
                className="text-primary font-medium hover:underline"
              >
                Sign up
              </button>
            </p>
          )}
          {mode === Mode.SIGNUP && (
            <p className="text-muted-foreground text-center text-sm">
              Already have an account?{" "}
              <button
                onClick={() => setMode(Mode.LOGIN)}
                className="text-primary font-medium hover:underline"
              >
                Sign in
              </button>
            </p>
          )}
          {(mode === Mode.RESET_PASSWORD || mode === Mode.OTP) && (
            <p className="text-muted-foreground text-center text-sm">
              Remember your password?{" "}
              <button
                onClick={() => setMode(Mode.LOGIN)}
                className="text-primary font-medium hover:underline"
              >
                Sign in
              </button>
            </p>
          )}
        </div>
      </div>
    </AuthContext.Provider>
  );
}
