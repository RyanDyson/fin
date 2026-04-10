"use client";

import { createContext, useContext } from "react";

import { SignIn } from "./sign-in";
import { SignUp } from "./sign-up";
import { ResetPassword } from "./reset-password";
import { OTP } from "./otp";

export enum Mode {
  LOGIN = "login",
  SIGNUP = "signup",
  RESET_PASSWORD = "reset-password",
  OTP = "otp",
}

export const ModeConfig: Record<Mode, React.ReactNode> = {
  [Mode.LOGIN]: <SignIn />,
  [Mode.SIGNUP]: <SignUp />,
  [Mode.RESET_PASSWORD]: <ResetPassword />,
  [Mode.OTP]: <OTP />,
};

interface AuthContextType {
  setMode: (mode: Mode) => void;
  mode: Mode;
  email: string;
  setEmail: (email: string) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export function useAuthNavigation() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthNavigation must be used within AuthContext");
  }
  return context;
}
