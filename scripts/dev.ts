#!/usr/bin/env -S deno run -A --watch=static/,routes/,docs/,public/

import { join } from "$std/path/mod.ts";
import dev from "$fresh/dev.ts";
import config from "../fresh.config.ts";
import { parseMarkdownFiles } from "../core/content.ts";
// 导入配置助手
import { main as generateConfig } from "./config-helper.ts";

import "$std/dotenv/load.ts";

console.log("🍋 FreshPress 开发服务器启动中...");

// 得到项目根目录的绝对路径
const ROOT_DIR = new URL(".", import.meta.url).pathname;

// 检查是否存在 docs 目录
try {
  const docsPath = join(ROOT_DIR, "docs");
  const stats = await Deno.stat(docsPath);
  if (stats.isDirectory) {
    console.log("📚 找到文档目录: docs/");

    // 解析 Markdown 文件
    const docs = await parseMarkdownFiles("docs");
    console.log(`📄 加载了 ${docs.length} 个文档文件`);
  }
} catch (_error) {
  // docs 目录不存在，使用默认配置
  console.log("⚠️ 未找到 docs/ 目录，将使用默认配置");
}

// 检查配置文件
try {
  const configPath = join(ROOT_DIR, "freshpress.config.ts");
  await Deno.stat(configPath);
  console.log("⚙️ 找到配置文件: freshpress.config.ts");
} catch (_error) {
  console.log("⚠️ 未找到 freshpress.config.ts 文件，将使用默认配置");
}

// 使用正确的 URL 格式
const PROJECT_URL = new URL(".", import.meta.url);
const FRESH_GEN_PATH = "./fresh.gen.ts";

console.log(`🔍 使用生成文件路径: ${FRESH_GEN_PATH}`);

// 使用 URL 对象和相对路径
await dev(PROJECT_URL, FRESH_GEN_PATH, config);

console.log("🌐 开发服务器已启动: http://localhost:8000");
