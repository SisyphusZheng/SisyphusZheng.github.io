#!/usr/bin/env -S deno run -A

import { build } from "$fresh/server.ts";
import { join, dirname } from "$std/path/mod.ts";
import { ensureDir } from "$std/fs/ensure_dir.ts";
import { copy } from "$std/fs/copy.ts";
import config from "../fresh.config.ts";
import { parseMarkdownFiles } from "../core/content.ts";
// 导入配置助手
import { main as generateConfig } from "./config-helper.ts";

import "$std/dotenv/load.ts";

console.log("🍋 FreshPress 静态站点构建开始...");

// 生成客户端配置文件
console.log("⚙️ 生成客户端配置文件...");
try {
  await generateConfig();
  console.log("✅ 客户端配置文件生成成功");
} catch (error) {
  console.error("❌ 生成客户端配置文件失败:", error);
}

// 得到项目根目录的绝对路径
const ROOT_DIR = new URL("..", import.meta.url).pathname;

// 构建输出目录
const OUTPUT_DIR = "_site";

// 检查是否存在 docs 目录
try {
  const docsPath = join(ROOT_DIR, "docs");
  const stats = await Deno.stat(docsPath);
  if (stats.isDirectory) {
    console.log("📚 找到文档目录: docs/");

    // 解析 Markdown 文件
    const docs = await parseMarkdownFiles("docs");
    console.log(`📄 处理了 ${docs.length} 个文档文件`);
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

// 确保输出目录存在
await ensureDir(OUTPUT_DIR);

// 构建静态站点
const buildResult = await build({
  importMapURL: new URL("../import_map.json", import.meta.url).href,
  outDir: OUTPUT_DIR,
  config,
});

console.log(
  `🏗️ 构建完成，生成了 ${
    Object.keys(buildResult.export?.entries || {}).length
  } 个页面`
);

// 复制静态资源
try {
  const publicDir = join(ROOT_DIR, "public");
  const publicDirExists = await Deno.stat(publicDir).then(
    (stat) => stat.isDirectory,
    () => false
  );

  if (publicDirExists) {
    console.log("📦 复制 public/ 目录中的静态资源...");
    await copy(publicDir, join(OUTPUT_DIR, "public"), { overwrite: true });
  }
} catch (error) {
  console.error("复制静态资源时出错:", error);
}

console.log(`✅ 静态站点已生成到 ${OUTPUT_DIR}/ 目录`);
console.log("💡 提示: 使用 'deno task preview' 预览构建结果");
console.log("🚀 提示: 使用 'deno task deploy' 部署到生产环境");
