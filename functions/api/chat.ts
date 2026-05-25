interface Env {
  SILICONFLOW_API_KEY: string;
}

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface ChatRequest {
  messages: ChatMessage[];
  systemPrompt?: string;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const apiKey = context.env.SILICONFLOW_API_KEY;

  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "未配置 API Key，请在 Cloudflare 环境变量中设置 SILICONFLOW_API_KEY" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  let body: ChatRequest;
  try {
    body = await context.request.json();
  } catch {
    return new Response(
      JSON.stringify({ error: "请求格式错误" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const { messages, systemPrompt } = body;

  if (!messages || !Array.isArray(messages)) {
    return new Response(
      JSON.stringify({ error: "缺少 messages 字段" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  // 构建完整的消息列表
  const fullMessages: ChatMessage[] = [];
  if (systemPrompt) {
    fullMessages.push({ role: "system", content: systemPrompt });
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

    const data: any = await response.json();

    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: data.error?.message || "API 请求失败" }),
        { status: response.status, headers: { "Content-Type": "application/json" } }
      );
    }

    const reply = data.choices?.[0]?.message?.content || "（小动物打了个盹，没听清...）";

    return new Response(
      JSON.stringify({ reply }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: "请求 AI 服务失败：" + err.message }),
      { status: 502, headers: { "Content-Type": "application/json" } }
    );
  }
};
