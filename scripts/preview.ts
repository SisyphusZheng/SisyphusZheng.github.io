#!/usr/bin/env -S deno run -A

import { join, dirname } from "$std/path/mod.ts";
import { serve } from "$std/http/server.ts";
import { exists } from "$std/fs/exists.ts";

/**
 * FreshPress - 预览构建的静态站点
 *
 * 此脚本启动一个本地服务器来预览_site目录中的构建内容
 */

// 得到项目根目录的绝对路径
const ROOT_DIR = new URL("..", import.meta.url).pathname;

const SITE_DIR = "_site";
const PORT = 3000;

console.log("🍋 FreshPress - 正在启动预览服务器...");

// 检查_site目录是否存在
const siteExists = await exists(join(ROOT_DIR, SITE_DIR));
if (!siteExists) {
  console.error(
    `❌ 错误: ${SITE_DIR}目录不存在。请先运行 'deno task build' 构建站点。`
  );
  Deno.exit(1);
}

// 检查_site是否为目录
try {
  const siteInfo = await Deno.stat(join(ROOT_DIR, SITE_DIR));
  if (!siteInfo.isDirectory) {
    console.error(`❌ 错误: ${SITE_DIR}不是一个目录。`);
    Deno.exit(1);
  }
} catch (error) {
  console.error(`❌ 检查${SITE_DIR}目录时出错:`, error);
  Deno.exit(1);
}

console.log(`📂 找到${SITE_DIR}目录，准备提供静态文件...`);

// 启动静态文件服务器
serve(
  async (req: Request) => {
    const url = new URL(req.url);
    let path = url.pathname;

    // 默认提供index.html
    if (path === "/" || path === "") {
      path = "/index.html";
    }

    // 将路径解析为文件系统路径
    const fsPath = join(ROOT_DIR, SITE_DIR, path);

    try {
      const file = await Deno.readFile(fsPath);

      // 设置基本的内容类型
      let contentType = "text/plain";
      if (path.endsWith(".html")) contentType = "text/html";
      else if (path.endsWith(".css")) contentType = "text/css";
      else if (path.endsWith(".js")) contentType = "text/javascript";
      else if (path.endsWith(".json")) contentType = "application/json";
      else if (path.endsWith(".png")) contentType = "image/png";
      else if (path.endsWith(".jpg") || path.endsWith(".jpeg"))
        contentType = "image/jpeg";
      else if (path.endsWith(".svg")) contentType = "image/svg+xml";

      return new Response(file, {
        headers: {
          "content-type": contentType,
        },
      });
    } catch {
      // 如果文件不存在，尝试加载index.html（用于SPA路由）
      if (!path.endsWith(".html") && !path.includes(".")) {
        try {
          const indexPath = join(ROOT_DIR, SITE_DIR, "index.html");
          const indexFile = await Deno.readFile(indexPath);
          return new Response(indexFile, {
            headers: {
              "content-type": "text/html",
            },
          });
        } catch {
          // 如果index.html也不存在，返回404
          return new Response("404 - 未找到页面", { status: 404 });
        }
      }

      return new Response("404 - 未找到页面", { status: 404 });
    }
  },
  { port: PORT, hostname: "0.0.0.0" }
);

console.log(`🌐 预览服务器已启动: http://localhost:${PORT}`);
console.log(`🔍 正在提供来自${SITE_DIR}/的静态文件`);
console.log(`💡 提示: 按Ctrl+C停止服务器`);
