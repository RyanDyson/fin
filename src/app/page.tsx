import { HydrateClient } from "@/trpc/server";
import { Navbar } from "@/components/global/navbar";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MacbookScroll } from "@/components/ui/macbook-scroll";
import { authClient } from "@/server/better-auth/client";
import Preview from "@/../public/img/width_1600.png";

export default async function Home() {
  const { data: session } = await authClient.getSession();

  return (
    <HydrateClient>
      <div className="bg-background text-foreground flex min-h-screen flex-col">
        <Navbar />

        <main className="flex-1">
          {/* Hero Section */}
          <section className="from-primary/10 to-primary/20 relative overflow-hidden bg-linear-to-b px-4 pb-32">
            {/* Floaty emojis */}
            <div
              className="absolute top-32 left-[10%] z-10 hidden animate-bounce text-6xl drop-shadow-lg md:block lg:left-[15%]"
              style={{ animationDuration: "3s" }}
            >
              ✨
            </div>
            <div
              className="absolute top-64 right-[10%] z-10 hidden animate-bounce text-6xl drop-shadow-lg md:block lg:right-[15%]"
              style={{ animationDuration: "4s", animationDelay: "1s" }}
            >
              🚀
            </div>
            <div
              className="absolute top-1/3 left-[20%] z-10 hidden animate-bounce text-7xl drop-shadow-lg lg:block"
              style={{ animationDuration: "3.5s", animationDelay: "0.5s" }}
            >
              🧠
            </div>
            <div
              className="absolute top-48 right-[25%] z-10 hidden animate-bounce text-5xl drop-shadow-lg lg:block"
              style={{ animationDuration: "2.5s", animationDelay: "1.5s" }}
            >
              📚
            </div>

            <div className="relative z-20 mx-auto max-w-7xl text-center">
              <MacbookScroll
                title={
                  <div className="flex flex-col items-center justify-center gap-4">
                    <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
                      Transform your study materials into{" "}
                      <span className="from-primary to-primary/60 bg-linear-to-br bg-clip-text text-transparent">
                        interactive courses.
                      </span>
                    </h1>

                    <Button
                      className="rounded-full p-8 text-2xl font-bold"
                      variant="gradient"
                    >
                      {session ? "Go to Dashboard" : "Get Started"}
                    </Button>
                  </div>
                }
                src={Preview}
              />
            </div>
            <div className="to-background absolute right-0 bottom-0 h-96 w-full bg-linear-to-b from-transparent" />
          </section>

          {/* Features Section */}
          <section
            id="features"
            className="bg-background relative overflow-hidden py-24 sm:py-32"
          >
            <div className="from-primary/5 via-background to-background absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))]" />

            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <div className="mx-auto max-w-2xl text-center">
                <h2 className="text-primary text-base leading-7 font-semibold tracking-wide uppercase">
                  Study Smarter
                </h2>
                <p className="mt-2 text-3xl font-bold tracking-tight sm:text-5xl">
                  Everything you need to learn faster
                </p>
                <p className="text-muted-foreground mt-6 text-lg leading-8">
                  Stop passively reading textbooks. Engage with your material
                  through our AI-powered study platform.
                </p>
              </div>

              <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
                <div className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-8 lg:max-w-none lg:grid-cols-3">
                  {/* Feature 1 */}
                  <div className="group hover:shadow-primary/10 relative flex flex-col overflow-hidden rounded-3xl bg-zinc-50 p-8 ring-1 ring-zinc-200 transition-all hover:shadow-xl dark:bg-zinc-900/50 dark:ring-zinc-800">
                    <div className="bg-primary/10 group-hover:bg-primary/20 absolute -top-10 -right-10 z-0 h-40 w-40 rounded-full blur-3xl transition-all" />
                    <div className="from-primary to-primary/60 relative z-10 mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-lg">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="h-7 w-7"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
                        />
                      </svg>
                    </div>
                    <h3 className="relative z-10 text-xl font-bold tracking-tight">
                      Smart Uploads
                    </h3>
                    <p className="text-muted-foreground relative z-10 mt-4 text-base leading-7">
                      Just drop in your PDF, DOCX, or PPTX files. Fin extracts
                      the key concepts and builds a personalized curriculum
                      instantly.
                    </p>
                  </div>

                  {/* Feature 2 */}
                  <div className="group hover:shadow-primary/10 relative flex flex-col overflow-hidden rounded-3xl bg-zinc-50 p-8 ring-1 ring-zinc-200 transition-all hover:shadow-xl dark:bg-zinc-900/50 dark:ring-zinc-800">
                    <div className="bg-primary/10 group-hover:bg-primary/20 absolute -top-10 -right-10 z-0 h-40 w-40 rounded-full blur-3xl transition-all" />
                    <div className="from-primary to-primary/60 relative z-10 mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-lg">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="h-7 w-7"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <h3 className="relative z-10 text-xl font-bold tracking-tight">
                      Actionable Objectives
                    </h3>
                    <p className="text-muted-foreground relative z-10 mt-4 text-base leading-7">
                      Track your progress through automatically generated
                      learning objectives. Watch your completion rings fill up
                      as you master the material.
                    </p>
                  </div>

                  {/* Feature 3 */}
                  <div className="group hover:shadow-primary/10 relative flex flex-col overflow-hidden rounded-3xl bg-zinc-50 p-8 ring-1 ring-zinc-200 transition-all hover:shadow-xl dark:bg-zinc-900/50 dark:ring-zinc-800">
                    <div className="bg-primary/10 group-hover:bg-primary/20 absolute -top-10 -right-10 z-0 h-40 w-40 rounded-full blur-3xl transition-all" />
                    <div className="from-primary to-primary/60 relative z-10 mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-lg">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="h-7 w-7"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z"
                        />
                      </svg>
                    </div>
                    <h3 className="relative z-10 text-xl font-bold tracking-tight">
                      Brainrot Gamification
                    </h3>
                    <p className="text-muted-foreground relative z-10 mt-4 text-base leading-7">
                      Choose fun, engaging themes and game-like modes to keep
                      your attention dialed in. Studying doesn&apos;t have to be
                      boring anymore.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Pricing Section */}
          <section id="pricing" className="bg-background py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <div className="mx-auto max-w-2xl text-center">
                <h2 className="text-primary text-base leading-7 font-semibold tracking-wide uppercase">
                  Pricing
                </h2>
                <p className="mt-2 text-3xl font-bold tracking-tight sm:text-5xl">
                  Choose your brainrot level
                </p>
                <p className="text-muted-foreground mt-6 text-lg leading-8">
                  Start for free, upgrade when you need more power to ace those
                  exams.
                </p>
              </div>
              <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 items-center gap-y-6 sm:mt-20 sm:gap-y-0 lg:max-w-4xl lg:grid-cols-2 lg:gap-x-8">
                {/* Free Tier */}
                <div className="rounded-3xl rounded-t-3xl bg-zinc-50 p-8 ring-1 ring-zinc-200 sm:mx-8 sm:p-10 lg:mx-0 lg:rounded-tr-none lg:rounded-b-none lg:rounded-bl-3xl dark:bg-zinc-900/50 dark:ring-zinc-800">
                  <h3 className="text-primary text-base leading-7 font-semibold">
                    Casual Learner
                  </h3>
                  <p className="mt-4 flex items-baseline gap-x-2">
                    <span className="text-5xl font-bold tracking-tight">
                      $0
                    </span>
                    <span className="text-muted-foreground text-base">
                      /month
                    </span>
                  </p>
                  <p className="text-muted-foreground mt-6 text-base leading-7">
                    Perfect for trying out the platform.
                  </p>
                  <ul
                    role="list"
                    className="mt-8 space-y-3 text-sm leading-6 sm:mt-10"
                  >
                    <li className="flex gap-x-3">
                      <span className="text-primary">✓</span> 3 Document Uploads
                    </li>
                    <li className="flex gap-x-3">
                      <span className="text-primary">✓</span> Basic Quizzes
                    </li>
                    <li className="flex gap-x-3">
                      <span className="text-primary">✓</span> Standard Brainrot
                      Modes
                    </li>
                  </ul>
                  <Link href="/auth">
                    <Button
                      variant="outline"
                      className="mt-8 w-full rounded-full"
                    >
                      Get Started
                    </Button>
                  </Link>
                </div>
                {/* Pro Tier */}
                <div className="relative rounded-3xl bg-zinc-900 p-8 shadow-2xl ring-1 ring-zinc-900 sm:p-10 dark:bg-zinc-800/80 dark:ring-zinc-800">
                  <div className="from-primary to-primary/60 absolute -top-5 right-0 left-0 mx-auto w-32 rounded-full bg-gradient-to-r px-3 py-1 text-center text-sm font-semibold text-white shadow-sm">
                    Most Popular
                  </div>
                  <h3 className="text-base leading-7 font-semibold text-white">
                    Academic Weapon
                  </h3>
                  <p className="mt-4 flex items-baseline gap-x-2">
                    <span className="text-5xl font-bold tracking-tight text-white">
                      $10
                    </span>
                    <span className="text-base text-zinc-400">/month</span>
                  </p>
                  <p className="mt-6 text-base leading-7 text-zinc-300">
                    Everything you need to ace your exams.
                  </p>
                  <ul
                    role="list"
                    className="mt-8 space-y-3 text-sm leading-6 text-zinc-300 sm:mt-10"
                  >
                    <li className="flex gap-x-3">
                      <span className="text-primary">✓</span> Unlimited Document
                      Uploads
                    </li>
                    <li className="flex gap-x-3">
                      <span className="text-primary">✓</span> Advanced Learning
                      Objectives
                    </li>
                    <li className="flex gap-x-3">
                      <span className="text-primary">✓</span> Premium Brainrot
                      Gamification
                    </li>
                    <li className="flex gap-x-3">
                      <span className="text-primary">✓</span> Priority AI
                      Processing
                    </li>
                  </ul>
                  <Link href="/auth">
                    <Button
                      variant="gradient"
                      className="mt-8 w-full rounded-full"
                    >
                      Upgrade to Pro
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="border-border bg-background border-t py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="xl:grid xl:grid-cols-3 xl:gap-8">
              <div className="space-y-8">
                <span className="text-primary text-3xl font-bold tracking-tight">
                  Fin
                </span>
                <p className="text-muted-foreground text-sm leading-6">
                  Transform your study materials into interactive courses.
                  <br />
                  Learn faster, smarter, and have fun doing it.
                </p>
              </div>
              <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
                <div className="md:grid md:grid-cols-2 md:gap-8">
                  <div>
                    <h3 className="text-sm leading-6 font-semibold">Product</h3>
                    <ul role="list" className="mt-6 space-y-4">
                      <li>
                        <Link
                          href="#features"
                          className="text-muted-foreground hover:text-foreground text-sm leading-6 transition-colors"
                        >
                          Features
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/auth"
                          className="text-muted-foreground hover:text-foreground text-sm leading-6 transition-colors"
                        >
                          Get Started
                        </Link>
                      </li>
                    </ul>
                  </div>
                  <div className="mt-10 md:mt-0">
                    <h3 className="text-sm leading-6 font-semibold">Legal</h3>
                    <ul role="list" className="mt-6 space-y-4">
                      <li>
                        <Link
                          href="#"
                          className="text-muted-foreground hover:text-foreground text-sm leading-6 transition-colors"
                        >
                          Privacy Policy
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="#"
                          className="text-muted-foreground hover:text-foreground text-sm leading-6 transition-colors"
                        >
                          Terms of Service
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="md:grid md:grid-cols-2 md:gap-8">
                  <div>
                    <h3 className="text-sm leading-6 font-semibold">Connect</h3>
                    <ul role="list" className="mt-6 space-y-4">
                      <li>
                        <Link
                          href="#"
                          className="text-muted-foreground hover:text-foreground text-sm leading-6 transition-colors"
                        >
                          Twitter / X
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="#"
                          className="text-muted-foreground hover:text-foreground text-sm leading-6 transition-colors"
                        >
                          Discord
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="#"
                          className="text-muted-foreground hover:text-foreground text-sm leading-6 transition-colors"
                        >
                          Contact
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="border-border mt-16 border-t pt-8 sm:mt-20 lg:mt-24">
              <p className="text-muted-foreground text-xs leading-5">
                &copy; {new Date().getFullYear()} Fin. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </HydrateClient>
  );
}
