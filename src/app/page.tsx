import Clock from "@/components/Clock";

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-black text-white">
      {/* 背景光晕 */}
      <div className="pointer-events-none absolute inset-0 select-none">
        <div className="absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-zinc-800/40 blur-[120px]" />
        <div className="absolute bottom-0 left-1/4 h-[300px] w-[300px] rounded-full bg-zinc-700/30 blur-[100px]" />
      </div>

      {/* 网格背景 */}
      <div
        className="pointer-events-none absolute inset-0 select-none opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* 主体内容 */}
      <main className="relative z-10 flex flex-col items-center gap-8 px-6 text-center">
        {/* LOGO */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-lg backdrop-blur">
            ⚡
          </div>
          <span className="text-sm font-medium tracking-[0.2em] text-zinc-400 uppercase">
            AI Lab
          </span>
        </div>

        {/* 标题 */}
        <h1 className="max-w-2xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl">
          我的
          <span className="bg-gradient-to-r from-zinc-200 via-white to-zinc-400 bg-clip-text text-transparent">
            AI财税实验室
          </span>
        </h1>

        {/* 副标题 */}
        <p className="max-w-md text-base leading-relaxed text-zinc-400 sm:text-lg">
          网站部署测试成功
        </p>

        {/* 欢迎语 */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 px-6 py-4 backdrop-blur">
          <p className="text-sm text-zinc-300">
            欢迎来到 AI 财税实验室。这里将成为财税智能化工具的研发与测试中心。
          </p>
        </div>

        {/* 当前时间 */}
        <Clock />

        {/* 按钮 */}
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-white px-8 py-3 text-sm font-medium text-black transition-all hover:bg-zinc-200 hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]"
        >
          <span>开始探索</span>
          <svg
            className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
        </a>
      </main>

      {/* 页脚 */}
      <footer className="relative z-10 mt-16 pb-8 text-center">
        <div className="flex flex-col items-center gap-2">
          <p className="text-xs text-zinc-600">
            &copy; {new Date().getFullYear()} AI财税实验室 · 工具制作：浙江同方-审计一部-朱佳楠
          </p>
          <p className="text-xs text-zinc-700">
            Powered by Next.js · Deployed on Cloudflare
          </p>
        </div>
      </footer>
    </div>
  );
}
