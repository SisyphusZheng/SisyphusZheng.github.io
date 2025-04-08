#!/usr/bin/env -S deno run -A
/**
 * FreshPress CLI
 * 提供单命令安装与交互式初始化功能
 */

import { parse } from "https://deno.land/std@0.208.0/flags/mod.ts";
import {
  copy,
  emptyDir,
  ensureDir,
  exists,
} from "https://deno.land/std@0.208.0/fs/mod.ts";
import { join, resolve } from "https://deno.land/std@0.208.0/path/mod.ts";
import { dirname } from "https://deno.land/std@0.208.0/path/dirname.ts";
import { colors } from "https://deno.land/x/cliffy@v1.0.0-rc.3/ansi/colors.ts";
import {
  Input,
  Select,
  Checkbox,
  Confirm,
} from "https://deno.land/x/cliffy@v1.0.0-rc.3/prompt/mod.ts";

const VERSION = "0.3.0";

// 解析命令行参数
const args = parse(Deno.args, {
  boolean: ["help", "version", "force"],
  alias: { h: "help", v: "version", f: "force" },
});

// 显示帮助信息
if (args.help) {
  console.log(`
${colors.bold("FreshPress")} - 现代静态站点生成器 ${colors.green(`v${VERSION}`)}

${colors.bold("用法:")}
  ${colors.yellow("deno run -A -r https://freshpress.deno.dev")}
  ${colors.yellow("freshpress")} ${colors.dim("[命令] [选项]")}

${colors.bold("命令:")}
  ${colors.yellow("init")}                  初始化新项目
  ${colors.yellow("dev")}                   启动开发服务器
  ${colors.yellow("build")}                 构建静态站点
  ${colors.yellow("preview")}               预览构建结果
  ${colors.yellow("deploy")}                部署站点

${colors.bold("选项:")}
  ${colors.yellow("-h, --help")}            显示帮助信息
  ${colors.yellow("-v, --version")}         显示版本信息
  ${colors.yellow("-f, --force")}           强制重写现有文件
  `);
  Deno.exit(0);
}

// 显示版本信息
if (args.version) {
  console.log(`FreshPress v${VERSION}`);
  Deno.exit(0);
}

/**
 * 创建项目结构
 */
async function createProjectStructure(projectName: string, options: any) {
  // 创建主目录
  await ensureDir(projectName);

  // 创建项目子目录
  const directories = [
    ".freshpress",
    ".freshpress/theme",
    ".freshpress/plugins",
    "docs",
    "docs/guide",
    "docs/api",
    "public",
  ];

  for (const dir of directories) {
    await ensureDir(join(projectName, dir));
  }

  // 创建基本配置文件
  await Deno.writeTextFile(
    join(projectName, "freshpress.config.ts"),
    `// FreshPress 配置文件
export default {
  title: '${options.title}',
  description: '${options.description}',
  themeConfig: {
    nav: [
      { text: '指南', link: '/guide/' },
      { text: 'API', link: '/api/' },
    ],
    sidebar: [
      {
        text: '指南',
        items: [
          { text: '简介', link: '/guide/' },
          { text: '快速开始', link: '/guide/getting-started' },
        ]
      }
    ]
  }
};
`
  );

  // 创建示例指南文件
  await Deno.writeTextFile(
    join(projectName, "docs", "guide", "getting-started.md"),
    `# 快速开始

这是 ${options.title} 的入门指南。

## 安装

开始使用前，请确保你已经安装了 Deno:

\`\`\`bash
# 安装 Deno
curl -fsSL https://deno.land/x/install/install.sh | sh
\`\`\`

## 开发

启动开发服务器:

\`\`\`bash
deno task dev
\`\`\`

## 构建

构建静态站点:

\`\`\`bash
deno task build
\`\`\`
`
  );

  // 创建索引页
  await Deno.writeTextFile(
    join(projectName, "docs", "index.md"),
    `---
layout: home
hero:
  name: ${options.title}
  text: ${options.description}
  actions:
    - text: 快速开始
      link: /guide/getting-started
    - text: GitHub
      link: ${options.repository || "https://github.com/freshpress/freshpress"}
---

# 欢迎使用 ${options.title}

${options.description}
`
  );

  // 创建 deno.json
  await Deno.writeTextFile(
    join(projectName, "deno.json"),
    `{
  "tasks": {
    "dev": "deno run -A --unstable-sloppy-imports --watch=docs/,public/ https://freshpress.deno.dev/dev.ts",
    "build": "deno run -A --unstable-sloppy-imports https://freshpress.deno.dev/build.ts",
    "preview": "deno run -A --unstable-sloppy-imports https://freshpress.deno.dev/preview.ts",
    "deploy": "deno run -A --unstable-sloppy-imports https://freshpress.deno.dev/deploy.ts",
    "init": "deno run -A --unstable-sloppy-imports https://freshpress.deno.dev/cli.ts init"
  },
  "importMap": "https://freshpress.deno.dev/import_map.json",
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "preact",
    "allowImportingTsExtensions": true,
    "lib": ["dom", "dom.iterable", "dom.asynciterable", "deno.ns"]
  }
}`
  );

  // 创建 README.md
  await Deno.writeTextFile(
    join(projectName, "README.md"),
    `# ${options.title}

${options.description}

## 开发

\`\`\`bash
# 启动开发服务器
deno task dev
\`\`\`

## 构建

\`\`\`bash
# 构建静态站点
deno task build
\`\`\`

## 预览

\`\`\`bash
# 预览构建结果
deno task preview
\`\`\`

## 部署

\`\`\`bash
# 部署站点
deno task deploy
\`\`\`
`
  );
}

/**
 * 初始化项目
 */
async function initProject() {
  console.log(colors.bold("\n🍋 FreshPress 初始化向导\n"));

  // 如果项目不在空目录中，询问项目名称
  let projectDir = ".";
  const currentDirFiles = [...Deno.readDirSync(".")];
  const isEmpty =
    currentDirFiles.length === 0 ||
    (currentDirFiles.length === 1 && currentDirFiles[0].name === ".git");

  if (!isEmpty) {
    const createInCurrentDir = await Confirm.prompt({
      message: "当前目录不为空，是否要在当前目录初始化项目？",
      default: false,
    });

    if (!createInCurrentDir) {
      const projectName = await Input.prompt({
        message: "请输入项目名称:",
        default: "my-docs",
      });

      projectDir = projectName;

      // 检查目录是否已存在
      if (await exists(projectDir)) {
        const overwrite = await Confirm.prompt({
          message: `目录 "${projectDir}" 已存在，是否覆盖？`,
          default: false,
        });

        if (!overwrite) {
          console.log("❌ 操作取消");
          Deno.exit(1);
        }

        // 清空目录
        await emptyDir(projectDir);
      }
    }
  }

  // 收集站点信息
  const title = await Input.prompt({
    message: "站点名称:",
    default: "My Documentation",
  });

  const description = await Input.prompt({
    message: "站点描述:",
    default: "FreshPress powered documentation site",
  });

  const theme = await Select.prompt({
    message: "选择主题:",
    options: [
      { name: "默认", value: "default" },
      { name: "深色", value: "dark" },
      { name: "简约", value: "minimal" },
    ],
    default: "default",
  });

  const plugins = await Checkbox.prompt({
    message: "选择插件:",
    options: [
      { name: "搜索功能", value: "search", checked: true },
      { name: "SEO 优化", value: "seo", checked: true },
      { name: "国际化", value: "i18n" },
      { name: "图片优化", value: "image" },
      { name: "PWA 支持", value: "pwa" },
    ],
  });

  const repository = await Input.prompt({
    message: "仓库地址 (可选):",
    default: "",
  });

  // 创建项目
  console.log(colors.dim("\n创建项目结构..."));
  await createProjectStructure(projectDir, {
    title,
    description,
    theme,
    plugins,
    repository,
  });

  console.log(colors.green("\n✅ 项目初始化完成!\n"));
  console.log(`下一步:
  1. ${colors.yellow(`cd ${projectDir === "." ? "." : projectDir}`)}
  2. ${colors.yellow("deno task dev")} - 启动开发服务器
  3. 在浏览器中访问 ${colors.underline("http://localhost:8000")}
  
${colors.bold("编辑文件:")}
  • ${colors.dim("freshpress.config.ts")} - 配置站点
  • ${colors.dim("docs/")} - 编辑文档内容
  • ${colors.dim("public/")} - 存放静态资源
  
${colors.bold("了解更多:")}
  ${colors.underline("https://freshpress.deno.dev/docs")}
`);
}

// 主函数
async function main() {
  const command = args._[0]?.toString() || "init";

  switch (command) {
    case "init":
      await initProject();
      break;
    default:
      console.log(`未知命令: ${command}`);
      console.log("运行 --help 查看可用命令");
      Deno.exit(1);
  }
}

// 运行主函数
await main();
