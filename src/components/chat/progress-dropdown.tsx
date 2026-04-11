"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  CaretDownIcon,
  CheckCircleIcon,
  CircleDashedIcon,
  CircleIcon,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { api } from "@/trpc/react";

enum ObjectiveStatus {
  Completed = "completed",
  InProgress = "in-progress",
  Pending = "pending",
}

const ObjectiveIconMap: Record<ObjectiveStatus, React.ReactNode> = {
  [ObjectiveStatus.Completed]: (
    <CheckCircleIcon className="text-primary size-4" />
  ),
  [ObjectiveStatus.InProgress]: (
    <CircleDashedIcon className="text-primary/50 size-4" />
  ),
  [ObjectiveStatus.Pending]: <CircleIcon className="text-muted size-4" />,
};

export type Objective = {
  id: number;
  title: string;
  status: ObjectiveStatus;
};

export function ProgressDropdown({
  inline,
  courseId,
}: {
  inline?: boolean;
  courseId?: string;
} = {}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedObjectiveId, setSelectedObjectiveId] = useState<number | null>(
    null,
  );
  const [localCompletedObjectiveIds, setLocalCompletedObjectiveIds] = useState<
    Set<number>
  >(new Set());
  const [settingTopicObjectiveId, setSettingTopicObjectiveId] = useState<
    number | null
  >(null);
  const numericCourseId = Number(courseId);
  const completedStorageKey = `completedObjectives:${numericCourseId}`;
  const selectedStorageKey = `selectedObjective:${numericCourseId}`;
  const objectivesQuery = api.get.getCourseObjectives.useQuery(
    { course_id: numericCourseId },
    { enabled: Number.isFinite(numericCourseId) },
  );
  const progressQuery = api.get.getCourseProgress.useQuery(
    { course_id: numericCourseId },
    { enabled: Number.isFinite(numericCourseId) },
  );

  useEffect(() => {
    if (!Number.isFinite(numericCourseId) || typeof window === "undefined") {
      return;
    }

    const readLocalState = () => {
      const rawCompleted = window.localStorage.getItem(completedStorageKey);
      const rawSelected = window.localStorage.getItem(selectedStorageKey);

      const parsedCompleted = (() => {
        if (!rawCompleted) return [] as number[];

        try {
          const parsed = JSON.parse(rawCompleted) as unknown;
          return Array.isArray(parsed)
            ? parsed.filter((value): value is number => Number.isInteger(value))
            : [];
        } catch {
          return [] as number[];
        }
      })();

      setLocalCompletedObjectiveIds(new Set(parsedCompleted));

      if (rawSelected && Number.isInteger(Number(rawSelected))) {
        setSelectedObjectiveId(Number(rawSelected));
      }
    };

    const handleCompletedUpdate = (event: Event) => {
      const customEvent = event as CustomEvent<{
        courseId?: number;
      }>;
      if (customEvent.detail?.courseId === numericCourseId) {
        readLocalState();
      }
    };

    readLocalState();
    window.addEventListener("objective-completed", handleCompletedUpdate);
    window.addEventListener("storage", readLocalState);

    return () => {
      window.removeEventListener("objective-completed", handleCompletedUpdate);
      window.removeEventListener("storage", readLocalState);
    };
  }, [completedStorageKey, numericCourseId, selectedStorageKey]);

  const objectives = useMemo<Objective[]>(() => {
    return (objectivesQuery.data ?? []).map((objective) => ({
      id: objective.id,
      title: objective.content,
      status: objective.isDone || localCompletedObjectiveIds.has(objective.id)
        ? ObjectiveStatus.Completed
        : ObjectiveStatus.Pending,
    }));
  }, [localCompletedObjectiveIds, objectivesQuery.data]);

  const completedCount =
    progressQuery.data?.completedObjectives ??
    objectives.filter((obj) => obj.status === ObjectiveStatus.Completed).length;
  const totalCount =
    progressQuery.data?.totalObjectives ?? objectives.length;
  const progressPercentage =
    totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  const selectedObjective =
    objectives.find((obj) => obj.id === selectedObjectiveId) ?? null;

  const currentObjective =
    selectedObjective ??
    objectives.find((obj) => obj.status === ObjectiveStatus.InProgress) ??
    objectives.find((obj) => obj.status === ObjectiveStatus.Pending) ??
    objectives[objectives.length - 1];

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const handleObjectiveClick = useCallback(
    async (objective: Objective) => {
      if (!Number.isFinite(numericCourseId)) return;
      if (settingTopicObjectiveId === objective.id) return;

      try {
        setSelectedObjectiveId(objective.id);
        if (typeof window !== "undefined") {
          window.localStorage.setItem(selectedStorageKey, String(objective.id));
        }
        setSettingTopicObjectiveId(objective.id);

        const response = await fetch(
          `http://localhost:8000/message/explain/set-topic/${numericCourseId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({ message: objective.title }),
          },
        );

        if (!response.ok) {
          throw new Error(`Failed to set topic: ${response.status}`);
        }

        setIsOpen(false);
      } finally {
        setSettingTopicObjectiveId(null);
      }
    },
    [numericCourseId, selectedStorageKey, settingTopicObjectiveId],
  );

  return (
    <div
      className={cn(
        "w-full",
        inline
          ? "mb-6 w-fit"
          : "absolute right-0 left-0 z-10 mx-auto max-w-2xl px-4 py-4",
      )}
    >
      <motion.div
        layout
        className={cn(
          "bg-card/60 border-border relative overflow-hidden rounded-2xl border border-t shadow-xs backdrop-blur-lg",
          inline && "bg-card min-w-lg",
        )}
      >
        <motion.div layout className="absolute top-1 right-2 z-10">
          <Button
            onClick={toggleDropdown}
            variant="ghost"
            size="icon"
            className="h-8 w-8"
          >
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <CaretDownIcon className="text-primary size-4" weight="bold" />
            </motion.div>
          </Button>
        </motion.div>
        <motion.div>
          <AnimatePresence initial={false} mode="popLayout">
            {(isOpen
              ? objectives
              : currentObjective
                ? [currentObjective]
                : []
            ).map((objective) => (
              <motion.div
                key={objective.id}
                layout
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.2 }}
                className={cn(
                  "hover:bg-muted/50 flex cursor-pointer items-start justify-center gap-3 rounded-xl p-3 transition-colors",
                )}
                onClick={() => void handleObjectiveClick(objective)}
              >
                <span>{ObjectiveIconMap[objective.status]}</span>
                <div className="flex-1 space-y-1">
                  <p
                    className={cn(
                      "text-left text-sm leading-none font-medium",
                      objective.status === ObjectiveStatus.Completed
                        ? "text-muted-foreground decoration-muted-foreground/50 line-through"
                        : "text-foreground",
                    )}
                  >
                    {objective.title}
                  </p>
                  {settingTopicObjectiveId === objective.id ? (
                    <p className="text-muted-foreground text-xs">
                      Setting topic...
                    </p>
                  ) : null}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
        <div className="bg-secondary h-1 w-full">
          <motion.div
            className="from-primary/50 to-primary/80 h-full border-t bg-linear-to-r"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      </motion.div>
    </div>
  );
}
