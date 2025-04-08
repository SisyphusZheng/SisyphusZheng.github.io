/**
 * FreshPress核心模块
 * 导出所有核心接口和类型
 */

// 导出内容管理接口
export * from "./content.ts";

// 导出主题系统接口
export * from "./theme.ts";

// 导出插件系统接口
export * from "./plugin.ts";

// 导出构建系统接口
export * from "./build.ts";

// FreshPress版本
export const VERSION = "0.3.0";

// FreshPress信息
export const FRESHPRESS_INFO = {
  name: "FreshPress",
  description: "A modern static site generator based on Fresh framework",
  repository: "https://github.com/username/freshpress",
  author: "FreshPress Team",
  license: "MIT",
};

/**
 * 创建Fresh配置
 * @param options 配置选项
 * @returns Fresh配置
 */
export async function createFreshConfig(options: {
  rootDir: string;
  config: any;
}) {
  const { rootDir, config } = options;

  console.log("配置选项:", options);

  // 创建一个模拟的处理函数
  const handle = async (req: Request): Promise<Response> => {
    const url = new URL(req.url);
    const path = url.pathname;

    // 简单的路由处理逻辑
    if (path === "/") {
      return new Response(
        `
        <!DOCTYPE html>
        <html>
          <head>
            <title>${config.site?.title || "FreshPress Site"}</title>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
          </head>
          <body>
            <h1>Welcome to FreshPress!</h1>
            <p>This is a placeholder page. Your content will appear here.</p>
          </body>
        </html>
      `,
        {
          headers: {
            "content-type": "text/html; charset=utf-8",
          },
        }
      );
    }

    // 返回404
    return new Response("Not Found", { status: 404 });
  };

  return {
    handle,
  };
}
