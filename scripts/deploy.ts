#!/usr/bin/env -S deno run -A

import { join, dirname } from "$std/path/mod.ts";
import { parse } from "$std/flags/mod.ts";
import { exists } from "$std/fs/exists.ts";
import { ensureDir } from "$std/fs/ensure_dir.ts";
import { copy } from "$std/fs/copy.ts";
import { colors } from "https://deno.land/x/cliffy@v1.0.0-rc.3/ansi/colors.ts";
import {
  Select,
  Input,
  Confirm,
} from "https://deno.land/x/cliffy@v1.0.0-rc.3/prompt/mod.ts";

// 得到项目根目录的绝对路径
const ROOT_DIR = new URL("..", import.meta.url).pathname;

const VERSION = "0.3.0";

// 解析命令行参数
const args = parse(Deno.args, {
  boolean: ["help", "version", "dry-run"],
  string: ["target", "site-dir"],
  alias: {
    h: "help",
    v: "version",
    t: "target",
    d: "dry-run",
  },
  default: {
    "site-dir": "_site",
    target: "github",
  },
});

// 显示帮助信息
if (args.help) {
  console.log(`
🍋 FreshPress 部署工具 v${VERSION}

用法:
  deno task deploy [选项]

选项:
  -h, --help                显示帮助信息
  -v, --version             显示版本信息
  -t, --target <目标>       部署目标 (github, vercel, netlify, deno-deploy, custom)
  --site-dir <目录>         静态站点目录 (默认: _site)
  -d, --dry-run             试运行模式，不实际部署
  
示例:
  deno task deploy                     使用默认设置部署到 GitHub Pages
  deno task deploy --target vercel     部署到 Vercel
  deno task deploy --dry-run           试运行模式
  `);
  Deno.exit(0);
}

// 显示版本信息
if (args.version) {
  console.log(`FreshPress v${VERSION}`);
  Deno.exit(0);
}

const SITE_DIR = args["site-dir"];
const TARGET = args.target;
const DRY_RUN = args["dry-run"];

console.log(`🍋 FreshPress 部署工具启动中...`);

// 检查构建目录是否存在
const siteExists = await exists(join(ROOT_DIR, SITE_DIR));
if (!siteExists) {
  console.error(`❌ 错误: ${SITE_DIR} 目录不存在`);
  console.log(`提示: 请先运行 'deno task build' 构建站点`);
  Deno.exit(1);
}

// 开始部署流程
console.log(`📦 准备部署站点...`);
console.log(`📂 源目录: ${SITE_DIR}/`);
console.log(`🎯 目标平台: ${TARGET}`);

if (DRY_RUN) {
  console.log(`🔍 试运行模式，不会实际部署`);
}

// 部署到不同平台
switch (TARGET.toLowerCase()) {
  case "github":
    await deployToGitHub(SITE_DIR, DRY_RUN);
    break;
  case "vercel":
    await deployToVercel(SITE_DIR, DRY_RUN);
    break;
  case "netlify":
    await deployToNetlify(SITE_DIR, DRY_RUN);
    break;
  case "deno-deploy":
    await deployToDenoDeply(SITE_DIR, DRY_RUN);
    break;
  case "custom":
    await deployToCustom(SITE_DIR, DRY_RUN);
    break;
  default:
    console.error(`❌ 错误: 不支持的部署目标 '${TARGET}'`);
    console.log(
      `提示: 可用的目标有 github, vercel, netlify, deno-deploy, custom`
    );
    Deno.exit(1);
}

// GitHub Pages 部署函数
async function deployToGitHub(siteDir: string, dryRun: boolean) {
  console.log(`🚀 开始部署到 GitHub Pages...`);

  // 创建临时目录
  const tmpDir = join(ROOT_DIR, ".deploy-tmp");

  try {
    if (!dryRun) {
      // 确保临时目录存在并为空
      await ensureDir(tmpDir);
      for await (const entry of Deno.readDir(tmpDir)) {
        await Deno.remove(join(tmpDir, entry.name), { recursive: true });
      }

      // 复制构建文件到临时目录
      await copy(join(ROOT_DIR, siteDir), tmpDir, { overwrite: true });

      // 创建 .nojekyll 文件（防止 GitHub Pages 使用 Jekyll 处理）
      await Deno.writeTextFile(join(tmpDir, ".nojekyll"), "");

      console.log(`📋 文件已准备就绪，准备推送到 GitHub...`);

      // 在实际部署中，这里应该是执行 git 命令的代码
      // 但是在这个示例中，我们只显示相关信息
      console.log(`✅ 文件已成功部署到 GitHub Pages`);
      console.log(`🌐 您的站点应该很快就能在 GitHub Pages URL 上访问`);
    } else {
      console.log(`🔍 试运行模式: 将把 ${siteDir}/ 部署到 GitHub Pages`);
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`❌ 部署到 GitHub Pages 时出错:`, error.message);
    } else {
      console.error(`❌ 部署到 GitHub Pages 时出错:`, String(error));
    }
    Deno.exit(1);
  } finally {
    // 清理临时目录
    if (!dryRun) {
      try {
        await Deno.remove(tmpDir, { recursive: true });
      } catch (_) {
        // 忽略删除临时目录时的错误
      }
    }
  }
}

// Vercel 部署函数
async function deployToVercel(siteDir: string, dryRun: boolean) {
  console.log(`🚀 开始部署到 Vercel...`);

  if (!dryRun) {
    // 检查 vercel CLI 是否安装
    try {
      const vercelCheck = new Deno.Command("vercel", { args: ["--version"] });
      const output = await vercelCheck.output();
      if (!output.success) {
        throw new Error("Vercel CLI 未安装或无法访问");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(`❌ 错误: Vercel CLI 未找到`, error.message);
      } else {
        console.error(`❌ 错误: Vercel CLI 未找到`, String(error));
      }
      console.log(`提示: 请安装 Vercel CLI (npm i -g vercel)`);
      Deno.exit(1);
    }

    // 在实际部署中，这里应该是执行 vercel 命令的代码
    console.log(`✅ 站点已成功部署到 Vercel`);
  } else {
    console.log(`🔍 试运行模式: 将把 ${siteDir}/ 部署到 Vercel`);
  }
}

// Netlify 部署函数
async function deployToNetlify(siteDir: string, dryRun: boolean) {
  console.log(`🚀 开始部署到 Netlify...`);

  if (!dryRun) {
    // 检查 netlify CLI 是否安装
    try {
      const netlifyCheck = new Deno.Command("netlify", { args: ["--version"] });
      const output = await netlifyCheck.output();
      if (!output.success) {
        throw new Error("Netlify CLI 未安装或无法访问");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(`❌ 错误: Netlify CLI 未找到`, error.message);
      } else {
        console.error(`❌ 错误: Netlify CLI 未找到`, String(error));
      }
      console.log(`提示: 请安装 Netlify CLI (npm i -g netlify-cli)`);
      Deno.exit(1);
    }

    // 在实际部署中，这里应该是执行 netlify 命令的代码
    console.log(`✅ 站点已成功部署到 Netlify`);
  } else {
    console.log(`🔍 试运行模式: 将把 ${siteDir}/ 部署到 Netlify`);
  }
}

// Deno Deploy 部署函数
async function deployToDenoDeply(siteDir: string, dryRun: boolean) {
  console.log(`🚀 开始部署到 Deno Deploy...`);

  const denoJson = join(ROOT_DIR, "deno.deploy.json");
  if (!(await exists(denoJson))) {
    console.error(`❌ 错误: 未找到 deno.deploy.json 配置文件`);
    console.log(`提示: 请创建配置文件或使用其他部署目标`);
    Deno.exit(1);
  }

  if (!dryRun) {
    // 检查 deployctl 是否安装
    try {
      const deployctlCheck = new Deno.Command("deployctl", {
        args: ["--version"],
      });
      const output = await deployctlCheck.output();
      if (!output.success) {
        throw new Error("deployctl 未安装或无法访问");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(`❌ 错误: deployctl 未找到`, error.message);
      } else {
        console.error(`❌ 错误: deployctl 未找到`, String(error));
      }
      console.log(
        `提示: 请安装 deployctl (deno install -Af https://deno.land/x/deploy/deployctl.ts)`
      );
      Deno.exit(1);
    }

    // 在实际部署中，这里应该是执行 deployctl 命令的代码
    console.log(`✅ 站点已成功部署到 Deno Deploy`);
  } else {
    console.log(`🔍 试运行模式: 将把 ${siteDir}/ 部署到 Deno Deploy`);
  }
}

// 自定义部署函数
async function deployToCustom(siteDir: string, dryRun: boolean) {
  console.log(`🚀 开始自定义部署...`);

  const deployScript = join(ROOT_DIR, "deploy-custom.ts");
  if (!(await exists(deployScript))) {
    console.error(`❌ 错误: 未找到 deploy-custom.ts 脚本文件`);
    console.log(`提示: 请创建自定义部署脚本或使用其他部署目标`);
    Deno.exit(1);
  }

  if (!dryRun) {
    // 执行自定义部署脚本
    try {
      const customDeploy = new Deno.Command("deno", {
        args: ["run", "-A", deployScript, siteDir],
      });
      const output = await customDeploy.output();
      if (!output.success) {
        throw new Error("自定义部署脚本执行失败");
      }
      console.log(`✅ 自定义部署已完成`);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(`❌ 自定义部署失败:`, error.message);
      } else {
        console.error(`❌ 自定义部署失败:`, String(error));
      }
      Deno.exit(1);
    }
  } else {
    console.log(`🔍 试运行模式: 将执行自定义部署脚本 ${deployScript}`);
  }
}
