import { Toaster } from "../ui/sonner";
import { TRPCReactProvider } from "@/trpc/react";
import { TooltipProvider } from "../ui/tooltip";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TRPCReactProvider>
      <TooltipProvider>
        <Toaster />
        {children}
      </TooltipProvider>
    </TRPCReactProvider>
  );
}
