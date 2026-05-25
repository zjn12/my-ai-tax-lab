# 我的AI财税实验室

AI 财税智能化工具研发与测试中心。

## 技术栈

- **框架**: Next.js 16 + React 19
- **样式**: TailwindCSS 4
- **语言**: TypeScript
- **部署**: Cloudflare Pages

## 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm start
```

访问 http://localhost:3000 查看页面。

## 项目结构

```
src/
├── app/
│   ├── globals.css      # 全局样式
│   ├── layout.tsx       # 根布局
│   └── page.tsx         # 首页
└── components/
    └── Clock.tsx         # 动态时钟组件
```

## 在线访问

🔗 **https://my-ai-tax-lab.pages.dev**

## 部署

项目通过 Cloudflare Pages 部署，自动 HTTPS。

```bash
# 构建
npm run build

# 部署（需要先安装 wrangler 并登录）
npx wrangler pages deploy out/ --project-name=my-ai-tax-lab
```

## 作者

浙江同方 - 审计一部 - 朱佳楠
