"use client";

import { useEffect, useMemo, useState } from "react";
import { use } from "react";

import { AppNavbar } from "@/components/global/app-navbar";
import { UploadDialog } from "@/components/global/upload-dialog";
import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChatTeardropTextIcon,
  CheckCircleIcon,
  CircleIcon,
  FileArrowUpIcon,
  FileIcon,
  PlusIcon,
  TargetIcon,
} from "@phosphor-icons/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Objective = {
  id: number;
  content: string;
  completed: boolean;
};

type ChatHistoryItem = {
  id: number;
  title: string;
  date: string | null;
  lastMessage: string | null;
  active: boolean;
};

export default function CourseDashboardPage({
  params,
}: {
  params: Promise<{ "courses-id": string }>;
}) {
  const routeParams = use(params);
  const router = useRouter();
  const courseId = Number(routeParams["courses-id"]);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [localCompletedObjectiveIds, setLocalCompletedObjectiveIds] = useState<
    Set<number>
  >(new Set());
  const [settingTopicObjectiveId, setSettingTopicObjectiveId] = useState<
    number | null
  >(null);
  const completedStorageKey = `completedObjectives:${courseId}`;
  const selectedStorageKey = `selectedObjective:${courseId}`;

  const courseQuery = api.get.getCourseById.useQuery(
    { course_id: courseId },
    { enabled: Number.isFinite(courseId) },
  );

  const objectivesQuery = api.get.getCourseObjectives.useQuery(
    { course_id: courseId },
    { enabled: Number.isFinite(courseId) },
  );

  const progressQuery = api.get.getCourseProgress.useQuery(
    { course_id: courseId },
    { enabled: Number.isFinite(courseId) },
  );

  const chatsQuery = api.get.getChats.useQuery(
    { courseId },
    { enabled: Number.isFinite(courseId) },
  );

  const createSessionMutation = api.post.postSession.useMutation();

  useEffect(() => {
    if (!Number.isFinite(courseId) || typeof window === "undefined") {
      return;
    }

    const readLocalCompletion = () => {
      const rawCompleted = window.localStorage.getItem(completedStorageKey);
      if (!rawCompleted) {
        setLocalCompletedObjectiveIds(new Set());
        return;
      }

      try {
        const parsed = JSON.parse(rawCompleted) as unknown;
        const ids = Array.isArray(parsed)
          ? parsed.filter((value): value is number => Number.isInteger(value))
          : [];
        setLocalCompletedObjectiveIds(new Set(ids));
      } catch {
        setLocalCompletedObjectiveIds(new Set());
      }
    };

    const handleCompletedUpdate = (event: Event) => {
      const customEvent = event as CustomEvent<{ courseId?: number }>;
      if (customEvent.detail?.courseId === courseId) {
        readLocalCompletion();
      }
    };

    readLocalCompletion();
    window.addEventListener("objective-completed", handleCompletedUpdate);
    window.addEventListener("storage", readLocalCompletion);

    return () => {
      window.removeEventListener("objective-completed", handleCompletedUpdate);
      window.removeEventListener("storage", readLocalCompletion);
    };
  }, [completedStorageKey, courseId]);

  const objectives = useMemo<Objective[]>(() => {
    const completedIds = new Set(
      (objectivesQuery.data ?? [])
        .filter((objective) => objective.isDone)
        .map((objective) => objective.id),
    );

    return (objectivesQuery.data ?? []).map((objective) => ({
      id: objective.id,
      content: objective.content,
      completed:
        completedIds.has(objective.id) ||
        localCompletedObjectiveIds.has(objective.id),
    }));
  }, [localCompletedObjectiveIds, objectivesQuery.data]);

  const chats = useMemo<ChatHistoryItem[]>(() => {
    return (chatsQuery.data ?? []).map((chat) => ({
      id: chat.id,
      title: chat.title,
      date: chat.date ? new Date(chat.date).toLocaleDateString() : null,
      lastMessage: chat.lastMessage,
      active: chat.active,
    }));
  }, [chatsQuery.data]);

  async function handleObjectiveClick(objectiveContent: string, objectiveId: number) {
    if (!Number.isFinite(courseId) || settingTopicObjectiveId === objectiveId) {
      return;
    }

    try {
      setSettingTopicObjectiveId(objectiveId);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(selectedStorageKey, String(objectiveId));
      }

      const response = await fetch(
        `http://localhost:8000/message/explain/set-topic/${courseId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ message: objectiveContent }),
        },
      );

      if (!response.ok) {
        throw new Error(`Failed to set topic: ${response.status}`);
      }

      const session = await createSessionMutation.mutateAsync({
        courseId,
        completedObjectiveId: objectiveId,
        active: true,
      });

      router.push(`/dashboard/${courseId}/${session.id}`);
    } finally {
      setSettingTopicObjectiveId(null);
    }
  }

  return (
    <>
      <AppNavbar />
      <UploadDialog
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUpload={(files) => {
          console.log(files);
        }}
      />
      <div className="container mx-auto max-w-7xl space-y-8 py-8">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-primary text-3xl font-bold tracking-tight">
              {courseQuery.data?.title ?? "Course"}
            </h1>
            <p className="text-muted-foreground mt-1 text-lg">
              {courseQuery.data?.description ??
                "Master the fundamental principles of classical mechanics."}
            </p>
          </div>
          <Link href={`/dashboard/${courseId}/new-chat`}>
            <Button size="lg" variant="gradient">
              <PlusIcon weight="bold" className="mr-2 size-5" />
              Start New Chat
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            <Card>
              <CardHeader className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <TargetIcon className="text-primary size-5" />
                    Learning Objectives
                  </CardTitle>
                  <CardDescription>
                    Goals set by the AI for this topic.
                  </CardDescription>
                </div>
                <Button variant="gradient" size="sm">
                  Edit Goals
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">Status</TableHead>
                      <TableHead>Objective</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {objectives.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={2} className="text-muted-foreground">
                          No objectives have been generated yet.
                        </TableCell>
                      </TableRow>
                    ) : (
                      objectives.map((objective) => (
                        <TableRow
                          key={objective.id}
                          className="cursor-pointer transition-colors hover:bg-muted/50"
                          onClick={() =>
                            void handleObjectiveClick(
                              objective.content,
                              objective.id,
                            )
                          }
                        >
                          <TableCell>
                            {objective.completed ? (
                              <CheckCircleIcon
                                weight="fill"
                                className="size-5 text-green-500"
                              />
                            ) : (
                              <CircleIcon className="text-muted-foreground size-5" />
                            )}
                          </TableCell>
                          <TableCell
                            className={
                              objective.completed
                                ? "text-muted-foreground line-through"
                                : "text-foreground font-medium"
                            }
                          >
                            <div className="flex items-center justify-between gap-3">
                              <span>{objective.content}</span>
                              {settingTopicObjectiveId === objective.id ? (
                                <span className="text-muted-foreground text-xs">
                                  Setting topic...
                                </span>
                              ) : null}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
                {(() => {
                  const localCompletedCount = objectives.filter(
                    (objective) => objective.completed,
                  ).length;
                  const completedCount = Math.max(
                    progressQuery.data?.completedObjectives ?? 0,
                    localCompletedCount,
                  );
                  const totalCount =
                    progressQuery.data?.totalObjectives ?? objectives.length;

                  return (
                  <p className="text-muted-foreground mt-4 text-sm">
                    Progress: {completedCount}/{totalCount}
                  </p>
                  );
                })()}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <FileIcon className="text-primary size-5" />
                    Course Materials
                  </CardTitle>
                  <CardDescription>
                    Reference files used to generate the curriculum.
                  </CardDescription>
                </div>
                <Button
                  variant="gradient"
                  size="sm"
                  onClick={() => setIsUploadOpen(true)}
                >
                  <FileArrowUpIcon className="mr-2 size-4" />
                  Upload File
                </Button>
              </CardHeader>
              <CardContent>
                <div className="text-muted-foreground rounded-lg border border-dashed p-4 text-sm">
                  File listing is not exposed yet. The backend stores uploaded
                  files, but a tRPC files query still needs to be added.
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8 lg:col-span-1">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ChatTeardropTextIcon className="text-primary size-5" />
                  Chat History
                </CardTitle>
                <CardDescription>
                  Your previous practice sessions.
                </CardDescription>
              </CardHeader>
              <CardContent className="px-0">
                <div className="flex flex-col">
                  {chats.length === 0 ? (
                    <div className="text-muted-foreground px-6 py-4 text-sm">
                      No chats yet for this course.
                    </div>
                  ) : (
                    chats.map((chat) => (
                      <Link
                        key={chat.id}
                        href={`/dashboard/${courseId}/${chat.id}`}
                        className="hover:bg-muted/50 border-b px-6 py-4 transition-colors last:border-0"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="space-y-1">
                            <p className="text-foreground leading-none font-medium">
                              {chat.title}
                            </p>
                            <p className="text-muted-foreground text-xs">
                              {chat.date ?? "Recently"}
                            </p>
                            {chat.lastMessage ? (
                              <p className="text-muted-foreground/80 line-clamp-1 text-xs">
                                {chat.lastMessage}
                              </p>
                            ) : null}
                          </div>
                          <div className="bg-primary/10 text-primary flex h-6 items-center rounded-full px-2.5 text-xs font-semibold">
                            {chat.active ? "Active" : "Past"}
                          </div>
                        </div>
                      </Link>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
