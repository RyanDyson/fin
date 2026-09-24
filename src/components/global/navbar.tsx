"use client";

import Link from "next/link";
import { useState } from "react";
import { List, X } from "@phosphor-icons/react";
import { authClient } from "@/server/better-auth/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { navigation } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export const Navbar = () => {
  const { data: session } = authClient.useSession();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed inset-x-0 top-0 z-40 flex justify-center px-4 pt-4">
      <nav className="w-full max-w-3xl overflow-hidden rounded-2xl border border-zinc-200 bg-white/80 backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-900/80 dark:shadow-black/20">
        {/* ── desktop row ──────────────────────────────────────── */}
        <div className="relative flex items-center justify-between gap-4 px-4 py-2.5">
          {/* brand */}
          <Link href="/" className="text-primary text-xl font-semibold">
            Fin
          </Link>

          {/* nav links — desktop */}
          <div className="absolute top-1/2 left-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-1 md:flex">
            {navigation.map((nav) => (
              <Link
                key={nav.href}
                href={nav.href}
                className="rounded-lg px-3 py-1.5 text-sm text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
              >
                {nav.label}
              </Link>
            ))}
          </div>

          {/* right side */}
          <div className="flex items-center gap-2">
            {session ? (
              <Link
                href="/dashboard"
                className={cn(
                  buttonVariants({ variant: "gradient", size: "sm" }),
                  "flex items-center gap-2 rounded-xl",
                )}
              >
                <Avatar className="h-5 w-5">
                  <AvatarImage src={session.user?.image ?? ""} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-[9px] font-semibold">
                    {session.user?.name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                Dashboard
              </Link>
            ) : (
              <Link
                href="/auth"
                className={cn(
                  buttonVariants({ variant: "gradient", size: "sm" }),
                  "hidden rounded-xl md:inline-flex",
                )}
              >
                Sign in
              </Link>
            )}

            {/* hamburger — mobile only */}
            <button
              onClick={() => setIsOpen((o) => !o)}
              className="rounded-lg p-1.5 text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 md:hidden dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <List className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* ── mobile menu ───────────────────────────────────────── */}
        <div
          className={cn(
            "overflow-hidden border-t border-zinc-200 transition-all duration-300 ease-in-out md:hidden dark:border-zinc-800",
            isOpen
              ? "max-h-64 opacity-100"
              : "max-h-0 border-transparent opacity-0",
          )}
        >
          <div className="flex flex-col gap-1 p-3">
            {navigation.map((nav) => (
              <Link
                key={nav.href}
                href={nav.href}
                onClick={() => setIsOpen(false)}
                className="rounded-lg px-3 py-2 text-sm text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
              >
                {nav.label}
              </Link>
            ))}
            {!session && (
              <Link
                href="/auth"
                onClick={() => setIsOpen(false)}
                className="mt-1 rounded-lg border border-zinc-200 px-3 py-2 text-center text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-50 dark:hover:bg-zinc-800"
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};
