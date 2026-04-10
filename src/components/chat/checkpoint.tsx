"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "../ui/button";
import {
  TrophyIcon,
  HourglassHighIcon,
  BookOpenTextIcon,
  CoffeeIcon,
  ArrowRightIcon,
  SparkleIcon,
} from "@phosphor-icons/react";
import { ProgressDropdown } from "./progress-dropdown";

enum CheckpointState {
  Hidden = "hidden",
  Success = "success",
  Timeout = "timeout",
  Generating = "generating",
}

enum RestMode {
  None = "none",
  Setup = "setup",
  Active = "active",
}

// --- Subcomponents ---

function SuccessView({
  setStatus,
}: {
  setStatus: (status: CheckpointState) => void;
}) {
  return (
    <div className="flex w-full flex-col items-center text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: "spring", bounce: 0.5 }}
        className="mb-6 flex size-20 items-center justify-center rounded-full bg-green-100 text-green-500 shadow-inner"
      >
        <TrophyIcon weight="fill" className="size-10" />
      </motion.div>
      <h2 className="mb-2 text-3xl font-bold tracking-tight">
        Session Complete!
      </h2>
      <p className="text-primary-foreground mb-8 text-base">
        Outstanding work! You successfully covered and explained every learning
        objective.
      </p>
      <div className="flex w-full flex-col gap-3">
        <Button
          variant="gradientForeground"
          onClick={() => setStatus(CheckpointState.Hidden)}
        >
          Return to Dashboard
          <ArrowRightIcon weight="bold" className="ml-2 size-4" />
        </Button>
      </div>
    </div>
  );
}

function TimeoutView({
  setStatus,
  setRestMode,
  completedObjectives,
  totalObjectives,
}: {
  setStatus: (status: CheckpointState) => void;
  setRestMode: (mode: RestMode) => void;
  completedObjectives: number;
  totalObjectives: number;
}) {
  return (
    <div className="flex w-full flex-col items-center text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: "spring", bounce: 0.5 }}
        className="mb-6 flex size-20 items-center justify-center rounded-full bg-orange-100 text-orange-500 shadow-inner"
      >
        <HourglassHighIcon weight="fill" className="size-10" />
      </motion.div>
      <h2 className="mb-2 text-3xl font-bold tracking-tight">
        Time&apos;s Up!
      </h2>
      <p className="text-primary-foreground mb-4 text-base">
        You completed {completedObjectives} out of {totalObjectives} objectives
      </p>
      <ProgressDropdown inline={true} />
      <div className="flex w-full gap-2">
        <Button
          size="lg"
          variant="gradientForeground"
          className="max-w-1/2 grow"
          onClick={() => setStatus(CheckpointState.Generating)}
        >
          <BookOpenTextIcon weight="bold" className="mr-2 size-5" />
          Practice more
        </Button>
        <Button
          size="lg"
          variant="gradientForeground"
          className="grow"
          onClick={() => setRestMode(RestMode.Setup)}
        >
          <CoffeeIcon weight="bold" className="mr-2 size-5" />
          Rest
        </Button>
      </div>
    </div>
  );
}

function RestSetupView({
  setRestMode,
  setTimeLeft,
  restDurationMins,
  setRestDurationMins,
}: {
  setRestMode: (mode: RestMode) => void;
  setTimeLeft: (time: number) => void;
  restDurationMins: number;
  setRestDurationMins: (mins: number) => void;
}) {
  return (
    <div className="flex w-full flex-col items-center text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: "spring", bounce: 0.5 }}
        className="mb-6 flex size-20 items-center justify-center rounded-full bg-blue-100 text-blue-500 shadow-inner"
      >
        <CoffeeIcon weight="fill" className="size-10" />
      </motion.div>
      <h2 className="mb-2 text-3xl font-bold tracking-tight">Rest Timer</h2>
      <p className="mb-8 text-base">How many minutes do you want to rest?</p>
      <div className="flex w-full flex-col gap-4">
        <div className="flex items-center justify-center gap-4">
          <Button
            variant="outline"
            size="icon"
            className="text-primary rounded-full"
            onClick={() =>
              setRestDurationMins(Math.max(1, restDurationMins - 1))
            }
          >
            -
          </Button>
          <span className="w-16 text-center text-2xl font-bold">
            {restDurationMins} m
          </span>
          <Button
            variant="outline"
            size="icon"
            className="text-primary rounded-full"
            onClick={() => setRestDurationMins(restDurationMins + 1)}
          >
            +
          </Button>
        </div>
        <div className="mt-2 flex w-full gap-2">
          <Button
            variant="ghost"
            size="lg"
            className="grow rounded-full"
            onClick={() => setRestMode(RestMode.None)}
          >
            Cancel
          </Button>
          <Button
            variant="gradientForeground"
            size="lg"
            className="grow rounded-full"
            onClick={() => {
              setTimeLeft(restDurationMins * 60);
              setRestMode(RestMode.Active);
            }}
          >
            Start Timer
          </Button>
        </div>
      </div>
    </div>
  );
}

function RestActiveView({
  setStatus,
  setRestMode,
  timeLeft,
}: {
  setStatus: (status: CheckpointState) => void;
  setRestMode: (mode: RestMode) => void;
  timeLeft: number;
}) {
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div className="flex w-full flex-col items-center text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: "spring", bounce: 0.5 }}
        className="mb-6 flex size-20 items-center justify-center rounded-full bg-blue-100 text-blue-500 shadow-inner"
      >
        <CoffeeIcon weight="fill" className="size-10" />
      </motion.div>
      <h2 className="mb-2 text-5xl font-bold tracking-tight tabular-nums">
        {formatTime(timeLeft)}
      </h2>
      <p className="mb-8 text-base">Take a deep breath and relax.</p>
      <Button
        variant="gradientForeground"
        size="lg"
        className="w-full rounded-full"
        onClick={() => {
          setRestMode(RestMode.None);
          setStatus(CheckpointState.Hidden);
        }}
      >
        Skip Rest
      </Button>
    </div>
  );
}

function GeneratingView({
  setStatus,
}: {
  setStatus: (status: CheckpointState) => void;
}) {
  // Mock API call timer
  useEffect(() => {
    const timer = setTimeout(() => {
      setStatus(CheckpointState.Hidden);
    }, 3000);
    return () => clearTimeout(timer);
  }, [setStatus]);

  return (
    <div className="flex w-full flex-col items-center text-center">
      <div className="relative mb-6 flex size-20 items-center justify-center">
        {/* Pulsing Background Rings */}
        <motion.div
          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 rounded-full bg-purple-400/30"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.8, 0.2, 0.8] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
          className="absolute inset-0 rounded-full bg-purple-500/40"
        />
        {/* Main Icon */}
        <div className="relative z-10 flex size-full items-center justify-center rounded-full bg-purple-100 text-purple-600 shadow-inner">
          <SparkleIcon weight="bold" className="size-10" />
        </div>
      </div>
      <h2 className="mb-2 text-3xl font-bold tracking-tight">
        Crafting Material...
      </h2>
      <p className="text-primary-foreground mb-8 text-base">
        The AI is analyzing your session and putting together a custom practice
        plan.
      </p>
    </div>
  );
}

// --- Main Component ---

export function Checkpoint() {
  const [status, setStatus] = useState<CheckpointState>(
    CheckpointState.Timeout,
  );
  const [completedObjectives] = useState(2);
  const [totalObjectives] = useState(4);

  const [restMode, setRestMode] = useState<RestMode>(RestMode.None);
  const [restDurationMins, setRestDurationMins] = useState(5);
  const [timeLeft, setTimeLeft] = useState(0);

  // A small dev helper to let you easily toggle between the different UI states
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "1") {
        setStatus(CheckpointState.Success);
        setRestMode(RestMode.None);
      }
      if (e.key === "2") {
        setStatus(CheckpointState.Timeout);
        setRestMode(RestMode.None);
      }
      if (e.key === "3") {
        setStatus(CheckpointState.Generating);
        setRestMode(RestMode.None);
      }
      if (e.key === "0") {
        setStatus(CheckpointState.Hidden);
        setRestMode(RestMode.None);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Rest Timer Interval
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (restMode === RestMode.Active && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0 && restMode === RestMode.Active) {
      setRestMode(RestMode.None);
      setStatus(CheckpointState.Hidden);
    }
    return () => clearInterval(interval);
  }, [restMode, timeLeft]);

  return (
    <AnimatePresence>
      {status !== CheckpointState.Hidden && (
        <motion.div
          initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
          animate={{ opacity: 1, backdropFilter: "blur(16px)" }}
          exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
          transition={{ duration: 0.4 }}
          className="bg-primary/50 fixed inset-0 z-50 flex items-center justify-center px-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="text-primary-foreground relative w-full max-w-md rounded-3xl p-8"
          >
            {restMode === RestMode.Active ? (
              <RestActiveView
                setStatus={setStatus}
                setRestMode={setRestMode}
                timeLeft={timeLeft}
              />
            ) : restMode === RestMode.Setup ? (
              <RestSetupView
                setRestMode={setRestMode}
                setTimeLeft={setTimeLeft}
                restDurationMins={restDurationMins}
                setRestDurationMins={setRestDurationMins}
              />
            ) : status === CheckpointState.Generating ? (
              <GeneratingView setStatus={setStatus} />
            ) : status === CheckpointState.Success ? (
              <SuccessView setStatus={setStatus} />
            ) : (
              <TimeoutView
                setStatus={setStatus}
                setRestMode={setRestMode}
                completedObjectives={completedObjectives}
                totalObjectives={totalObjectives}
              />
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
