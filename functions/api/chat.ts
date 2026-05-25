interface Env {
  DEEPSEEK_API_KEY: string;
  ANIMAL_WORLD_FEEDBACK: KVNamespace;
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
  const apiKey = context.env.DEEPSEEK_API_KEY;

  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "未配置 API Key，请在 Cloudflare 环境变量中设置 DEEPSEEK_API_KEY" }),
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

  // 从 KV 读取所有用户反馈并融入提示词
  let feedbackText = "";
  try {
    const list = await context.env.ANIMAL_WORLD_FEEDBACK.list();
    const feedbacks = await Promise.all(
      list.keys.map(async (key) => {
        const value = await context.env.ANIMAL_WORLD_FEEDBACK.get(key.name);
        return value ? JSON.parse(value) : null;
      })
    );

    const valid = feedbacks.filter(Boolean);
    if (valid.length > 0) {
      feedbackText =
        "\n\n【以下是用户提交的动物世界设定补充，你必须严格遵循这些新增设定：】\n" +
        valid.map((f: any, i: number) => `${i + 1}. ${f.content}`).join("\n") +
        "\n【以上为用户补充的永久设定，请在实际对话中自然地融入这些内容。】";
    }
  } catch {
    // KV 读取失败时静默跳过
  }

  // 构建完整的消息列表
  const fullMessages: ChatMessage[] = [];
  if (systemPrompt) {
    fullMessages.push({
      role: "system",
      content: systemPrompt + feedbackText,
    });
  } else if (feedbackText) {
    fullMessages.push({ role: "system", content: feedbackText });
  }
  fullMessages.push(...messages);

  try {
    const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "deepseek-v4-flash",
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
