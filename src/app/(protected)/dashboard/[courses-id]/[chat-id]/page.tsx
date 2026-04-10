import { ChatInput } from "@/components/chat/chat-input";
import { ChatScrollArea } from "@/components/chat/chat-scroll-area";
import { ProgressDropdown } from "@/components/chat/progress-dropdown";

export default function ChatPage({ params }: { params: { chatId: string } }) {
  const { chatId } = params;

  return (
    <div className="bg-background relative flex h-screen max-w-full flex-col">
      <ProgressDropdown />
      <ChatScrollArea uuid={chatId} />
      <ChatInput uuid={chatId} />
    </div>
  );
}
