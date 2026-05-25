interface Env {
  ANIMAL_WORLD_FEEDBACK: KVNamespace;
}

// GET /api/feedback - 获取所有反馈
export const onRequestGet: PagesFunction<Env> = async (context) => {
  try {
    const list = await context.env.ANIMAL_WORLD_FEEDBACK.list();
    const items = await Promise.all(
      list.keys.map(async (key) => {
        const value = await context.env.ANIMAL_WORLD_FEEDBACK.get(key.name);
        return JSON.parse(value || "{}");
      })
    );
    // 按时间倒序
    items.sort((a, b) => (b.time || 0) - (a.time || 0));
    return new Response(JSON.stringify({ items }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

// POST /api/feedback - 提交反馈
export const onRequestPost: PagesFunction<Env> = async (context) => {
  let body: { content: string; category?: string };
  try {
    body = await context.request.json();
  } catch {
    return new Response(JSON.stringify({ error: "请求格式错误" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!body.content || !body.content.trim()) {
    return new Response(JSON.stringify({ error: "内容不能为空" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const entry = {
    content: body.content.trim(),
    category: body.category || "通用",
    time: Date.now(),
  };

  const key = `feedback_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  try {
    await context.env.ANIMAL_WORLD_FEEDBACK.put(key, JSON.stringify(entry));
    return new Response(JSON.stringify({ success: true, entry }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: "保存失败：" + err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
