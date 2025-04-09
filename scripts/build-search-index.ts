#!/usr/bin/env -S deno run -A

/**
 * 搜索索引构建脚本
 * 此脚本用于生成网站的搜索索引文件，专门针对博客、项目和简历
 */

import { SearchPlugin } from "../plugins/search/mod.ts";

console.log("🔍 开始构建搜索索引...");

const searchPlugin = new SearchPlugin({
  // 自定义配置
  indexPath: "./docs/search-index.json",
  autoIndex: true,
  contentDirs: [
    "./routes/blog", // 博客页面
    "./routes/projects", // 项目页面
    "./routes/resume.tsx", // 简历页面
    "./routes/index.tsx", // 首页
    "./docs/blog", // 博客内容
    "./docs/projects", // 项目内容
    "./README.md", // 项目说明
    "./CHANGELOG.md", // 更新日志
  ],
  highlightResults: true,
  resultLimit: 20,
  weights: {
    title: 3.0, // 标题权重更高
    content: 1.0,
    tags: 2.0, // 标签权重提高
    description: 2.5, // 描述权重提高
  },
});

// 手动添加的额外内容
const manualContent = [
  {
    id: "blog",
    title: "博客",
    url: "/blog",
    content:
      "查看所有博客文章和最新动态，了解我们的技术分享和见解。Fresh框架搭建的现代静态站点。",
    date: new Date().toISOString(),
    tags: ["博客", "文章", "技术", "分享", "Fresh"],
    meta: {
      type: "page",
      description: "博客首页 - 使用Fresh框架构建",
    },
  },
  {
    id: "projects",
    title: "项目",
    url: "/projects",
    content:
      "浏览所有项目作品集，查看我们的开源贡献和创新项目。基于Fresh和Deno构建的现代Web应用。",
    date: new Date().toISOString(),
    tags: ["项目", "作品集", "开源", "案例", "Fresh", "Deno"],
    meta: {
      type: "page",
      description: "项目展示页面 - Fresh框架驱动",
    },
  },
  {
    id: "resume",
    title: "简历",
    url: "/resume",
    content:
      "个人简历，包含工作经历、教育背景、技能和项目经验等详细信息。使用Fresh框架开发的响应式简历页面。",
    date: new Date().toISOString(),
    tags: ["简历", "工作", "技能", "经历", "Fresh"],
    meta: {
      type: "page",
      description: "个人简历页面 - 基于Fresh框架",
    },
  },
  {
    id: "freshpress",
    title: "FreshPress - 基于Fresh的现代静态站点生成器",
    url: "/",
    content:
      "FreshPress是一个基于Fresh框架的现代静态站点生成器，专为构建快速、灵活、SEO友好的网站而设计。Fresh是Deno生态系统中的一个轻量级Web框架，提供了零配置、零构建时间的开发体验。FreshPress扩展了Fresh的功能，提供了更多开箱即用的特性，如博客支持、项目展示、国际化、主题系统和插件架构。",
    date: new Date().toISOString(),
    tags: ["FreshPress", "Fresh", "Deno", "静态站点", "框架"],
    meta: {
      type: "home",
      description: "FreshPress - 构建在Fresh框架之上的静态站点生成器",
    },
  },
];

try {
  console.log("⚙️ 初始化搜索插件...");
  await searchPlugin.activate();

  console.log("🔄 开始重建索引...");
  await searchPlugin.rebuildIndex();

  // 手动添加额外内容
  console.log("📝 添加手动索引内容...");
  for (const content of manualContent) {
    console.log(`- 添加: ${content.title}`);
    await searchPlugin.addToIndex(content);
  }

  console.log("✅ 搜索索引构建完成！");
} catch (error) {
  console.error("❌ 搜索索引构建失败:", error);
  Deno.exit(1);
}
