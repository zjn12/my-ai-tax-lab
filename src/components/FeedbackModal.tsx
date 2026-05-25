"use client";

import { useState, useEffect } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function FeedbackModal({ isOpen, onClose }: Props) {
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("设定补充");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [feedbacks, setFeedbacks] = useState<Array<{ content: string; category: string; time: number }>>([]);

  // 加载已有反馈
  useEffect(() => {
    if (isOpen) {
      fetch("/api/feedback")
        .then((r) => r.json())
        .then((data) => {
          if (data.items) setFeedbacks(data.items);
        })
        .catch(() => {});
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!content.trim()) return;
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: content.trim(), category }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "提交失败");
      setSuccess(true);
      setContent("");
      setFeedbacks((prev) => [data.entry, ...prev]);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || "提交失败，请稍后重试");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const categories = ["设定补充", "角色建议", "事件提议", "Bug反馈", "剧情举报"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-md rounded-2xl bg-white shadow-2xl">
        {/* 头部 */}
        <div className="flex items-center justify-between rounded-t-2xl border-b border-pink-100 bg-gradient-to-r from-pink-50 to-purple-50 px-5 py-4">
          <div>
            <h3 className="text-base font-bold text-pink-500">意见反馈</h3>
            <p className="mt-0.5 text-xs text-pink-300">
              动物世界设定补充、小动物举报都可以写在这里
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-pink-100 text-pink-400 transition-colors hover:bg-pink-200"
          >
            ✕
          </button>
        </div>

        {/* 表单 */}
        <div className="space-y-4 px-5 py-4">
          {/* 分类 */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-500">分类</label>
            <div className="flex flex-wrap gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                    category === cat
                      ? "bg-pink-100 text-pink-600"
                      : "bg-gray-100 text-gray-500 hover:bg-pink-50"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* 内容 */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-500">反馈内容</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="写下你想补充的世界设定、角色建议、或举报内容..."
              rows={4}
              className="w-full resize-none rounded-xl border border-pink-200 bg-pink-50/50 p-3 text-sm text-gray-700 placeholder-pink-300 outline-none transition-all focus:border-pink-400 focus:bg-white"
            />
          </div>

          {/* 提交 */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleSubmit}
              disabled={submitting || !content.trim()}
              className={`rounded-xl px-5 py-2.5 text-sm font-medium transition-all ${
                submitting
                  ? "bg-pink-200 text-pink-400"
                  : "bg-gradient-to-r from-pink-400 to-pink-500 text-white hover:from-pink-500 hover:to-pink-600"
              } disabled:opacity-50`}
            >
              {submitting ? "提交中..." : "提交反馈"}
            </button>
            {success && (
              <span className="text-xs text-green-500">✅ 提交成功！已永久记录</span>
            )}
            {error && (
              <span className="text-xs text-red-400">{error}</span>
            )}
          </div>
        </div>

        {/* 已有反馈列表 */}
        {feedbacks.length > 0 && (
          <div className="max-h-40 overflow-y-auto border-t border-pink-100 px-5 py-3">
            <p className="mb-2 text-xs font-medium text-pink-400">历史反馈（已融入角色记忆）</p>
            <div className="space-y-1.5">
              {feedbacks.slice(0, 10).map((fb, i) => (
                <div key={i} className="flex items-start gap-2 rounded-lg bg-pink-50/50 px-2.5 py-1.5">
                  <span className="mt-0.5 shrink-0 rounded bg-pink-100 px-1.5 py-[1px] text-[10px] text-pink-400">
                    {fb.category}
                  </span>
                  <p className="text-xs text-gray-500 line-clamp-2">{fb.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
