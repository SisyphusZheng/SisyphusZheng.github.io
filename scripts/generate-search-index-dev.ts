#!/usr/bin/env -S deno run -A
/**
 * 开发环境下的搜索索引生成器
 * 简化版本，优化速度，支持快速启动开发服务器
 */
import { ensureDir } from "https://deno.land/std@0.167.0/fs/ensure_dir.ts";
import { getAllPosts } from "../utils/blog.ts";
import { getAllProjects } from "../utils/projects.ts";
import { Locale } from "../utils/i18n.ts";

interface SearchIndexItem {
  id: string;
  type: "blog" | "project";
  title: string;
  content?: string;
  description?: string;
  tags?: string[];
  date?: string;
  url: string;
  locale?: Locale;
}

async function generateSearchIndexDev() {
  console.log("🔍 开始生成开发环境搜索索引...");
  const indexItems: SearchIndexItem[] = [];

  try {
    // 添加博客文章到索引
    const posts = await getAllPosts();
    console.log(`📚 处理 ${posts.length} 篇博客文章`);

    for (const post of posts) {
      indexItems.push({
        id: `blog-${post.slug}`,
        type: "blog",
        title: post.title,
        content: post.content.slice(0, 100), // 开发环境只取前100个字符节省处理时间
        tags: post.tags,
        date: post.date,
        url: `/blog/${post.slug}`,
        locale: post.locale,
      });
    }

    // 添加项目到索引
    const projects = getAllProjects();
    console.log(`🏗️ 处理 ${projects.length} 个项目`);

    for (const project of projects) {
      indexItems.push({
        id: `project-${project.title.toLowerCase().replace(/\s+/g, "-")}`,
        type: "project",
        title: project.title,
        description: project.description,
        tags: project.technologies,
        url: `/projects/${project.title.toLowerCase().replace(/\s+/g, "-")}`,
      });
    }

    // 确保static目录存在
    await ensureDir("./static");

    // 写入到静态目录
    const indexJson = JSON.stringify(indexItems);
    await Deno.writeTextFile("./static/search-index.json", indexJson);

    console.log(
      `✅ 开发环境搜索索引生成完成！包含 ${indexItems.length} 个项目`
    );
  } catch (error) {
    console.error("❌ 生成搜索索引出错:", error);
  }
}

// 执行生成
if (import.meta.main) {
  await generateSearchIndexDev();
}
