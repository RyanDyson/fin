"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Navbar } from "@/components/global/navbar";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";

type Course = {
  id: string;
  name: string;
  description: string;
  fileCount: number;
  brainrot: string;
  completedObjectives: number;
  totalObjectives: number;
  createdAt: Date;
};

type CourseDraft = {
  name: string;
  description: string;
  files: File[];
};

const brainrotOptions = [
  {
    id: "skibidi-scholar",
    name: "Skibidi Scholar",
    // vibe: "Asks chaotic but surprisingly smart follow-ups.",
  },
  {
    id: "sigma-tutor",
    name: "Sigma Tutor",
    // vibe: "Calm, direct, and focused on precision.",
  },
  {
    id: "rizz-analyst",
    name: "Rizz Analyst",
    // vibe: "Turns dry explanations into confident takes.",
  },
  {
    id: "delulu-debater",
    name: "Delulu Debater",
    // vibe: "Challenges logic with wild what-if scenarios.",
  },
  {
    id: "npc-challenger",
    name: "NPC Challenger",
    // vibe: "Plays naive to expose weak explanations.",
  },
] as const;

export default function Page() {
  const router = useRouter();
  const [localCourses, setLocalCourses] = useState<Course[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isBrainrotOpen, setIsBrainrotOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [selectedBrainrot, setSelectedBrainrot] = useState<string>(
    brainrotOptions[0].id,
  );
  const [draftCourse, setDraftCourse] = useState<CourseDraft | null>(null);
  const {
    data: dbCourses,
    isLoading: isCoursesLoading,
    error: coursesError,
  } = api.course.list.useQuery();

  const selectedBrainrotOption = useMemo(
    () =>
      brainrotOptions.find((option) => option.id === selectedBrainrot) ??
      brainrotOptions[0],
    [selectedBrainrot],
  );

  const canCreate = useMemo(
    () => name.trim().length > 0 && description.trim().length > 0,
    [name, description],
  );

  function handleCreateCourse() {
    if (!canCreate) return;

    setDraftCourse({
      name: name.trim(),
      description: description.trim(),
      files,
    });
    setIsCreateOpen(false);
    setIsBrainrotOpen(true);
  }

  function handleConfirmBrainrot() {
    if (!draftCourse) return;

    setLocalCourses((current) => [
      {
        id: crypto.randomUUID(),
        name: draftCourse.name,
        description: draftCourse.description,
        fileCount: draftCourse.files.length,
        brainrot: selectedBrainrotOption.name,
        completedObjectives: 0,
        totalObjectives: 10,
        createdAt: new Date(),
      },
      ...current,
    ]);

    setName("");
    setDescription("");
    setFiles([]);
    setDraftCourse(null);
    setIsBrainrotOpen(false);
  }

  const courses = useMemo<Course[]>(() => {
    const fetchedCourses: Course[] = (dbCourses ?? []).map((course) => ({
      id: course.id,
      name: course.title,
      description: course.description,
      fileCount: course.fileCount,
      brainrot: "Sigma Tutor",
      completedObjectives: course.completedObjectives,
      totalObjectives: course.totalObjectives,
      createdAt: course.createdAt ? new Date(course.createdAt) : new Date(),
    }));

    return [...localCourses, ...fetchedCourses];
  }, [dbCourses, localCourses]);

  function getProgressPercent(course: Course) {
    if (course.totalObjectives <= 0) return 0;
    return Math.min(
      100,
      Math.round((course.completedObjectives / course.totalObjectives) * 100),
    );
  }

  function getProgressColor(progressPercent: number) {
    if (progressPercent < 40) return "bg-red-500";
    if (progressPercent < 75) return "bg-amber-500";
    return "bg-emerald-500";
  }

  return (
    <div className="relative min-h-[calc(100vh-8rem)] px-4 pt-28 pb-6 sm:px-6 sm:pt-32 lg:px-8">
      <Navbar />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,var(--color-primary)/12,transparent_38%),radial-gradient(circle_at_bottom_left,var(--color-chart-1)/18,transparent_32%)]" />

      <section className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <header className="space-y-2">
          <h1 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
            Dashboard
          </h1>
        </header>

        {isCoursesLoading ? (
          <p className="text-muted-foreground text-sm">Loading courses...</p>
        ) : coursesError ? (
          <p className="text-destructive text-sm">
            Could not load courses.
          </p>
        ) : courses.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            No courses found yet. Create one to get started.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {courses.map((course) => (
              <Card key={course.id} className="border-border/60 bg-card/95">
                <CardHeader>
                  <CardTitle>{course.name}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {course.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-3">
                  <div className="space-y-1.5">
                    <p className="text-muted-foreground text-xs">
                      {course.completedObjectives}/{course.totalObjectives}{" "}
                      objectives
                    </p>
                    <div className="bg-muted h-1.5 w-full overflow-hidden rounded-full">
                      <div
                        className={`h-full rounded-full transition-all ${getProgressColor(getProgressPercent(course))}`}
                        style={{ width: `${getProgressPercent(course)}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <span className="text-muted-foreground block text-xs">
                        {course.fileCount} file
                        {course.fileCount === 1 ? "" : "s"}
                      </span>
                    </div>
                    <span className="text-muted-foreground text-xs">
                      {course.createdAt.toLocaleDateString()}
                    </span>
                  </div>
                </CardContent>

                <CardFooter>
                  <Button variant="outline" className="w-full" onClick={() => router.push(`/dashboard/${course.id}`)}>
                    Open course
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </section>

      <Button
        size="icon-lg"
        className="fixed right-6 bottom-6 z-30 rounded-full shadow-lg"
        onClick={() => setIsCreateOpen(true)}
        aria-label="Add new course"
      >
        <span className="text-xl leading-none">+</span>
      </Button>

      {isCreateOpen ? (
        <div
          className="fixed inset-0 z-40 flex items-end bg-black/45 p-4 backdrop-blur-[2px] sm:items-center sm:justify-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="create-course-title"
        >
          <Card className="border-border/60 w-full max-w-xl gap-4">
            <CardHeader>
              <CardTitle id="create-course-title">Create New Course</CardTitle>
              <CardDescription>
                Add course details and optional PDF material files.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="course-name">Course name</Label>
                <Input
                  id="course-name"
                  placeholder="e.g. Linear Algebra II"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="course-description">Description</Label>
                <Textarea
                  id="course-description"
                  placeholder="Add description"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="course-files">Course materials (PDF)</Label>
                <Input
                  id="course-files"
                  type="file"
                  accept="application/pdf"
                  multiple
                  onChange={(event) =>
                    setFiles(Array.from(event.target.files ?? []))
                  }
                />
                {files.length > 0 ? (
                  <p className="text-muted-foreground text-xs">
                    {files.length} file{files.length === 1 ? "" : "s"} selected
                  </p>
                ) : null}
              </div>
            </CardContent>

            <CardFooter className="justify-end gap-2">
              <Button variant="ghost" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateCourse} disabled={!canCreate}>
                Next Step
              </Button>
            </CardFooter>
          </Card>
        </div>
      ) : null}

      {isBrainrotOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-end bg-black/45 p-4 backdrop-blur-[2px] sm:items-center sm:justify-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="choose-brainrot-title"
        >
          <Card className="border-border/60 w-full max-w-xl gap-4">
            <CardHeader>
              <CardTitle id="choose-brainrot-title">
                Choose your brainrot
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="p-4">
                <div className="mt-2 flex flex-col items-center gap-3 text-center">
                  <div className="bg-muted text-muted-foreground flex aspect-square items-center justify-center rounded-full border text-[10px] font-medium tracking-wide uppercase">
                    placeholder
                  </div>
                  <div>
                    <p className="text-sm font-semibold">
                      {selectedBrainrotOption.name}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {brainrotOptions.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    aria-pressed={selectedBrainrot === option.id}
                    onClick={() => setSelectedBrainrot(option.id)}
                    className={`rounded-lg border p-3 text-left transition ${
                      selectedBrainrot === option.id
                        ? "border-primary ring-primary/30 bg-primary/5 ring-2"
                        : "hover:border-primary/40 border-border"
                    }`}
                  >
                    <div className="bg-muted text-muted-foreground mx-auto flex aspect-square w-20 items-center justify-center rounded-full border text-[10px] font-medium tracking-wide uppercase">
                      placeholder
                    </div>
                    <p className="mt-3 text-sm font-semibold">{option.name}</p>
                  </button>
                ))}
              </div>
            </CardContent>

            <CardFooter className="justify-end gap-2">
              <Button
                variant="ghost"
                onClick={() => {
                  setIsBrainrotOpen(false);
                  setIsCreateOpen(true);
                }}
              >
                Back
              </Button>
              <Button onClick={handleConfirmBrainrot}>Create course</Button>
            </CardFooter>
          </Card>
        </div>
      ) : null}
    </div>
  );
}
