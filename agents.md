# AGENTS.md

## Requirements

I am building an app for a learning system. The learning system will be using 2 AIs to simulate teaching something to someone as a means to understand a topic (the Feynman Technique). 
There will be 2 AIs that are openAI models called via vercel AI SDK. One AI will be the one that sets the goals of the session. So for example, if the target topic to understand is Newton's laws of motion. Then the objective will be, understand inertia, understand that the force required to move an object is its mass times its acceleration. This AI will also actively look through the conversation between the user and the other AI and evaluate if the AI has understand a specific goal from the users explanation. The second AI should be acting like a "dumb student" asking questions to the user about the topic. The user's responsibility is to try to explain to the agent about the topic.

## UI Design
The main UI will be using tailwind and shadcn compoments, with motion/react for smoother animations. I have set up the globals.css and css variables to be used. Try to not user custome variables for css like w-[1687px]. On Layout.tsx, it should have sidebar (using shadcn) with a chat history of previous chats and a button to create a new chat. On click on the new chat button, it should open a dialog where the user can specify The UI design should be a simple chat UI, with a tracker UI for the goals created by the first AI. This should be using a progress bar pinned at the top of the chat that you can expand to see the full progress of the chat. On the chat-input, the user should be able to attach images. You should always give some sort of UI feedback to any loading state even if you cannot fetch a loading state from the backend, just fake one. 


## Roles

The agent messaging system relies on specific roles to differentiate the source and purpose of each message:

- **`system`**: Sets the behavior, persona, and boundaries of the agent. Usually hidden from the end user.
- **`user`**: The human interacting with the system. Provides prompts and queries.
- **`assistant`**: The AI model processing inputs and generating responses.
- **`tool` / `function`**: (Optional) Used when the agent interacts with external tools or APIs, returning the result of a tool execution.

## Database Schema

Agents persist their conversation history using the `messages` and `chats` tables.

### `chats` Table
Represents a conversation session.
- `id`: Unique identifier for the chat.
- `userId`: The owner of the chat session.
- `active`: Boolean flag indicating if the chat is currently active.

### `messages` Table
Stores individual messages within a chat.
- `id`: Unique identifier.
- `chat_id`: Reference to the parent chat session.
- `content`: The text content of the message.
- `role`: The role of the message sender (`user`, `assistant`, `system`).
- `createdAt`: Timestamp of message creation.

## Best Practices

1. **Context Limits**: Always monitor the context window of the underlying LLM. Implement trimming or summarizing strategies for long-running chats.
2. **Tool Usage**: When enabling tools for agents, ensure proper error handling and validation for the tool outputs before returning them to the model.
3. **Security**: Never expose raw system prompts to the user, and validate all inputs to prevent prompt injection attacks.
