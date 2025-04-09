import { h } from "preact";
import { Handlers, PageProps } from "$fresh/server.ts";
import { handler as homeHandler } from "../index.tsx";
import Home from "../index.tsx";

// 语言路由处理器
export const handler: Handlers = {
  async GET(req, ctx) {
    // 提取URL中的locale参数
    const locale = ctx.params.locale;
    console.log(`[LocaleRoute] 访问语言路径: ${locale}`);

    // 验证语言是否有效
    const validLocales: string[] = ["zh-CN", "en-US"];
    if (!validLocales.includes(locale)) {
      return new Response("不支持的语言", { status: 404 });
    }

    // 构建带有语言参数的请求
    const url = new URL(req.url);
    url.searchParams.set("lang", locale);
    const newRequest = new Request(url, req);

    // 委托给首页处理器处理
    return homeHandler.GET(newRequest, ctx);
  },
};

// 渲染组件保持与首页相同
export default Home;
