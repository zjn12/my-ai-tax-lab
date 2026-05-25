"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Contact } from "@/data/contacts";
import MessageBubble, { type Message } from "./MessageBubble";
import ChatInput from "./ChatInput";

interface Props {
  contact: Contact;
  onBack: () => void;
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export default function ChatArea({ contact, onBack }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasInitRef = useRef(false);

  // 初始化时添加欢迎消息
  useEffect(() => {
    if (hasInitRef.current) return;
    hasInitRef.current = true;

    const welcomeMessages: Record<string, string> = {
      piggy: "哼哼~ 你好呀！我是小猪，今天吃了好多好吃的，好开心诶嘿~ 你想聊什么呀？🐷",
      bunny: "蹦蹦~ 你好！兔兔很高兴认识你，今天天气真好呢，适合在草地上跳跳~ 🐰",
      chai: "哼！又来一个找本柴的？烦死了... 不过既然来了就聊两句吧，切~ 🦊",
      "chai-ai": "小柴啊~ 舅舅在这儿呢！有什么问题尽管问，舅舅什么都知道，嘿嘿~ 🤖",
      "animal-group": "🌈 欢迎来到动物世界群聊！小猪、小兔、臭柴和柴舅AI都在这里哦~ 大家快来打个招呼吧！",
    };

    const welcome = welcomeMessages[contact.id];
    if (welcome) {
      if (contact.isGroup) {
        setMessages([
          { id: generateId(), role: "assistant", content: welcome },
        ]);
      } else {
        setMessages([
          { id: generateId(), role: "assistant", content: welcome },
        ]);
      }
    }
  }, [contact.id, contact.isGroup]);

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = useCallback(
    async (text: string) => {
      const userMsg: Message = {
        id: generateId(),
        role: "user",
        content: text,
      };

      const updatedMessages = [...messages, userMsg];
      setMessages(updatedMessages);
      setLoading(true);

      try {
        // 构建 API 请求的消息列表
        const apiMessages = updatedMessages.map((m) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        }));

        // 尝试调用 /api/chat（Cloudflare Function 或 Next.js API route）
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: apiMessages,
            systemPrompt: contact.systemPrompt,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          // API 不可用时的模拟回复
          throw new Error(data.error || "API 不可用");
        }

        if (contact.isGroup && data.reply) {
          // 群聊：解析多角色回复
          const lines = data.reply.split("\n").filter((l: string) => l.trim());
          const groupMessages = lines.map((line: string) => {
            const match = line.match(/【(.+?)】：(.+)/);
            if (match) {
              return {
                id: generateId(),
                role: "assistant" as const,
                content: match[2].trim(),
                senderName: match[1],
              };
            }
            return {
              id: generateId(),
              role: "assistant" as const,
              content: line.trim(),
            };
          });

          setMessages((prev) => [...prev, ...groupMessages]);
        } else {
          setMessages((prev) => [
            ...prev,
            {
              id: generateId(),
              role: "assistant",
              content: data.reply || "（小动物发了会儿呆...）",
            },
          ]);
        }
      } catch (err: any) {
        // 降级：生成模拟回复
        setMessages((prev) => [
          ...prev,
          {
            id: generateId(),
            role: "assistant",
            content: generateMockReply(contact, text),
          },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [messages, contact]
  );

  return (
    <div className="flex h-full flex-col bg-gradient-to-b from-pink-50/50 to-white">
      {/* 顶部栏 */}
      <div className="flex items-center gap-3 border-b border-pink-100 bg-white/80 px-4 py-3 backdrop-blur">
        {/* 返回按钮 (移动端) */}
        <button
          onClick={onBack}
          className="flex h-8 w-8 items-center justify-center rounded-lg bg-pink-50 text-pink-400 transition-colors hover:bg-pink-100 md:hidden"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-pink-200 to-pink-300 text-xl shadow-sm">
          {contact.avatar}
        </div>
        <div className="flex-1">
          <h2 className="text-sm font-bold text-gray-700">{contact.name}</h2>
          <p className="text-xs text-gray-400">{contact.isGroup ? "群聊" : contact.description}</p>
        </div>
      </div>

      {/* 消息列表 */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="mx-auto flex max-w-2xl flex-col gap-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <span className="text-5xl">{contact.avatar}</span>
              <p className="mt-3 text-sm text-gray-400">开始和{contact.name}聊天吧~</p>
            </div>
          )}

          {messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              message={msg}
              avatar={contact.avatar}
            />
          ))}

          {/* 加载动画 */}
          {loading && (
            <div className="flex gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-pink-200 to-pink-300 text-xl shadow-sm">
                {contact.avatar}
              </div>
              <div className="flex items-center gap-1 rounded-2xl rounded-tl-md bg-white px-4 py-3 shadow-sm">
                <span className="h-2 w-2 animate-bounce rounded-full bg-pink-300" style={{ animationDelay: "0ms" }} />
                <span className="h-2 w-2 animate-bounce rounded-full bg-pink-300" style={{ animationDelay: "150ms" }} />
                <span className="h-2 w-2 animate-bounce rounded-full bg-pink-300" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* 输入框 */}
      <ChatInput onSend={sendMessage} disabled={loading} />
    </div>
  );
}

// 模拟回复（API 不可用时的降级方案）
function generateMockReply(contact: Contact, userText: string): string {
  const replies: Record<string, string[]> = {
    piggy: [
      "哼哼~ 你说的好有意思诶嘿！🐷",
      "呼噜呼噜... 小猪觉得你说得对！要不要一起吃个苹果？🍎",
      "诶嘿~ 小猪也是这么想的！好巧呀！",
      "哼哼~ 小猪有点困了... 但是还是想和你聊天~",
    ],
    bunny: [
      "蹦蹦~ 兔兔也觉得是这样呢！🐰",
      "诶？真的吗？兔兔好开心能听到这个~",
      "蹦蹦跳跳！兔兔给你点赞！🥕",
    ],
    chai: [
      "切~ 就这？本柴觉得还行吧... 哼！🦊",
      "烦死了... 不过你说得确实有点道理。别得意！",
      "哼！本柴才不是关心你呢... 就是随便问问而已！",
    ],
    "chai-ai": [
      "小柴啊~ 舅舅觉得这个问题很有意思！来来来，舅舅给你讲讲... 🤖",
      "这事儿吧，舅舅我见得多了。关键是心态要放平~",
      "哈哈！好问题！舅舅年轻的时候也这么想过呢~",
    ],
    "animal-group": [
      "【小猪】：哼哼~ 大家在聊什么好吃的呀？🐷\n【臭柴】：切！就知道吃，小猪你够了！🦊\n【小兔】：蹦蹦~ 大家不要吵架啦~ 🐰",
      "【柴舅AI】：小柴啊，舅舅觉得这个话题不错！🤖\n【臭柴】：哼！舅舅你又来教训我了... 🦊\n【小猪】：呼噜呼噜~ 舅舅说得对！诶嘿~ 🐷",
    ],
  };

  const pool = replies[contact.id] || ["嗯嗯！"];
  return pool[Math.floor(Math.random() * pool.length)];
}
