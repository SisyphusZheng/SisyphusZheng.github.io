import { join } from "https://deno.land/std@0.208.0/path/mod.ts";
import { Locale } from "./i18n.ts";

export interface Post {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  content: string;
  description?: string;
  locale?: Locale;
  cover?: string;
}

export function parseFrontMatter(content: string): {
  attrs: Record<string, any>;
  body: string;
} {
  const lines = content.split("\n");
  if (lines[0] !== "---") {
    return { attrs: {}, body: content };
  }

  const attrs: Record<string, any> = {};
  let i = 1;
  for (; i < lines.length; i++) {
    if (lines[i] === "---") {
      i++;
      break;
    }
    const [key, ...values] = lines[i].split(":");
    attrs[key.trim()] = values
      .join(":")
      .trim()
      .replace(/^['"]|['"]$/g, "");
  }

  return {
    attrs,
    body: lines.slice(i).join("\n"),
  };
}

export async function getAllPosts(): Promise<Post[]> {
  const posts: Post[] = [];
  try {
    // Use filesystem API on the server side
    try {
      const blogDir = "blog";

      for await (const dirEntry of Deno.readDir(blogDir)) {
        if (dirEntry.isFile && dirEntry.name.endsWith(".md")) {
          try {
            const filePath = join(blogDir, dirEntry.name);
            const file = await Deno.readTextFile(filePath);
            const { attrs, body } = parseFrontMatter(file);

            // Parse tags, supporting comma-separated string or array
            let tags: string[] = [];
            if (attrs.tags) {
              if (typeof attrs.tags === "string") {
                // 去除可能的引号
                const tagsStr = attrs.tags.replace(/^['"]|['"]$/g, "");
                tags = tagsStr.split(",").map((tag: string) => tag.trim());
                // 输出解析后的标签，用于调试
                console.log(`Parsed tags from string "${attrs.tags}":`, tags);
              } else if (Array.isArray(attrs.tags)) {
                tags = attrs.tags;
              }
            }

            // Add post information, including locale
            posts.push({
              slug: dirEntry.name.replace(".md", ""),
              title: attrs.title || "Untitled Post",
              date: attrs.date || new Date().toISOString(),
              tags: tags,
              content: body,
              description: attrs.description || "",
              locale: (attrs.locale as Locale) || "zh-CN",
              cover: attrs.cover || "",
            });
          } catch (fileError) {
            console.error(`Failed to read file ${dirEntry.name}:`, fileError);
          }
        }
      }
    } catch (dirError) {
      console.error("Failed to read blog directory:", dirError);
    }

    // Sort by date, newest posts first
    return posts.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  } catch (error) {
    console.error("Failed to get blog posts:", error);
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const filePath = join("blog", `${slug}.md`);
    const file = await Deno.readTextFile(filePath);
    const { attrs, body } = parseFrontMatter(file);

    // Parse tags, supporting comma-separated string or array
    let tags: string[] = [];
    if (attrs.tags) {
      if (typeof attrs.tags === "string") {
        tags = attrs.tags.split(",").map((tag: string) => tag.trim());
      } else if (Array.isArray(attrs.tags)) {
        tags = attrs.tags;
      }
    }

    return {
      slug,
      title: attrs.title as string,
      date: attrs.date as string,
      tags: tags,
      content: body,
      description: attrs.description || "",
      locale: (attrs.locale as Locale) || "zh-CN",
      cover: attrs.cover || "",
    };
  } catch (error) {
    console.error(`Failed to get post ${slug}:`, error);
    return null;
  }
}
