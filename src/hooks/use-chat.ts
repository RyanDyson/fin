import { type Message, MessageRole } from "@/server/db/schema";
import { useState, useCallback } from "react";

export function useChat(uuid: string) {
  const [input, setInput] = useState("");
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      chat_id: Number(uuid),
      content: "Hello! I am your AI assistant. How can I help you today?",
      role: MessageRole.ASSISTANT,
      createdAt: new Date(Date.now() - 60000),
    },
    {
      id: 2,
      chat_id: Number(uuid),
      content: "I need some help planning my courses.",
      role: MessageRole.USER,
      createdAt: new Date(Date.now() - 30000),
    },
    {
      id: 3,
      chat_id: Number(uuid),
      content:
        "Sure, I can help with that. What kind of courses are you interested in? Here is an example of a list:\n- Math\n- Science\n- Computer Science",
      role: MessageRole.ASSISTANT,
      createdAt: new Date(Date.now() - 15000),
    },
  ]);

  const sendMessage = useCallback(() => {
    if (!input.trim()) return;

    setIsSendingMessage(true);

    const newUserMsg: Message = {
      id: Math.floor(Math.random() * 1000000),
      chat_id: Number(uuid),
      content: input,
      role: MessageRole.USER,
      createdAt: new Date(),
    };

    setMessages((prev) => [...prev, newUserMsg as Message]);
    setInput("");

    // Simulate a network request
    setTimeout(() => {
      const newAiMsg: Message = {
        id: Math.floor(Math.random() * 1000000),
        chat_id: Number(uuid),
        content: `This is a simulated response to: "${newUserMsg.content}"`,
        role: MessageRole.ASSISTANT,
        createdAt: new Date(),
      };

      setMessages((prev) => [...prev, newAiMsg]);
      setIsSendingMessage(false);
    }, 1000);
  }, [input, uuid]);

  return {
    messages,
    setMessages,
    input,
    setInput,
    sendMessage,
    isSendingMessage,
  };
}
