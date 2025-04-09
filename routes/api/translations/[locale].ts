import { Handlers } from "$fresh/server.ts";
import { join } from "https://deno.land/std/path/mod.ts";

export const handler: Handlers = {
  async GET(_req, ctx) {
    try {
      // 获取请求的语言
      const locale = ctx.params.locale as string;
      console.log(`[API] 收到翻译请求, 语言: ${locale}`);

      // 验证语言参数
      if (!locale || !["en-US", "zh-CN"].includes(locale)) {
        return new Response(JSON.stringify({ error: "不支持的语言" }), {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        });
      }

      // 使用绝对路径从文件系统读取翻译文件
      const filePath = join(
        Deno.cwd(),
        "docs",
        "translations",
        `${locale}.json`
      );
      console.log(`[API] 尝试读取翻译文件: ${filePath}`);

      try {
        const fileContent = await Deno.readTextFile(filePath);
        console.log(`[API] 成功读取翻译文件: ${filePath}`);

        // 尝试解析JSON以确保它是有效的
        const translations = JSON.parse(fileContent);

        // 返回翻译数据，添加CORS头
        return new Response(JSON.stringify(translations), {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-cache, no-store, must-revalidate",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET",
            "Access-Control-Allow-Headers": "Content-Type",
          },
        });
      } catch (fileError) {
        console.error(`[API] 无法读取或解析翻译文件: ${filePath}`, fileError);
        return new Response(JSON.stringify({ error: "翻译文件不存在或无效" }), {
          status: 404,
          headers: {
            "Content-Type": "application/json",
          },
        });
      }
    } catch (error) {
      console.error("[API] 处理翻译请求时出错:", error);
      return new Response(JSON.stringify({ error: "服务器内部错误" }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
  },
};
