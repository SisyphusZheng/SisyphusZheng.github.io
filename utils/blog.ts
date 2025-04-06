import { join } from "https://deno.land/std@0.208.0/path/mod.ts";
import { Locale } from "./i18n.ts";

export interface FrontMatter {
  title: string;
  date: string;
  tags: string[];
  locale: string;
  content: string;
}

export interface Post {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  content: string;
  excerpt: string;
  locale: Locale;
}

export function parseFrontMatter(content: string): FrontMatter {
  // 使用更简单的方法分割前言和内容
  const parts = content.trim().split(/---\r?\n/);

  // 如果不是有效的前言格式（至少有3个部分，第一个是空的）
  if (parts.length < 3) {
    console.warn("Invalid frontmatter format in markdown file");
    return {
      title: "",
      date: "",
      tags: [],
      locale: "en-US",
      content: content,
    };
  }

  // 前言部分是第二部分
  const frontMatter = parts[1];
  // 内容部分是第三部分及之后的所有内容
  const contentParts = parts.slice(2);
  const restContent = contentParts.join("---\n").trim();

  // 从前言中提取信息
  const titleMatch = frontMatter.match(/title:\s*"([^"]*)"/);
  const title = titleMatch ? titleMatch[1] : "";

  const dateMatch = frontMatter.match(/date:\s*"([^"]*)"/);
  const date = dateMatch ? dateMatch[1] : "";

  // 处理不同格式的tags
  let tags: string[] = [];
  const tagsMatch = frontMatter.match(/tags:\s*(.*)/)?.[1];

  if (tagsMatch) {
    if (tagsMatch.trim().startsWith("[") && tagsMatch.trim().endsWith("]")) {
      // 数组格式：["tag1", "tag2"]
      tags = tagsMatch
        .substring(tagsMatch.indexOf("[") + 1, tagsMatch.lastIndexOf("]"))
        .split(",")
        .map((tag) => tag.trim().replace(/"/g, ""));
    } else {
      // 字符串格式："tag1, tag2"
      tags = tagsMatch
        .replace(/"/g, "")
        .split(",")
        .map((tag) => tag.trim());
    }
  }

  const localeMatch = frontMatter.match(/locale:\s*"([^"]*)"/);
  const locale = localeMatch ? localeMatch[1] : "en-US";

  // 调试输出解析结果
  console.log("Parsed frontmatter:", {
    title,
    date,
    tags,
    locale,
    contentLength: restContent.length,
  });

  return {
    title,
    date,
    tags,
    locale,
    content: restContent,
  };
}

/**
 * 从文章内容中生成摘要
 */
function generateExcerpt(content: string, maxLength: number = 150): string {
  // 移除 Markdown 标记
  const plainText = content
    .replace(/#+\s+(.*)/g, "$1") // 标题
    .replace(/\*\*(.*?)\*\*/g, "$1") // 粗体
    .replace(/\*(.*?)\*/g, "$1") // 斜体
    .replace(/\[(.*?)\]\(.*?\)/g, "$1") // 链接
    .replace(/!\[(.*?)\]\(.*?\)/g, "$1") // 图片
    .replace(/```[\s\S]*?```/g, "") // 代码块
    .replace(/`(.*?)`/g, "$1") // 行内代码
    .replace(/\n/g, " ") // 换行
    .replace(/\s+/g, " "); // 多余空格

  // 截取指定长度
  if (plainText.length <= maxLength) {
    return plainText;
  }

  return plainText.substring(0, maxLength) + "...";
}

export async function getAllPosts(locale?: string): Promise<Post[]> {
  const files = await Deno.readDir("blog");
  const promises = [];
  for await (const file of files) {
    if (file.name.endsWith(".md")) {
      promises.push(
        Deno.readTextFile(`blog/${file.name}`).then((content: string) => {
          const frontMatter = parseFrontMatter(content);
          const slug = file.name.replace(".md", "");

          // 如果指定了 locale，过滤出符合该语言的文章
          if (locale && frontMatter.locale !== locale) {
            return null;
          }

          return {
            slug,
            title: frontMatter.title,
            date: frontMatter.date,
            tags: frontMatter.tags,
            excerpt: generateExcerpt(frontMatter.content),
            content: frontMatter.content,
            locale: frontMatter.locale as Locale,
          };
        })
      );
    }
  }

  return (await Promise.all(promises))
    .filter((post: Post | null): post is Post => post !== null)
    .sort((a: Post, b: Post) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const content = await Deno.readTextFile(`blog/${slug}.md`);
    const frontMatter = parseFrontMatter(content);

    return {
      slug,
      title: frontMatter.title,
      date: frontMatter.date,
      tags: frontMatter.tags,
      excerpt: generateExcerpt(frontMatter.content),
      content: frontMatter.content,
      locale: frontMatter.locale as Locale,
    };
  } catch (error) {
    console.error(`Error getting post by slug ${slug}:`, error);
    return null;
  }
}
