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
        <Sidebar activeId={activeContact?.id ?? null} onSelect={setActiveContact} onFeedback={() => setShowFeedback(true)} />
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


      {/* 反馈弹窗 */}
      <FeedbackModal isOpen={showFeedback} onClose={() => setShowFeedback(false)} />
    </div>
  );
}
