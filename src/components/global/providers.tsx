import { Toaster } from "../ui/sonner";
import { TRPCReactProvider } from "@/trpc/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TRPCReactProvider>
      <Toaster />
      {children}
    </TRPCReactProvider>
  );
}
