#!/usr/bin/env -S deno run -A
/**
 * Search index generator for development environment
 * Simplified version for faster startup of the development server
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
  console.log("🔍 Generating development search index...");
  const indexItems: SearchIndexItem[] = [];

  try {
    // Add blog posts to index
    const posts = await getAllPosts();
    console.log(`📚 Processing ${posts.length} blog posts`);

    for (const post of posts) {
      indexItems.push({
        id: `blog-${post.slug}`,
        type: "blog",
        title: post.title,
        content: post.content.slice(0, 100), // Only using first 100 chars for dev environment to save time
        tags: post.tags,
        date: post.date,
        url: `/blog/${post.slug}`,
        locale: post.locale,
      });
    }

    // Add projects to index
    const projects = getAllProjects();
    console.log(`🏗️ Processing ${projects.length} projects`);

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

    // Ensure static directory exists
    await ensureDir("./static");

    // Write to static directory
    const indexJson = JSON.stringify(indexItems);
    await Deno.writeTextFile("./static/search-index.json", indexJson);

    console.log(
      `✅ Development search index generated! Contains ${indexItems.length} items`
    );
  } catch (error) {
    console.error("❌ Error generating search index:", error);
  }
}

// Execute generation
if (import.meta.main) {
  await generateSearchIndexDev();
}
