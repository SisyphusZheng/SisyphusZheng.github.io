#!/usr/bin/env -S deno run -A
/**
 * FreshPress静态站点生成脚本
 * 用于构建包含所有页面的静态HTML输出
 */
import { walk } from "https://deno.land/std@0.167.0/fs/walk.ts";
import { ensureDir } from "https://deno.land/std@0.167.0/fs/ensure_dir.ts";
import {
  join,
  dirname,
  basename,
  extname,
} from "https://deno.land/std@0.167.0/path/mod.ts";
import { serve } from "https://deno.land/std@0.140.0/http/server.ts";
import { copy } from "https://deno.land/std@0.167.0/fs/copy.ts";
import { getAllPosts, parseFrontMatter } from "../utils/blog.ts";
import { siteConfig } from "../data/config.ts";

// 配置
const OUTPUT_DIR = "./dist";
const SERVER_URL = "http://localhost:8000";
const ROUTES_DIR = "./routes";
const STATIC_DIR = "./static";
const LOCALES = ["zh-CN", "en-US"];

async function main() {
  console.log("🍋 FreshPress 静态站点生成器启动中...");

  // 确保输出目录存在
  await ensureDir(OUTPUT_DIR);

  // 启动Fresh服务器
  console.log("🚀 启动开发服务器...");
  const freshProcess = Deno.run({
    cmd: ["deno", "task", "start"],
    stdout: "piped",
    stderr: "piped",
  });

  // 等待服务器启动
  await new Promise((resolve) => setTimeout(resolve, 3000));

  try {
    // 复制静态文件
    console.log("📂 复制静态资源...");
    await copy(STATIC_DIR, join(OUTPUT_DIR, "static"), { overwrite: true });

    // 生成搜索索引
    console.log("🔍 生成搜索索引...");
    const searchIndexProcess = Deno.run({
      cmd: ["deno", "run", "-A", "scripts/generate-search-index.ts"],
      stdout: "piped",
      stderr: "piped",
    });

    const searchIndexStatus = await searchIndexProcess.status();
    if (!searchIndexStatus.success) {
      console.error("❌ 生成搜索索引失败");
      const stderr = new TextDecoder().decode(
        await searchIndexProcess.stderrOutput()
      );
      console.error(stderr);
    } else {
      console.log("✅ 搜索索引生成成功");
    }
    searchIndexProcess.close();

    // 获取所有路由
    console.log("🗺️ 分析路由...");
    const routeFiles = [];
    for await (const entry of walk(ROUTES_DIR)) {
      if (
        entry.isFile &&
        entry.name.endsWith(".tsx") &&
        !entry.name.startsWith("_")
      ) {
        routeFiles.push(entry.path);
      }
    }

    // 生成页面列表
    const pagesToRender = [];

    // 添加主页和基本页面
    pagesToRender.push("/");
    pagesToRender.push("/blog");
    pagesToRender.push("/projects");

    // 获取所有博客文章
    const blogPosts = await getAllPosts();

    // 为每个博客文章添加页面
    for (const post of blogPosts) {
      pagesToRender.push(`/blog/${post.slug}`);
    }

    // 项目页面
    for (const project of siteConfig.projects.items) {
      const slug = project.title
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]/g, "");
      pagesToRender.push(`/projects/${slug}`);
    }

    // 多语言支持
    const allPages = [];
    for (const page of pagesToRender) {
      for (const locale of LOCALES) {
        allPages.push({
          url: page,
          locale,
        });
      }
    }

    // 创建一个进度条
    let completed = 0;
    const total = allPages.length;

    // 渲染所有页面
    console.log(`🔨 开始生成${total}个页面...`);

    for (const { url, locale } of allPages) {
      const outputPath =
        url === "/"
          ? join(OUTPUT_DIR, locale, "index.html")
          : join(OUTPUT_DIR, locale, url, "index.html");

      // 确保目录存在
      await ensureDir(dirname(outputPath));

      try {
        // 构建完整URL(加上语言参数)
        const fullUrl = `${SERVER_URL}${url}?locale=${locale}`;

        // 获取页面HTML
        const response = await fetch(fullUrl);
        if (!response.ok) {
          console.error(
            `❌ 无法获取页面 ${url} (${locale}): ${response.status} ${response.statusText}`
          );
          continue;
        }

        // 获取HTML内容
        const html = await response.text();

        // 保存HTML文件
        await Deno.writeTextFile(outputPath, html);

        // 更新进度
        completed++;
        const percent = Math.floor((completed / total) * 100);
        const progressBar =
          "█".repeat(Math.floor(percent / 2)) +
          "░".repeat(50 - Math.floor(percent / 2));
        console.log(
          `[${progressBar}] ${percent}% (${completed}/${total}) - 生成 ${locale}${url}`
        );
      } catch (error) {
        console.error(`❌ 渲染 ${url} (${locale}) 时出错:`, error);
      }
    }

    // 为每个语言创建重定向文件
    for (const locale of LOCALES) {
      const redirectHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta http-equiv="refresh" content="0;url=/${locale}/">
            <link rel="canonical" href="/${locale}/">
            <title>Redirecting to /${locale}/</title>
          </head>
          <body>
            <p>Redirecting to <a href="/${locale}/">/${locale}/</a>...</p>
          </body>
        </html>
      `;

      await Deno.writeTextFile(join(OUTPUT_DIR, "index.html"), redirectHtml);
    }

    // 生成站点地图
    await generateSitemap(allPages);

    console.log("✅ 静态站点生成完成!");
  } catch (error) {
    console.error("❌ 生成过程中出错:", error);
  } finally {
    // 关闭服务器
    freshProcess.kill("SIGTERM");
    freshProcess.close();
  }
}

// 生成站点地图
async function generateSitemap(pages) {
  console.log("🗺️ 生成站点地图...");

  const siteUrl = siteConfig.site.url || "https://example.com";

  let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
  sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  // 添加所有页面到站点地图
  for (const { url, locale } of pages) {
    const fullUrl = `${siteUrl}/${locale}${url === "/" ? "" : url}`;

    sitemap += "  <url>\n";
    sitemap += `    <loc>${fullUrl}</loc>\n`;
    sitemap += "    <lastmod>" + new Date().toISOString() + "</lastmod>\n";

    // 首页更高的优先级
    if (url === "/") {
      sitemap += "    <priority>1.0</priority>\n";
    } else if (url.startsWith("/blog/")) {
      sitemap += "    <priority>0.8</priority>\n";
    } else {
      sitemap += "    <priority>0.6</priority>\n";
    }

    sitemap += "  </url>\n";
  }

  sitemap += "</urlset>";

  await Deno.writeTextFile(join(OUTPUT_DIR, "sitemap.xml"), sitemap);
}

// 启动主函数
if (import.meta.main) {
  main();
}
