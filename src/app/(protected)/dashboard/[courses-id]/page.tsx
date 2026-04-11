"use client";

import { use, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/global/navbar";
import { CourseFileUpload } from "@/components/global/course-file-upload";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check, Square } from "lucide-react";
import { api } from "@/trpc/react";

type CoursePageProps = {
  params: Promise<{
    "courses-id": string;
  }>;
};

export default function Page({ params }: CoursePageProps) {
  const routeParams = use(params);
  const router = useRouter();
  const utils = api.useUtils();

  const courseId = Number(routeParams["courses-id"]);
  const isValidCourseId = Number.isInteger(courseId) && courseId > 0;
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [isUploadingFiles, setIsUploadingFiles] = useState(false);

  const {
    data: course,
    isLoading: isCourseLoading,
    error: courseError,
  } = api.get.getCourseById.useQuery({
    course_id: courseId,
  });

  const { data: activeChat } = api.get.getChats.useQuery(
    { courseId },
    { enabled: isValidCourseId },
  );

  const { data: chatHistory } = api.get.getChats.useQuery(
    { courseId },
    { enabled: isValidCourseId },
  );

  const { data: objectives, isLoading: isObjectivesLoading } =
    api.get.getDoneObjectives.useQuery(
      { course_id: courseId },
      { enabled: isValidCourseId },
    );

  // We don't have a course files endpoint currently, mocking it for now
  const courseFiles: File[] = [];

  const { mutateAsync: startSession, isPending: isStartingSession } =
    api.post.postSession.useMutation({
      onSuccess: async () => {
        await Promise.all([utils.get.getChats.invalidate({ courseId })]);
      },
    });

  // Upload file mock until API is implemented
  const uploadCourseFile = async (data: File) => {
    return data;
  };

  const completedObjectiveIds = useMemo(() => {
    const ids = new Set<number>();
    for (const chat of activeChat ?? []) {
      if (chat.completedObjectives) {
        ids.add(chat.completedObjectives);
      }
    }
    for (const chat of chatHistory ?? []) {
      if (chat.completedObjectives) {
        ids.add(chat.completedObjectives);
      }
    }
    return ids;
  }, [activeChat, chatHistory]);

  const objectiveStats = useMemo(() => {
    const total = objectives?.length ?? 0;
    const completed = (objectives ?? []).filter((objective) =>
      completedObjectiveIds.has(objective.id),
    ).length;
    const percentage =
      total === 0 ? 0 : Math.min(100, Math.round((completed / total) * 100));

    return { total, completed, percentage };
  }, [completedObjectiveIds, objectives]);

  const allManagedSelected =
    (courseFiles?.length ?? 0) > 0 &&
    selectedFiles.length === (courseFiles?.length ?? 0);

  async function handleStartSession() {
    if (!isValidCourseId) return;

    const newChat = await startSession({
      courseId,
      completedObjectiveId: 1, // Mock objective ID to start
    });

    router.push(`/dashboard/${courseId}/${newChat.id}`);
  }

  async function handleUploadToManager() {
    if (pendingFiles.length === 0) return;

    setIsUploadingFiles(true);
    try {
      for (const file of pendingFiles) {
        const encodedName = encodeURIComponent(file.name);
        const pseudoUrl = `https://uploaded.local/course-${courseId}/${encodedName}`;

        await uploadCourseFile({
          // course_id: courseId,
          file_url: pseudoUrl,
        });
      }

      setPendingFiles([]);
    } finally {
      setIsUploadingFiles(false);
    }
  }

  function getFileKey(fileId: number) {
    return String(fileId);
  }

  function toggleFileSelection(fileKey: string) {
    setSelectedFiles((current) =>
      current.includes(fileKey)
        ? current.filter((selected) => selected !== fileKey)
        : [...current, fileKey],
    );
  }

  function toggleSelectAll() {
    if (allManagedSelected) {
      setSelectedFiles([]);
      return;
    }

    setSelectedFiles((courseFiles ?? []).map((file) => getFileKey(file.id)));
  }

  function deleteSelectedFiles() {
    // Deletion API is not implemented yet; keep selection-only behavior for now.
    setSelectedFiles([]);
  }

  if (!isValidCourseId) {
    return (
      <div className="px-4 pt-24 sm:px-6 lg:px-8">
        <Navbar />
        <p className="text-destructive text-sm">Invalid course id.</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-[calc(100vh-8rem)] px-4 pt-24 pb-6 sm:px-6 sm:pt-28 lg:px-8">
      <Navbar />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,var(--color-primary)/12,transparent_38%),radial-gradient(circle_at_bottom_left,var(--color-chart-1)/18,transparent_32%)]" />

      <section className="mx-auto grid w-full max-w-7xl gap-4 lg:grid-cols-[340px_1fr]">
        <Card className="border-border/60 bg-card/95 h-fit">
          <CardHeader>
            <CardTitle>
              {isCourseLoading ? "Loading..." : course?.title}
            </CardTitle>
            <CardDescription>
              {courseError ? (
                <p className="text-destructive text-xs">
                  Could not load this course.
                </p>
              ) : (
                <p className="text-muted-foreground text-xs">
                  {course?.description}
                </p>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              {/* <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">
                  {objectiveStats.completed}/{objectiveStats.total}
                </span>
              </div> */}
              <div className="bg-muted h-2 w-full overflow-hidden rounded-full">
                <div
                  className="bg-primary h-full rounded-full transition-all"
                  style={{ width: `${objectiveStats.percentage}%` }}
                />
              </div>
              <p className="text-muted-foreground text-xs">
                {objectiveStats.percentage}% complete
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">Objectives</p>
              {isObjectivesLoading ? (
                <p className="text-muted-foreground text-xs">
                  Loading objectives...
                </p>
              ) : (objectives?.length ?? 0) === 0 ? (
                <p className="text-muted-foreground text-xs">
                  No objectives yet. They will appear after generation.
                </p>
              ) : (
                <div className="space-y-2">
                  {(objectives ?? []).map((objective) => {
                    const isCompleted = completedObjectiveIds.has(objective.id);
                    return (
                      <div
                        key={objective.id}
                        className="bg-muted/50 flex items-start gap-2 rounded-md p-2"
                      >
                        <span className="pt-0.5">
                          {isCompleted ? (
                            <Check className="text-primary h-4 w-4" />
                          ) : (
                            <Square className="text-muted-foreground h-4 w-4" />
                          )}
                        </span>
                        <p className="text-sm leading-snug">
                          {objective.content}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4">
          <Card className="border-border/60 bg-card/95">
            <CardHeader>
              <CardTitle>File Upload</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <CourseFileUpload
                files={pendingFiles}
                onFilesChange={setPendingFiles}
                maxFiles={10}
                maxSize={10 * 1024 * 1024}
                helperText="Or click to browse (max 10 files, up to 10MB each)"
              />

              <div className="flex justify-end">
                <Button
                  onClick={handleUploadToManager}
                  disabled={pendingFiles.length === 0 || isUploadingFiles}
                >
                  {isUploadingFiles ? "Uploading..." : "Upload"}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/60 bg-card/95">
            <CardHeader>
              <CardTitle>File Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={toggleSelectAll}>
                  {allManagedSelected ? "Unselect all" : "Select all"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={deleteSelectedFiles}
                  disabled={selectedFiles.length === 0}
                >
                  Delete selected ({selectedFiles.length})
                </Button>
              </div>

              {(courseFiles?.length ?? 0) === 0 ? (
                <p className="text-muted-foreground text-sm">
                  No managed files yet. Upload files first.
                </p>
              ) : (
                <div className="space-y-2">
                  {(courseFiles ?? []).map((file) => {
                    const fileKey = getFileKey(file.id);
                    const isSelected = selectedFiles.includes(fileKey);
                    const fileName = decodeURIComponent(
                      file.file_url.split("/").pop() ?? `file-${file.id}`,
                    );

                    return (
                      <button
                        key={fileKey}
                        type="button"
                        onClick={() => toggleFileSelection(fileKey)}
                        className={`w-full rounded-md border p-3 text-left transition ${
                          isSelected
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/40"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium">
                              {fileName}
                            </p>
                            <p className="text-muted-foreground text-xs">
                              {file.file_url}
                            </p>
                          </div>
                          <span className="text-xs font-medium">
                            {isSelected ? "Selected" : "Select"}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </CardContent>
            <CardFooter className="justify-end">
              <Button
                onClick={handleStartSession}
                disabled={Boolean(activeChat?.length) || isStartingSession}
              >
                {activeChat?.length
                  ? `Continue Session`
                  : isStartingSession
                    ? "Starting session..."
                    : "Start Session"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>
    </div>
  );
}
