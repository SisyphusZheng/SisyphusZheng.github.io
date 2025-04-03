import { siteConfig } from "../data/config.ts";
import { join } from "std/path/mod.ts";

export interface SearchResult {
  type: "blog" | "project";
  title: string;
  description?: string;
  url: string;
  tags?: string[];
  date?: string;
}

export async function searchContent(query: string): Promise<SearchResult[]> {
  const results: SearchResult[] = [];
  const normalizedQuery = query.toLowerCase();

  // 搜索博客文章
  try {
    const blogDir = join(Deno.cwd(), "blog");
    for await (const dirEntry of Deno.readDir(blogDir)) {
      if (dirEntry.isFile && dirEntry.name.endsWith(".md")) {
        const filePath = join(blogDir, dirEntry.name);
        const file = await Deno.readTextFile(filePath);
        const { attrs, body } = parseFrontMatter(file);
        
        // 检查标题、内容和标签是否匹配搜索词
        if (
          attrs.title?.toLowerCase().includes(normalizedQuery) ||
          body.toLowerCase().includes(normalizedQuery) ||
          attrs.tags?.some((tag: string) => 
            tag.toLowerCase().includes(normalizedQuery)
          )
        ) {
          results.push({
            type: "blog",
            title: attrs.title || "未命名文章",
            description: body.split("\n")[0],
            url: `/blog/${dirEntry.name.replace(".md", "")}`,
            tags: attrs.tags ? attrs.tags.split(",").map((t: string) => t.trim()) : [],
            date: attrs.date,
          });
        }
      }
    }
  } catch (error) {
    console.error("Error searching blog posts:", error);
  }

  // 搜索项目
  const projects = siteConfig.projects?.items || [];
  for (const project of projects) {
    if (
      project.title.toLowerCase().includes(normalizedQuery) ||
      project.description.toLowerCase().includes(normalizedQuery) ||
      project.tags?.some(tag => tag.toLowerCase().includes(normalizedQuery))
    ) {
      results.push({
        type: "project",
        title: project.title,
        description: project.description,
        url: project.link,
        tags: project.tags,
      });
    }
  }

  return results;
}

function parseFrontMatter(content: string): { attrs: Record<string, any>; body: string } {
  const lines = content.split("\n");
  const attrs: Record<string, any> = {};
  let body = content;
  let inFrontMatter = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line === "---") {
      if (!inFrontMatter) {
        inFrontMatter = true;
        continue;
      } else {
        body = lines.slice(i + 1).join("\n");
        break;
      }
    }

    if (inFrontMatter) {
      const [key, ...values] = line.split(":");
      if (key && values.length > 0) {
        const value = values.join(":").trim();
        attrs[key.trim()] = value.replace(/^['"]|['"]$/g, "");
      }
    }
  }

  return { attrs, body };
} 