export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  senderName?: string;
}

interface Props {
  message: Message;
  avatar: string;
}

export default function MessageBubble({ message, avatar }: Props) {
  const isUser = message.role === "user";

  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      {/* 头像 */}
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xl shadow-sm ${
          isUser
            ? "bg-gradient-to-br from-blue-300 to-blue-400"
            : "bg-gradient-to-br from-pink-200 to-pink-300"
        }`}
      >
        {isUser ? "😊" : avatar}
      </div>

      {/* 消息内容 */}
      <div className={`flex max-w-[70%] flex-col ${isUser ? "items-end" : "items-start"}`}>
        {/* 发送者名字（群聊时显示） */}
        {message.senderName && (
          <span className="mb-1 text-xs font-medium text-pink-400">{message.senderName}</span>
        )}

        {/* 气泡 */}
        <div
          className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
            isUser
              ? "rounded-tr-md bg-gradient-to-br from-blue-400 to-blue-500 text-white"
              : "rounded-tl-md bg-white text-gray-700"
          }`}
        >
          {message.content}
        </div>
      </div>
    </div>
  );
}
