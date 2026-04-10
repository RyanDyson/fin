import { HydrateClient } from "@/trpc/server";
import { Navbar } from "@/components/global/navbar";

export default async function Home() {
  return (
    <HydrateClient>
      <main className="bg-background text-foreground flex min-h-screen flex-col items-center justify-center">
        <Navbar />
      </main>
    </HydrateClient>
  );
}
