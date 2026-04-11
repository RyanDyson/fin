"use client";

import { ChatInput } from "@/components/chat/chat-input";
import { ChatScrollArea } from "@/components/chat/chat-scroll-area";
import { ProgressDropdown } from "@/components/chat/progress-dropdown";
import { Checkpoint } from "@/components/chat/checkpoint";
import { SidebarSimpleIcon } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { use } from "react";
import { api } from "@/trpc/react";
import { useChat } from "@/hooks/use-chat";

export default function ChatPage({
  params,
}: {
  params: Promise<{ "courses-id": string; "chat-id": string }>;
}) {
  const routeParams = use(params);
  const chatId = routeParams["chat-id"];
  const courseId = routeParams["courses-id"];
  const numericCourseId = Number(courseId);
  const [contentSidebarOpen, setContentSidebarOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes mock timer
  const [totalTime, setTotalTime] = useState(300);
  const [isLeisureTimer, setIsLeisureTimer] = useState(false);
  const { messages, input, setInput, sendMessage, isSendingMessage } =
    useChat(chatId, courseId);

  const courseQuery = api.get.getCourseById.useQuery(
    { course_id: numericCourseId },
    { enabled: Number.isFinite(numericCourseId) },
  );

  const progressQuery = api.get.getCourseProgress.useQuery(
    { course_id: numericCourseId },
    { enabled: Number.isFinite(numericCourseId) },
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!Number.isFinite(numericCourseId)) return;

    const onObjectiveCompleted = (event: Event) => {
      const customEvent = event as CustomEvent<{ courseId?: number }>;
      if (customEvent.detail?.courseId !== numericCourseId) return;

      setIsLeisureTimer(true);
      setTotalTime(120);
      setTimeLeft(120);
    };

    window.addEventListener("objective-completed", onObjectiveCompleted);
    return () => {
      window.removeEventListener("objective-completed", onObjectiveCompleted);
    };
  }, [numericCourseId]);

  useEffect(() => {
    if (isLeisureTimer && timeLeft === 0) {
      setIsLeisureTimer(false);
      setTotalTime(300);
      setTimeLeft(300);
    }
  }, [isLeisureTimer, timeLeft]);

  useEffect(() => {
    const attemptFullscreen = async () => {
      try {
        if (
          !document.fullscreenElement &&
          document.documentElement.requestFullscreen
        ) {
          await document.documentElement.requestFullscreen();
        }
      } catch (err) {
        console.warn(
          "Fullscreen request failed, likely due to missing user gesture:",
          err,
        );
      }
    };

    void attemptFullscreen();
  }, []);

  return (
    <div className="relative flex h-screen w-full overflow-hidden">
      <motion.div
        layout
        className="bg-background relative flex h-screen min-w-0 flex-1 flex-col"
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      >
        <Button
          variant="ghost"
          size="icon"
          className="text-primary absolute top-4 right-4 z-20"
          onClick={() => setContentSidebarOpen(!contentSidebarOpen)}
        >
          <SidebarSimpleIcon />
        </Button>
        <Checkpoint />
        <ProgressDropdown courseId={courseId} />
        <ChatScrollArea messages={messages} />
        <div className="to-background absolute right-0 bottom-4 h-16 w-full bg-linear-to-b from-transparent" />
        <ChatInput
          input={input}
          setInput={setInput}
          sendMessage={sendMessage}
          isSendingMessage={isSendingMessage}
        />
      </motion.div>
      <AnimatePresence initial={false}>
        {contentSidebarOpen && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 336, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden whitespace-nowrap"
          >
            <div className="h-full w-84 py-4 pr-4">
              <motion.div className="border-primary/30 from-primary/10 to-primary/20 h-full overflow-clip rounded-xl border bg-linear-to-b">
                <div className="p-4 whitespace-normal">
                  <h2 className="text-lg font-semibold">Learning Materials</h2>
                  <p className="text-muted-foreground mt-4 text-sm">
                    Generated custom practice material will go here...
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Timer Bar */}
      <div className="bg-secondary/50 absolute right-0 bottom-0 left-0 z-50 h-1.5 w-full">
        <motion.div
          className="bg-primary h-full"
          animate={{ width: `${(timeLeft / totalTime) * 100}%` }}
          transition={{ duration: 1, ease: "linear" }}
        />
      </div>
      <div className="text-primary absolute bottom-4 left-4 text-lg font-bold">
        {isLeisureTimer ? "Leisure: " : "Session: "}
        {Math.floor(timeLeft / 60)}m {timeLeft % 60}s
      </div>
    </div>
  );
}
