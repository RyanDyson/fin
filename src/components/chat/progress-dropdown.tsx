"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  CaretDownIcon,
  CheckCircleIcon,
  CircleDashedIcon,
  CircleIcon,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

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
  id: string;
  title: string;
  status: ObjectiveStatus;
};

// Mock data based on the Feynman Technique goals for Newton's laws
const mockObjectives: Objective[] = [
  {
    id: "obj-1",
    title: "Understand inertia and an object's resistance to change",
    status: ObjectiveStatus.Completed,
  },
  {
    id: "obj-2",
    title: "Explain that force is mass times acceleration (F=ma)",
    status: ObjectiveStatus.InProgress,
  },
  {
    id: "obj-3",
    title: "Provide a real-world example of the second law",
    status: ObjectiveStatus.Pending,
  },
  {
    id: "obj-4",
    title: "Address the 'dumb student' misconceptions",
    status: ObjectiveStatus.Pending,
  },
];

export function ProgressDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [objectives] = useState<Objective[]>(mockObjectives);

  const completedCount = objectives.filter(
    (obj) => obj.status === ObjectiveStatus.Completed,
  ).length;
  const totalCount = objectives.length;
  const progressPercentage = Math.round((completedCount / totalCount) * 100);

  const currentObjective =
    objectives.find((obj) => obj.status === ObjectiveStatus.InProgress) ??
    objectives.find((obj) => obj.status === ObjectiveStatus.Pending) ??
    objectives[objectives.length - 1];

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  return (
    <div className="absolute right-0 left-0 z-10 mx-auto w-full max-w-2xl px-4 py-4">
      <motion.div
        layout
        className="bg-card/60 border-border relative overflow-hidden rounded-2xl border border-t shadow-xs backdrop-blur-lg"
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
              <CaretDownIcon className="size-4" weight="bold" />
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
                  "flex items-start justify-center gap-3 rounded-xl p-3 transition-colors",
                )}
              >
                <span>{ObjectiveIconMap[objective.status]}</span>
                <div className="flex-1 space-y-1">
                  <p
                    className={cn(
                      "text-sm leading-none font-medium",
                      objective.status === ObjectiveStatus.Completed
                        ? "text-muted-foreground decoration-muted-foreground/50 line-through"
                        : "text-foreground",
                    )}
                  >
                    {objective.title}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
        <div className="bg-secondary h-1 w-full">
          <motion.div
            className="from-primary/10 to-primary/80 border-primary h-full border-t bg-linear-to-r"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      </motion.div>
    </div>
  );
}
