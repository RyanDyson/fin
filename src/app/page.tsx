import { HydrateClient } from "@/trpc/server";
import { Navbar } from "@/components/global/navbar";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function Home() {
  return (
    <HydrateClient>
      <div className="bg-background text-foreground flex min-h-screen flex-col">
        <Navbar />

        <main className="flex-1">
          {/* Hero Section */}
          <section className="relative overflow-hidden px-4 pt-48 pb-32 sm:pt-32 sm:pb-40 lg:pb-48">
            <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
              <div
                className="from-primary to-primary/20 relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
                style={{
                  clipPath:
                    "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
                }}
              />
            </div>

            <div className="mx-auto max-w-7xl text-center">
              <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
                Transform your study materials into{" "}
                <span className="from-primary to-primary/60 bg-gradient-to-r bg-clip-text text-transparent">
                  interactive courses.
                </span>
              </h1>
              <p className="text-muted-foreground mx-auto mt-6 max-w-2xl text-lg leading-8">
                Upload your PDFs, documents, and slides. Fin automatically
                generates tailored learning objectives, quizzes, and gamified
                &rdquo;brainrot&ldquo; experiences to help you ace your exams
                faster.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Link href="/auth">
                  <Button size="lg" className="rounded-full px-8 font-semibold">
                    Get Started
                  </Button>
                </Link>
                <Link href="#features">
                  <Button
                    variant="ghost"
                    size="lg"
                    className="rounded-full px-8 font-semibold"
                  >
                    Learn more <span aria-hidden="true">→</span>
                  </Button>
                </Link>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section id="features" className="bg-muted/30 py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <div className="mx-auto max-w-2xl text-center">
                <h2 className="text-primary text-base leading-7 font-semibold">
                  Study Smarter
                </h2>
                <p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                  Everything you need to learn faster
                </p>
                <p className="text-muted-foreground mt-6 text-lg leading-8">
                  Stop passively reading textbooks. Engage with your material
                  through our AI-powered study platform.
                </p>
              </div>

              <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
                <div className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
                  {/* Feature 1 */}
                  <div className="border-border bg-background flex flex-col rounded-2xl border p-8 shadow-sm transition-all hover:shadow-md">
                    <div className="bg-primary/10 text-primary mb-4 flex h-12 w-12 items-center justify-center rounded-xl">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="h-6 w-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg leading-8 font-semibold">
                      Smart Uploads
                    </h3>
                    <p className="text-muted-foreground mt-4 flex-auto text-base leading-7">
                      Just drop in your PDF, DOCX, or PPTX files. Fin extracts
                      the key concepts and builds a personalized curriculum
                      instantly.
                    </p>
                  </div>

                  {/* Feature 2 */}
                  <div className="border-border bg-background flex flex-col rounded-2xl border p-8 shadow-sm transition-all hover:shadow-md">
                    <div className="bg-primary/10 text-primary mb-4 flex h-12 w-12 items-center justify-center rounded-xl">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="h-6 w-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg leading-8 font-semibold">
                      Actionable Objectives
                    </h3>
                    <p className="text-muted-foreground mt-4 flex-auto text-base leading-7">
                      Track your progress through automatically generated
                      learning objectives. Watch your completion rings fill up
                      as you master the material.
                    </p>
                  </div>

                  {/* Feature 3 */}
                  <div className="border-border bg-background flex flex-col rounded-2xl border p-8 shadow-sm transition-all hover:shadow-md">
                    <div className="bg-primary/10 text-primary mb-4 flex h-12 w-12 items-center justify-center rounded-xl">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="h-6 w-6"
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
                    <h3 className="text-lg leading-8 font-semibold">
                      Brainrot Gamification
                    </h3>
                    <p className="text-muted-foreground mt-4 flex-auto text-base leading-7">
                      Choose fun, engaging themes and game-like modes to keep
                      your attention dialed in. Studying doesn&apos;t have to be
                      boring anymore.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="border-border border-t py-10 text-center">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} Fin. All rights reserved.
          </p>
        </footer>
      </div>
    </HydrateClient>
  );
}
