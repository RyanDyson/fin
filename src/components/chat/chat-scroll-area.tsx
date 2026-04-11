"use client";

import * as React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageBubble } from "./message-bubble";
import type { Message, MessageRole } from "@/server/db/schema";

export function ChatScrollArea({ messages }: { messages: Message[] }) {

  return (
    <ScrollArea className="mb-0 flex max-h-full flex-col space-y-4 gap-y-4 overflow-x-hidden px-32 pb-0">
      <div className="h-16" />
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
