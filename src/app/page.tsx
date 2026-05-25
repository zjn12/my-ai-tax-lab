"use client";

import { useState } from "react";
import { Contact } from "@/data/contacts";
import Sidebar from "@/components/Sidebar";
import ChatArea from "@/components/ChatArea";
import FeedbackModal from "@/components/FeedbackModal";

export default function Home() {
  const [activeContact, setActiveContact] = useState<Contact | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-pink-50">
      {/* 左侧边栏 - 桌面端始终显示，移动端选人前显示 */}
      <div
        className={`w-full shrink-0 border-r border-pink-100 md:w-72 ${
          activeContact ? "hidden md:block" : "block"
        }`}
      >
        <Sidebar activeId={activeContact?.id ?? null} onSelect={setActiveContact} />
      </div>

      {/* 右侧聊天区 */}
      <div className={`flex-1 ${!activeContact ? "hidden md:flex" : "flex"}`}>
        {activeContact ? (
          <ChatArea
            key={activeContact.id}
            contact={activeContact}
            onBack={() => setActiveContact(null)}
          />
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center bg-gradient-to-b from-pink-50/50 to-white p-8 text-center">
            <span className="text-7xl">🌈</span>
            <h2 className="mt-4 text-xl font-bold text-pink-400">小动物聊天室</h2>
            <p className="mt-2 text-sm text-gray-400">
              从左侧选择一个可爱的朋友
              <br />
              开始聊天吧~
            </p>
          </div>
        )}
      </div>

      {/* 意见反馈浮动按钮 */}
      <button
        onClick={() => setShowFeedback(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-2xl bg-white px-4 py-2.5 text-sm font-medium text-pink-500 shadow-lg transition-all hover:bg-pink-50 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
        title="意见反馈"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
        </svg>
        意见反馈
      </button>

      {/* 反馈弹窗 */}
      <FeedbackModal isOpen={showFeedback} onClose={() => setShowFeedback(false)} />
    </div>
  );
}
