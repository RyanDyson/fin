"use client";

import { useMemo, useState } from "react";

import { AppNavbar } from "@/components/global/app-navbar";
import { CreateCourseDialog } from "@/components/global/create-course-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { authClient } from "@/server/better-auth/client";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";

type Course = {
  id: number;
  name: string;
  description: string;
  fileCount: number;
  brainrot: string;
  completedObjectives: number;
  totalObjectives: number;
  createdAt: Date;
};

type BrainrotOption = {
  id: number;
  name: string;
};

export default function Page() {
  const router = useRouter();
  const utils = api.useUtils();
  const { data: sessionData } = authClient.useSession();
  const isAuthenticated = Boolean(sessionData?.user?.id);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const {
    data: dbCourses,
    isLoading: isCoursesLoading,
    error: coursesError,
  } = api.get.getCourses.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const progressQueries = api.useQueries((t) =>
    isAuthenticated
      ? (dbCourses ?? []).map((course) =>
          t.get.getCourseProgress({ course_id: course.id }),
        )
      : [],
  );

  const { data: dbBrainrots } = api.get.getBrainrot.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const { mutateAsync: postCourse, isPending: isCreatingCourse } =
    api.post.postCourse.useMutation({
      onSuccess: async () => {
        await utils.get.getCourses.invalidate();
      },
    });

  const brainrotOptions = useMemo<BrainrotOption[]>(
    () =>
      (dbBrainrots ?? []).map((option) => ({
        id: option.id,
        name: option.name,
      })),
    [dbBrainrots],
  );

  const brainrotNameById = useMemo(
    () =>
      new Map(
        (dbBrainrots ?? []).map((option) => [String(option.id), option.name]),
      ),
    [dbBrainrots],
  );

  const progressByCourseId = useMemo(() => {
    return new Map(
      progressQueries
        .map((query) => query.data)
        .filter((data): data is NonNullable<typeof data> => Boolean(data))
        .map((data) => [
          data.courseId,
          {
            completedObjectives: data.completedObjectives,
            totalObjectives: data.totalObjectives,
          },
        ]),
    );
  }, [progressQueries]);

  const courses = useMemo<Course[]>(() => {
    return (dbCourses ?? []).map((course) => ({
      id: course.id,
      name: course.title,
      description: course.description ?? "",
      fileCount: 0,
      brainrot:
        brainrotNameById.get(String(course.brainrot)) ??
        `Brainrot ${course.brainrot}`,
      completedObjectives:
        progressByCourseId.get(course.id)?.completedObjectives ?? 0,
      totalObjectives: progressByCourseId.get(course.id)?.totalObjectives ?? 0,
      createdAt: course.createdAt ? new Date(course.createdAt) : new Date(),
    }));
  }, [brainrotNameById, dbCourses, progressByCourseId]);

  function getProgressPercent(course: Course) {
    if (course.totalObjectives <= 0) return 0;
    return Math.min(
      100,
      Math.round((course.completedObjectives / course.totalObjectives) * 100),
    );
  }

  function getProgressColor(progressPercent: number) {
    if (progressPercent < 40) return "#ef4444";
    if (progressPercent < 75) return "#f59e0b";
    return "#10b981";
  }

  return (
    <>
      <AppNavbar />
      <div className="relative h-full px-4 pt-16 pb-6">
        <section className="mx-auto flex w-full max-w-7xl flex-col gap-6">
          <header className="space-y-2">
            <h1 className="font-heading text-primary text-2xl font-semibold tracking-tight sm:text-3xl">
              Dashboard
            </h1>
          </header>

          {!isAuthenticated ? (
            <p className="text-muted-foreground text-sm">
              Please sign in to view your courses.
            </p>
          ) : isCoursesLoading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <Card
                  key={i}
                  className="from-primary/10 to-primary/20 border-primary/30 border bg-linear-to-b"
                >
                  <CardHeader className="flex items-center justify-between">
                    <div className="w-full space-y-2">
                      <Skeleton className="bg-primary/20 h-6 w-3/4" />
                      <Skeleton className="bg-primary/20 h-4 w-full" />
                      <Skeleton className="bg-primary/20 h-4 w-5/6" />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Skeleton className="bg-primary/20 h-3 w-12" />
                      <Skeleton className="bg-primary/20 h-3 w-20" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : coursesError ? (
            <p className="text-destructive text-sm">Could not load courses.</p>
          ) : courses.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              No courses found yet. Create one to get started.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {courses.map((course) => (
                <Card
                  key={course.id}
                  className="from-primary/10 to-primary/20 border-primary/30 cursor-pointer border bg-linear-to-b"
                  onClick={() => router.push(`/dashboard/${course.id}`)}
                >
                  <CardHeader className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-primary">{course.name}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {course.description}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="size-12 shrink-0">
                        <CircularProgressbar
                          value={getProgressPercent(course)}
                          text={`${getProgressPercent(course)}%`}
                          styles={buildStyles({
                            textSize: "28px",
                            pathColor: getProgressColor(
                              getProgressPercent(course),
                            ),
                            textColor: "hsl(var(--foreground))",
                            trailColor: "hsl(var(--secondary))",
                          })}
                        />
                      </div>
                      <p className="text-muted-foreground text-sm font-medium">
                        {course.completedObjectives}/{course.totalObjectives}{" "}
                        objectives
                      </p>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <span className="text-muted-foreground block text-xs">
                          {course.fileCount} file{course.fileCount === 1 ? "" : "s"}
                        </span>
                      </div>
                      <span className="text-muted-foreground text-xs">
                        {course.createdAt.toLocaleDateString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        <Button
          size="icon-lg"
          variant="gradient"
          className="fixed right-6 bottom-6 z-30 rounded-full shadow-lg"
          onClick={() => setIsCreateOpen(true)}
          aria-label="Add new course"
        >
          <span className="text-xl leading-none">+</span>
        </Button>

        <CreateCourseDialog
          isOpen={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
          onCreate={async (data) => {
            await postCourse({
              title: data.name,
              description: data.description,
              brainrot_id: data.brainrotId,
            });

            //get objectives

            setIsCreateOpen(false);
          }}
          isCreating={isCreatingCourse}
          brainrotOptions={brainrotOptions}
        />
      </div>
    </>
  );
}
