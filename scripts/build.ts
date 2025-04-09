#!/usr/bin/env -S deno run -A

import { ensureDir } from "$std/fs/ensure_dir.ts";
import { join } from "$std/path/mod.ts";
import { copy } from "$std/fs/copy.ts";
import "$std/dotenv/load.ts";
import config from "../fresh.config.ts";
import { parseMarkdownFiles } from "../core/content.ts";
// 导入配置助手
import { main as generateConfig } from "./config-helper.ts";

// 移除了对不存在模块的引用
// import { FreshConfig } from "$fresh/server.ts";
// import { Command } from "$fresh/src/command/mod.ts";

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

console.log("🏗️ 开始构建静态站点...");

// 执行Fresh构建命令
try {
  console.log("📦 执行Fresh构建命令...");

  const process = new Deno.Command(Deno.execPath(), {
    args: [
      "run",
      "-A",
      "--unstable-sloppy-imports",
      "--import-map=import_map.json",
      "https://deno.land/x/fresh@1.7.3/dev.ts",
      "build",
      "--output-dir",
      OUTPUT_DIR,
      "--static",
    ],
    cwd: ROOT_DIR,
    stdout: "inherit",
    stderr: "inherit",
  });

  const { code } = await process.output();

  if (code === 0) {
    console.log(`🏗️ Fresh构建完成，静态文件已生成到 ${OUTPUT_DIR}/ 目录`);
  } else {
    throw new Error(`构建失败，退出码: ${code}`);
  }
} catch (error) {
  console.error("❌ 构建失败:", error);
  Deno.exit(1);
}

// 复制静态资源，但不包括index.html
try {
  console.log("📦 开始复制静态资源...");
  const staticDir = join(ROOT_DIR, "static");
  const targetDir = join(OUTPUT_DIR);

  console.log(`📦 从 ${staticDir} 复制到 ${targetDir}，但跳过index.html`);

  // 自定义复制函数
  for await (const entry of Deno.readDir(staticDir)) {
    const sourcePath = join(staticDir, entry.name);
    const destPath = join(targetDir, entry.name);

    // 跳过index.html
    if (entry.name === "index.html") {
      console.log(`⏩ 跳过 index.html`);
      continue;
    }

    if (entry.isDirectory) {
      await copy(sourcePath, destPath, { overwrite: true });
    } else {
      await Deno.copyFile(sourcePath, destPath);
    }
    console.log(`✅ 已复制: ${entry.name}`);
  }

  console.log("✅ 静态资源复制完成");
} catch (error) {
  console.error("复制静态资源时出错:", error);
}

console.log(`✅ 静态站点已生成到 ${OUTPUT_DIR}/ 目录`);
console.log("💡 提示: 使用 'deno task preview' 预览构建结果");
console.log("🚀 提示: 使用 'deno task deploy' 部署到生产环境");
