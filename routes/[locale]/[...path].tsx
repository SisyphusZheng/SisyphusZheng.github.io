import { h } from "preact";
import { Handlers, PageProps } from "$fresh/server.ts";

// 语言子路径处理
export const handler: Handlers = {
  async GET(req, ctx) {
    // 获取语言和路径
    const locale = ctx.params.locale;
    const path = ctx.params.path || "";
    console.log(`[LocaleRoute] 访问语言路径: ${locale}, 子路径: ${path}`);

    // 验证语言是否有效
    const validLocales: string[] = ["zh-CN", "en-US"];
    if (!validLocales.includes(locale)) {
      return new Response("不支持的语言", { status: 404 });
    }

    // 构建新的URL路径，不带语言前缀
    const url = new URL(req.url);
    url.pathname = `/${path}`;
    url.searchParams.set("lang", locale);

    try {
      // 尝试直接使用Fresh的内部路由系统处理
      // 这会将请求重定向到不带语言前缀的路由
      return Response.redirect(url, 307);
    } catch (error) {
      console.error(`[LocaleRoute] 路由处理错误:`, error);
      return new Response("内部服务器错误", { status: 500 });
    }
  },
};

// 渲染函数 - 在SSR模式下实际不会被调用，由目标路由渲染
export default function LocalePath({ params }: PageProps) {
  const path = params?.path || "";
  return (
    <div>
      <h1>正在重定向到 {path}...</h1>
    </div>
  );
}
