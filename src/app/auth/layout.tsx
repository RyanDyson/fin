import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in or create an account to start learning with StudyRot.",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
