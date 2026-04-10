"use client";

import * as React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageBubble } from "./message-bubble";
import type { MessageRole } from "@/server/db/schema";

import { useChat } from "@/hooks/use-chat";

export function ChatScrollArea({ uuid }: { uuid: string }) {
  const { messages } = useChat(uuid);

  return (
    <ScrollArea className="flex max-h-full flex-col space-y-4 gap-y-4 overflow-scroll px-8">
      {messages?.map((message) => (
        <MessageBubble
          key={message.id}
          text={message.content}
          role={message.role as MessageRole}
        />
      ))}
      <div className="h-32" />
    </ScrollArea>
  );
}
