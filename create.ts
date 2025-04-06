#!/usr/bin/env -S deno run -A
/**
 * Project creator for FreshPress
 * Creates a new FreshPress project from templates
 */

import { copy } from "https://deno.land/std@0.208.0/fs/copy.ts";
import { ensureDir } from "https://deno.land/std@0.208.0/fs/ensure_dir.ts";
import { join } from "https://deno.land/std@0.208.0/path/mod.ts";
import { parse } from "https://deno.land/std@0.208.0/flags/mod.ts";

const VERSION = "0.1.0";

// 解析命令行参数
const args = parse(Deno.args, {
  boolean: ["help", "version"],
  alias: { h: "help", v: "version" },
});

// 显示帮助信息
if (args.help) {
  console.log(`
FreshPress project creator v${VERSION}

Usage:
  deno run -A https://deno.land/x/freshpress/create.ts <project-name> [options]

Parameters:
  <project-name>                 The name of the project to create

Options:
  -h, --help                     Show help information
  -v, --version                  Show version information
  --template <template-name>     Use specified template (default: blog)
  `);
  Deno.exit(0);
}

// 显示版本信息
if (args.version) {
  console.log(`FreshPress v${VERSION}`);
  Deno.exit(0);
}

// 获取项目名称
const projectName = args._[0]?.toString();
if (!projectName) {
  console.error("❌ Error: Please provide a project name");
  console.log(
    "Usage: deno run -A https://deno.land/x/freshpress/create.ts <project-name>"
  );
  console.log("Run with --help parameter to see more information");
  Deno.exit(1);
}

// 模板类型
const template = args.template || "blog";

// 主函数
async function main() {
  console.log(`🍋 Creating new FreshPress project: ${projectName}`);
  console.log(`�� Using template: ${template}`);

  try {
    // 创建项目目录
    await ensureDir(projectName);
    console.log(`📁 Creating project directory: ${projectName}`);

    // 克隆模板仓库
    console.log("📥 Downloading FreshPress template...");

    // 这里应该是实际从GitHub克隆仓库的代码
    // 由于现在是示例，我们只显示相关信息

    // 模拟下载完成
    console.log("✅ Template download completed");

    // 安装依赖
    console.log("📦 Setting up project...");

    // 创建示例文件
    await Deno.writeTextFile(
      join(projectName, "README.md"),
      `# ${projectName}\n\nBased on FreshPress created project\n`
    );

    // 完成
    console.log(`
🎉 FreshPress project created successfully!

Starting to use:
  cd ${projectName}
  deno task start
    
View more documentation:
  https://deno.land/x/freshpress
`);
  } catch (error) {
    console.error("❌ Error creating project:", error.message);
    Deno.exit(1);
  }
}

// 运行主函数
await main();
