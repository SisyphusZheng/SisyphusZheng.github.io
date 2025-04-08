#!/usr/bin/env -S deno run -A
/**
 * Project creator for FreshPress
 * Creates a new FreshPress project from templates
 */

import { copy } from "$std/fs/copy.ts";
import { ensureDir } from "$std/fs/ensure_dir.ts";
import { join, dirname } from "$std/path/mod.ts";
import { parse } from "$std/flags/mod.ts";

// 得到项目根目录的绝对路径
const ROOT_DIR = new URL("..", import.meta.url).pathname;

const VERSION = "0.3.0";

// 解析命令行参数
const args = parse(Deno.args, {
  boolean: ["help", "version"],
  alias: { h: "help", v: "version" },
  string: ["template"],
  default: { template: "default" },
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
  --template <template-name>     Use specified template (default: default)
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

// 检查项目名称是否合法
if (!/^[a-z0-9-]+$/.test(projectName)) {
  console.error(
    "❌ Error: Project name can only contain lowercase letters, numbers and hyphens"
  );
  Deno.exit(1);
}

// 模板类型
const template = args.template || "default";

// 创建项目目录结构
try {
  // 创建主项目目录
  await ensureDir(projectName);
  console.log(`📂 Created project directory: ${projectName}`);

  // 复制模板文件（如果存在）
  const templateDir = join(ROOT_DIR, "templates", template);
  try {
    const templateStat = await Deno.stat(templateDir);
    if (!templateStat.isDirectory) {
      throw new Error(`Template '${template}' is not a directory`);
    }

    await copy(templateDir, projectName, { overwrite: true });
    console.log(`📋 Copied template files from: ${template}`);
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      console.error(`❌ Error: Template '${template}' not found`);
      console.log(`Available templates: default`);
      Deno.exit(1);
    }
    throw error;
  }

  // 创建标准目录结构（如果模板中不存在）
  const dirs = [
    ".freshpress",
    ".freshpress/theme",
    ".freshpress/plugins",
    "docs",
    "docs/guide",
    "docs/api",
    "public",
    "plugins",
    "themes",
  ];

  for (const dir of dirs) {
    try {
      await Deno.stat(join(projectName, dir));
      // 目录已存在，跳过
    } catch (error) {
      if (error instanceof Deno.errors.NotFound) {
        await ensureDir(join(projectName, dir));
        console.log(`📁 Created directory: ${dir}`);
      } else {
        throw error;
      }
    }
  }

  // 替换配置文件中的项目名称
  try {
    const configPath = join(projectName, "freshpress.config.ts");
    const configContent = await Deno.readTextFile(configPath);
    const updatedContent = configContent.replace(
      /"My FreshPress Site"|"我的网站"/,
      `"${projectName}"`
    );
    await Deno.writeTextFile(configPath, updatedContent);
  } catch (error) {
    if (!(error instanceof Deno.errors.NotFound)) {
      console.warn(
        `⚠️ Warning: Could not update project name in config file: ${error.message}`
      );
    }
  }

  console.log(`\n✅ Project created successfully: ${projectName}`);
  console.log(`\n💡 Next steps:`);
  console.log(`   1. cd ${projectName}`);
  console.log(`   2. deno task dev     # Start development server`);
  console.log(`   3. deno task build   # Build static site`);
  console.log(`   4. deno task preview # Preview built site`);
} catch (error: unknown) {
  if (error instanceof Error) {
    console.error(`❌ Error creating project: ${error.message}`);
  } else {
    console.error(`❌ Error creating project: ${String(error)}`);
  }
  Deno.exit(1);
}
