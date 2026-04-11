"use client";
import React from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CaretDownIcon, SignOutIcon, UserIcon } from "@phosphor-icons/react";
import { authClient } from "@/server/better-auth/client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface BreadcrumbSegment {
  label: string;
  href: string;
  isLast: boolean;
}

const BreadCrumbGenerator = (pathname: string): BreadcrumbSegment[] => {
  if (pathname === "/") {
    return [{ label: "Home", href: "/", isLast: true }];
  }

  const segments = pathname.split("/").filter(Boolean);
  const isDashboard = segments[0] === "dashboard";
  const rootHref = isDashboard ? "/dashboard" : "/";

  const breadcrumbs: BreadcrumbSegment[] = [
    {
      label: isDashboard ? "Dashboard" : (segments[0] ?? "Dashboard"),
      href: rootHref,
      isLast: segments.length <= 1,
    },
  ];

  const startIndex = isDashboard ? 1 : 0;
  for (let i = startIndex; i < segments.length; i++) {
    const segment = segments[i];
    if (!segment) continue;

    const href = "/" + segments.slice(0, i + 1).join("/");
    const isLast = i === segments.length - 1;

    if (segment === "room" && i + 1 < segments.length) {
      const slug = segments[i + 1];
      if (!slug) continue;

      const combinedHref = "/" + segments.slice(0, i + 2).join("/");
      const combinedIsLast = i + 1 === segments.length - 1;

      const formattedSlug = slug
        .replace(/[-_]/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());

      breadcrumbs.push({
        label: `Room - ${formattedSlug}`,
        href: combinedHref,
        isLast: combinedIsLast,
      });

      i++;
    } else {
      const label = segment
        .replace(/[-_]/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());

      breadcrumbs.push({
        label,
        href,
        isLast,
      });
    }
  }

  return breadcrumbs;
};

export function AppNavbar() {
  const pathname = usePathname();
  const breadcrumbs = BreadCrumbGenerator(pathname);
  const { data: session } = authClient.useSession();

  return (
    <header className="from-primary/10 to-primary/20 border-primary/30 sticky top-0 z-40 w-full border-b bg-linear-to-b backdrop-blur-xl">
      <div className="relative container mx-auto flex h-16 max-w-7xl items-center justify-between">
        {/* Left Side - Logo & Links */}
        <div className="flex items-center gap-8">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 font-bold tracking-tight"
          >
            <span className="text-primary hidden sm:inline-block">Fin</span>
          </Link>
        </div>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbs.map((breadcrumb, index) => (
                <React.Fragment key={index}>
                  <BreadcrumbItem>
                    {breadcrumb.isLast ? (
                      <BreadcrumbPage className="hover: text-primary font-medium">
                        {breadcrumb.label}
                      </BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink
                        href={breadcrumb.href}
                        className="text-primary hover:text-primary/80 font-medium hover:underline"
                      >
                        {breadcrumb.label}
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                  {!breadcrumb.isLast && (
                    <BreadcrumbSeparator className="text-primary" />
                  )}
                </React.Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        {/* Right Side - Actions & Profile */}
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button
                variant="gradient"
                className="hover:bg-secondary/50 flex h-9 items-center gap-2 rounded-full pr-2 pl-1"
              >
                <Avatar className="size-7">
                  <AvatarImage src={session?.user?.image ?? ""} />
                  <AvatarFallback className="bg-primary/10 text-primary text-xs">
                    {session?.user?.name?.charAt(0).toUpperCase() ?? "U"}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden text-sm font-medium sm:inline-block">
                  {session?.user?.name?.split(" ")[0] ?? "User"}
                </span>
                <CaretDownIcon className="text-primary size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 rounded-xl">
              <DropdownMenuGroup>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm leading-none font-medium">
                      {session?.user?.name ?? "User"}
                    </p>
                    <p className="text-muted-foreground text-xs leading-none">
                      {session?.user?.email ?? "user@example.com"}
                    </p>
                  </div>
                </DropdownMenuLabel>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer gap-2">
                <UserIcon className="size-4" />
                Profile Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer gap-2"
                onClick={async () => {
                  await authClient.signOut();
                  window.location.href = "/auth";
                }}
              >
                <SignOutIcon className="size-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
