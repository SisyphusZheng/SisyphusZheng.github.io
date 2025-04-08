import { Handlers } from "$fresh/server.ts";
import { siteConfig } from "../../../docs/config.ts";
import { config } from "../../../freshpress.config.ts";

/**
 * 获取已启用插件列表的API
 */
export const handler: Handlers = {
  async GET(req, ctx) {
    try {
      // 从根目录配置文件获取已启用的插件列表
      const enabledPlugins = config.plugins.enabled || [];

      console.log(`[API] 返回已启用插件列表: ${enabledPlugins.join(", ")}`);

      // 返回启用的插件列表
      return new Response(JSON.stringify(enabledPlugins), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, must-revalidate",
        },
      });
    } catch (error) {
      console.error("[API] 获取已启用插件列表失败:", error);
      console.log("[API] 尝试从siteConfig获取插件列表...");

      try {
        // 从siteConfig获取插件列表作为备份
        const fallbackPlugins = siteConfig.plugins.enabled || [];
        return new Response(JSON.stringify(fallbackPlugins), {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        });
      } catch (fallbackError) {
        console.error("[API] 从siteConfig获取插件列表失败:", fallbackError);

        // 发生错误时，默认返回全部可能的插件（以防止UI出现问题）
        return new Response(
          JSON.stringify(["blog", "search", "projects", "resume", "i18n"]),
          {
            status: 200,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      }
    }
  },
};
