"use client";

import { Contact, contacts } from "@/data/contacts";

interface Props {
  activeId: string | null;
  onSelect: (contact: Contact) => void;
  onFeedback: () => void;
}

export default function Sidebar({ activeId, onSelect, onFeedback }: Props) {
  return (
    <div className="flex h-full w-full flex-col bg-gradient-to-b from-pink-50 to-purple-50">
      {/* 顶部标题 */}
      <div className="flex items-center gap-3 border-b border-pink-100 px-4 py-4">
        <span className="text-2xl">🌈</span>
        <div>
          <h1 className="text-base font-bold text-pink-500">小动物聊天室</h1>
          <p className="text-xs text-pink-300">和可爱的朋友们聊天吧~</p>
        </div>
      </div>

      {/* 联系人列表 */}
      <div className="flex-1 overflow-y-auto py-2">
        {contacts.map((contact) => (
          <button
            key={contact.id}
            onClick={() => onSelect(contact)}
            className={`flex w-full items-center gap-3 px-4 py-3 transition-all hover:bg-pink-100/50 ${
              activeId === contact.id
                ? "border-l-[3px] border-pink-400 bg-pink-100/60"
                : "border-l-[3px] border-transparent"
            }`}
          >
            {/* 头像 */}
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-2xl shadow-sm">
              {contact.avatar}
            </div>

            {/* 信息 */}
            <div className="flex flex-1 flex-col items-start overflow-hidden text-left">
              <div className="flex items-center gap-1.5">
                <span
                  className={`text-sm font-semibold ${
                    activeId === contact.id ? "text-pink-500" : "text-gray-700"
                  }`}
                >
                  {contact.name}
                </span>
                {contact.isGroup && (
                  <span className="rounded bg-pink-100 px-1.5 py-[1px] text-[10px] font-medium text-pink-400">
                    群聊
                  </span>
                )}
              </div>
              <p className="truncate text-xs text-gray-400">{contact.description}</p>
            </div>
          </button>
        ))}
      </div>

      {/* 底部 */}
      <div className="border-t border-pink-100 px-4 py-3 space-y-2">
        <button
          onClick={onFeedback}
          className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-white py-2 text-xs font-medium text-pink-400 shadow-sm transition-all hover:bg-pink-50 hover:text-pink-500"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
          </svg>
          意见反馈
        </button>
        <p className="text-center text-[10px] text-pink-300">
          工具制作：浙江同方-审计一部-朱佳楠
        </p>
      </div>
    </div>
  );
}
