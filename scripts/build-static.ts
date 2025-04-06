// 简单的静态站点构建脚本

import { copy } from "https://deno.land/std@0.208.0/fs/copy.ts";
import { ensureDir, exists } from "https://deno.land/std@0.208.0/fs/mod.ts";
import { join, dirname } from "https://deno.land/std@0.208.0/path/mod.ts";

// 配置
const BUILD_DIR = "./_site";
const STATIC_DIR = "./static";

// 确保构建目录存在
async function setup() {
  console.log("开始构建静态网站...");

  // 检查并创建构建目录
  if (await exists(BUILD_DIR)) {
    // 如果目录已存在，不执行删除操作，仅保留原有内容
    console.log(`构建目录 ${BUILD_DIR} 已存在，将合并内容`);
  } else {
    await ensureDir(BUILD_DIR);
  }
}

// 复制静态资源
async function copyStaticFiles() {
  console.log(`正在复制静态资源从 ${STATIC_DIR} 到 ${BUILD_DIR}/static...`);
  await ensureDir(join(BUILD_DIR, "static"));
  await copy(STATIC_DIR, join(BUILD_DIR, "static"), { overwrite: true });
}

// 生成index.html文件
async function generateIndexFile() {
  console.log("生成index.html文件...");
  const indexHtml = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>郑治的个人网站</title>
  <link rel="stylesheet" href="/static/styles.css">
</head>
<body>
  <div id="root">
    <h1>静态站点生成测试</h1>
    <p>这是一个通过脚本生成的静态页面</p>
    <p>请替换为实际的静态内容</p>
  </div>
</body>
</html>`;

  await Deno.writeTextFile(join(BUILD_DIR, "index.html"), indexHtml);
}

// 主函数
async function main() {
  try {
    await setup();
    await copyStaticFiles();
    await generateIndexFile();

    console.log(`静态网站构建完成！输出目录: ${BUILD_DIR}`);
  } catch (error) {
    console.error("构建过程中出错:", error);
    Deno.exit(1);
  }
}

// 执行主函数
main();
