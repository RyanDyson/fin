"use client";

import { useState, useEffect } from "react";
import { AuthContext, Mode, ModeConfig } from "@/components/auth/auth-context";
import Grainient from "@/components/Grainient";

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
        <div className="relative hidden h-full w-1/2 items-center justify-center overflow-hidden lg:flex">
          {/* dither background */}
          <div className="absolute inset-0 z-0 opacity-60">
            <Grainient color1="#FFFFFF" color2="#7008e7" color3="#c4b2ff" />
          </div>
          <div className="absolute inset-0 z-0" />

          <div className="relative z-10 h-80 w-80">
            {/* Background blobs for glassmorphism to show through */}
            <div className="bg-primary/40 absolute -top-10 -left-10 z-0 h-48 w-48 animate-pulse rounded-full blur-3xl" />
            <div
              className="bg-primary/30 absolute -right-10 -bottom-10 z-0 h-56 w-56 animate-pulse rounded-full blur-3xl"
              style={{ animationDelay: "1s" }}
            />

            {/* Flashcard 3 (Back) */}
            <div className="border-border bg-background/40 absolute top-8 left-8 z-10 h-64 w-full rotate-6 rounded-2xl border p-6 shadow-xl backdrop-blur-md transition-transform hover:rotate-12"></div>

            {/* Flashcard 2 (Middle) */}
            <div className="border-border bg-background/60 absolute top-4 left-4 z-20 h-64 w-full -rotate-3 rounded-2xl border p-6 shadow-xl backdrop-blur-md transition-transform hover:-rotate-6"></div>

            {/* Main UI Element */}
            <div className="border-border bg-background/80 absolute top-0 left-0 z-30 flex h-64 w-full flex-col justify-between rounded-2xl border p-6 shadow-2xl backdrop-blur-xl transition-transform hover:-translate-y-2">
              <div className="flex items-start justify-between">
                <span className="bg-primary/20 text-primary animate-pulse rounded-full px-3 py-1 text-xs font-semibold">
                  Course Generated ✨
                </span>
                <span className="text-2xl">🧠</span>
              </div>
              <div className="text-center">
                <h3 className="truncate text-xl font-bold">
                  Lecture_Slides.pdf
                </h3>
                <p className="text-muted-foreground mt-2 text-sm">
                  Your boring reading has been converted into an interactive
                  brainrot session. No cap.
                </p>
              </div>
              <div className="text-muted-foreground flex items-center justify-between text-xs font-medium">
                <div className="flex gap-2">
                  <span className="bg-muted rounded-md px-2 py-1">
                    10 Objectives
                  </span>
                  <span className="bg-muted rounded-md px-2 py-1">
                    Quiz Ready
                  </span>
                </div>
                <span className="text-primary">Press Start 🎮</span>
              </div>
            </div>

            {/* Floaty emojis */}
            <div
              className="absolute -top-8 -left-8 z-40 animate-bounce text-5xl drop-shadow-lg"
              style={{ animationDuration: "3s" }}
            >
              ✨
            </div>
            <div
              className="absolute right-4 -bottom-4 z-40 animate-bounce text-5xl drop-shadow-lg"
              style={{ animationDuration: "4s", animationDelay: "1s" }}
            >
              🚀
            </div>
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
