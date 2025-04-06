#!/usr/bin/env -S deno run -A

/**
 * FreshPress CLI 工具
 * 提供构建和启动等常用操作
 */

import { parse } from "https://deno.land/std@0.208.0/flags/mod.ts";

// 解析命令行参数
const args = parse(Deno.args, {
  boolean: ["help"],
  alias: { h: "help" },
});

// 显示帮助信息
function showHelp() {
  console.log(`
FreshPress CLI - 项目管理工具

用法:
  freshpress [命令] [选项]

命令:
  start       启动开发服务器
  build       构建静态网站
  index       生成搜索索引
  help        显示帮助信息

选项:
  -h, --help  显示帮助信息

示例:
  freshpress start    # 启动开发服务器
  freshpress build    # 构建静态网站
  freshpress index    # 生成搜索索引
`);
}

// 执行 Deno 任务
async function runTask(taskName: string) {
  const command = new Deno.Command("deno", {
    args: ["task", taskName],
    stdout: "inherit",
    stderr: "inherit",
  });

  const process = command.spawn();
  const status = await process.status;

  if (!status.success) {
    console.error(`❌ 任务 "${taskName}" 执行失败`);
    Deno.exit(1);
  }
}

// 主函数
async function main() {
  const command = args._[0] as string | undefined;

  // 如果请求帮助或没有提供命令，显示帮助信息
  if (args.help || !command) {
    showHelp();
    Deno.exit(0);
  }

  // 根据命令执行相应操作
  switch (command) {
    case "start":
      console.log("🚀 启动开发服务器...");
      await runTask("start");
      break;

    case "build":
      console.log("🏗️ 开始构建静态网站...");
      await runTask("build");
      break;

    case "index":
      console.log("🔍 生成搜索索引...");
      await runTask("gen-index");
      break;

    case "help":
      showHelp();
      break;

    default:
      console.error(`❌ 未知命令: "${command}"`);
      showHelp();
      Deno.exit(1);
  }
}

// 执行主函数
if (import.meta.main) {
  main();
}
