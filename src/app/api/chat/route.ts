import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const apiKey = process.env.SILICONFLOW_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "请在 .env.local 中设置 SILICONFLOW_API_KEY，或部署到 Cloudflare 后通过环境变量配置" },
      { status: 500 }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "请求格式错误" }, { status: 400 });
  }

  const { messages, systemPrompt } = body;

  if (!messages || !Array.isArray(messages)) {
    return NextResponse.json({ error: "缺少 messages 字段" }, { status: 400 });
  }

  const fullMessages = [];
  if (systemPrompt) {
    fullMessages.push({ role: "system" as const, content: systemPrompt });
  }
  fullMessages.push(...messages);

  try {
    const response = await fetch("https://api.siliconflow.cn/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "Qwen/Qwen2.5-7B-Instruct",
        messages: fullMessages,
        temperature: 0.9,
        max_tokens: 512,
        stream: false,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error?.message || "API 请求失败" },
        { status: response.status }
      );
    }

    const reply = data.choices?.[0]?.message?.content || "（小动物打了个盹，没听清...）";
    return NextResponse.json({ reply });
  } catch (err: any) {
    return NextResponse.json({ error: "请求 AI 服务失败：" + err.message }, { status: 502 });
  }
}
