#!/usr/bin/env -S deno run -A

import { start } from "$fresh/server.ts";
import manifest from "./fresh.gen.ts";
import config from "./fresh.config.ts";
import { join } from "$std/path/mod.ts";
import { exists } from "$std/fs/exists.ts";

/**
 * FreshPress - Modern static site generator based on Fresh framework
 *
 * Usage:
 * 1. Development: deno task dev
 * 2. Build: deno task build
 * 3. Preview: deno task preview
 * 4. Deploy: deno task deploy
 */

console.log("🍋 FreshPress - 正在启动服务器...");

// 收集环境变量
const PORT = Deno.env.get("PORT") || "8000";
const DEBUG = Deno.env.get("DEBUG") === "true";

// 检查项目结构
try {
  // 检查是否存在 docs 目录
  const docsExists = await exists("docs");
  if (docsExists) {
    console.log("📚 找到文档目录: docs/");
  }

  // 检查是否存在 freshpress.config.ts 文件
  const configExists = await exists("freshpress.config.ts");
  if (configExists) {
    console.log("⚙️ 找到配置文件: freshpress.config.ts");
  }
} catch (error) {
  console.error("检查项目结构时出错:", error);
}

// 环境信息
if (DEBUG) {
  console.log(`启动服务器，端口: ${PORT}`);
  console.log(
    `环境: ${Deno.env.get("DENO_DEPLOYMENT_ID") ? "Deno Deploy" : "本地开发"}`
  );
}

// 启动Fresh服务器
await start(manifest, { ...config.plugins, port: Number(PORT) });
console.log(`🌐 服务器已启动: http://localhost:${PORT}`);
