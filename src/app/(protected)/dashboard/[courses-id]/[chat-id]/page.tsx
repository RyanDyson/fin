import { use } from "react";
import { ChatInput } from "@/components/chat/chat-input";
import { ChatScrollArea } from "@/components/chat/chat-scroll-area";
import { ProgressDropdown } from "@/components/chat/progress-dropdown";

export default function ChatPage({
  params,
}: {
  params: Promise<{ "chat-id": string }>;
}) {
  const routeParams = use(params);
  const chatId = routeParams["chat-id"];

  return (
    <div className="bg-background relative flex h-screen max-w-full flex-col">
      <ProgressDropdown />
      <ChatScrollArea uuid={chatId} />
      <ChatInput uuid={chatId} />
    </div>
  );
}
