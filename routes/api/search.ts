import { Handlers } from "https://deno.land/x/fresh@1.7.3/server.ts";
import { SearchPlugin } from "../../plugins/search/mod.ts";

// 创建搜索插件实例
const searchPlugin = new SearchPlugin({
  indexPath: "./docs/search-index.json",
  autoIndex: false,
  resultLimit: 20,
  highlightResults: true,
});

export const handler: Handlers = {
  /**
   * 处理搜索请求
   */
  async GET(req) {
    try {
      // 获取URL中的查询参数
      const url = new URL(req.url);
      const query = url.searchParams.get("q");

      // 验证查询参数
      if (!query || query.trim() === "") {
        return new Response(JSON.stringify({ error: "请提供搜索关键词" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      // 确保搜索插件已初始化
      if (!searchPlugin.initialized) {
        await searchPlugin.activate();
      }

      // 执行搜索
      console.log(`[API] 执行搜索: "${query}"`);
      const results = await searchPlugin.search(query);

      // 返回JSON响应
      return new Response(JSON.stringify(results), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "max-age=60", // 缓存1分钟
        },
      });
    } catch (error) {
      console.error("[API] 搜索处理错误:", error);

      // 返回错误响应
      return new Response(
        JSON.stringify({
          error: "搜索处理失败",
          message: error instanceof Error ? error.message : String(error),
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  },
};
