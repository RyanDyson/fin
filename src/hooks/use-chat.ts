import { type Message, MessageRole } from "@/server/db/schema";
import { useState, useCallback } from "react";

type ExplainResponse = {
  explanation?: string;
  comprehension?: number;
  message?: string;
  additional_message?: string;
};

export function useChat(chatId: string, courseId: string) {
  const [input, setInput] = useState("");
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      chat_id: Number(chatId),
      content: "Hello! I am your AI assistant. How can I help you today?",
      role: MessageRole.ASSISTANT,
      createdAt: new Date(Date.now() - 60000),
    },
  ]);

  const sendMessage = useCallback(async () => {
    if (!input.trim()) return;

    setIsSendingMessage(true);

    const newUserMsg: Message = {
      id: Math.floor(Math.random() * 1000000),
      chat_id: Number(chatId),
      content: input,
      role: MessageRole.USER,
      createdAt: new Date(),
    };

    setMessages((prev) => [...prev, newUserMsg as Message]);
    setInput("");

    try {
      const response = await fetch(
        `http://localhost:8000/message/explain/${courseId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ message: newUserMsg.content }),
        },
      );

      if (!response.ok) {
        throw new Error(`Failed to explain message: ${response.status}`);
      }

      const result = (await response.json()) as ExplainResponse;
      const assistantText =
        result.explanation?.trim() ||
        result.message?.trim() ||
        result.additional_message?.trim() ||
        "I could not generate a response.";

      if (
        typeof window !== "undefined" &&
        typeof result.comprehension === "number" &&
        result.comprehension > 70
      ) {
        const numericCourseId = Number(courseId);
        const selectedStorageKey = `selectedObjective:${numericCourseId}`;
        const completedStorageKey = `completedObjectives:${numericCourseId}`;
        const selectedObjectiveId = Number(
          window.localStorage.getItem(selectedStorageKey),
        );

        if (Number.isInteger(selectedObjectiveId)) {
          const existingCompleted = (() => {
            const raw = window.localStorage.getItem(completedStorageKey);
            if (!raw) return [] as number[];

            try {
              const parsed = JSON.parse(raw) as unknown;
              return Array.isArray(parsed)
                ? parsed.filter(
                    (value): value is number => Number.isInteger(value),
                  )
                : [];
            } catch {
              return [] as number[];
            }
          })();

          const merged = Array.from(
            new Set([...existingCompleted, selectedObjectiveId]),
          );
          window.localStorage.setItem(
            completedStorageKey,
            JSON.stringify(merged),
          );
          window.dispatchEvent(
            new CustomEvent("objective-completed", {
              detail: {
                courseId: numericCourseId,
                objectiveId: selectedObjectiveId,
              },
            }),
          );
        }
      }

      const newAiMsg: Message = {
        id: Math.floor(Math.random() * 1000000),
        chat_id: Number(chatId),
        content:
          result.comprehension !== undefined
            ? `Comprehension: ${result.comprehension}\n\n${assistantText}`
            : assistantText,
        role: MessageRole.ASSISTANT,
        createdAt: new Date(),
      };

      setMessages((prev) => [...prev, newAiMsg]);
    } catch (error) {
      const fallbackMsg: Message = {
        id: Math.floor(Math.random() * 1000000),
        chat_id: Number(chatId),
        content:
          error instanceof Error
            ? `Sorry, I could not reach the backend: ${error.message}`
            : "Sorry, I could not reach the backend.",
        role: MessageRole.ASSISTANT,
        createdAt: new Date(),
      };

      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsSendingMessage(false);
    }
  }, [courseId, chatId, input]);

  return {
    messages,
    setMessages,
    input,
    setInput,
    sendMessage,
    isSendingMessage,
  };
}
