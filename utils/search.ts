import { siteConfig } from "../data/config.ts";
import { currentLocale, Locale } from "./i18n.ts";
// Remove server-side imports
// import { getAllPosts } from "./blog.ts";
// import { getAllProjects } from "./projects.ts";

// 硬编码的示例博客数据，用于客户端搜索
const SAMPLE_BLOG_POSTS = [
  {
    title: "Hello World",
    slug: "hello-world",
    date: "2024-03-20",
    tags: ["Deno", "Fresh", "TypeScript", "Hello"],
    content:
      "This is my first blog post. In this article, I will introduce how to build a personal website using Deno and the Fresh framework.",
    locale: "en-US" as Locale,
  },
  {
    title: "FreshPress 简介",
    slug: "freshpress-introduction",
    date: "2024-03-15",
    tags: ["Deno", "Fresh", "TypeScript", "FreshPress"],
    content:
      "FreshPress是一个基于Fresh框架的现代静态站点生成器，旨在帮助开发者快速构建个人网站或博客。",
    locale: "zh-CN" as Locale,
  },
  {
    title: "FreshPress Features",
    slug: "freshpress-features-en",
    date: "2024-03-10",
    tags: ["Features", "Fresh", "StaticSite"],
    content:
      "Explore the powerful features of FreshPress, a modern static site generator based on the Fresh framework.",
    locale: "en-US" as Locale,
  },
];

// 硬编码的示例项目数据
const SAMPLE_PROJECTS = [
  {
    title: "Personal Website",
    description: "Modern personal website built with Fresh framework",
    technologies: ["Deno", "Fresh", "TypeScript", "TailwindCSS"],
  },
  {
    title: "Online Code Editor",
    description: "Online code editor based on Monaco Editor",
    technologies: ["React", "TypeScript", "Monaco Editor"],
  },
];

export interface SearchResult {
  type: "blog" | "project";
  title: string;
  description?: string;
  excerpt?: string;
  url: string;
  tags?: string[];
  date?: string;
  locale?: Locale;
  relevance?: number; // Search relevance score
}

// 搜索权重
const WEIGHTS = {
  title: 5, // 标题权重
  tags: 2, // 标签权重
  content: 0, // 内容搜索已禁用
  description: 0, // 描述搜索已禁用
};

// 索引缓存
let searchIndexCache: any[] | null = null;

// 加载搜索索引
async function loadSearchIndex(): Promise<any[]> {
  if (searchIndexCache) {
    return searchIndexCache;
  }

  try {
    console.log("📂 加载搜索索引文件...");
    const response = await fetch("/search-index.json");
    if (!response.ok) {
      throw new Error(`加载搜索索引失败: ${response.status}`);
    }

    const data = await response.json();
    console.log(`✅ 加载完成, 包含 ${data.length} 个索引项`);
    searchIndexCache = data;
    return data;
  } catch (error) {
    console.error("❌ 加载搜索索引出错:", error);
    return [];
  }
}

/**
 * 搜索内容
 * @param query 搜索关键词
 * @param locale 可选的语言过滤
 * @returns 搜索结果数组
 */
export async function searchContent(
  query: string,
  locale?: Locale
): Promise<SearchResult[]> {
  const results: SearchResult[] = [];
  console.log(`开始搜索: "${query}", 语言: ${locale || "全部"}`);

  if (!query || query.trim().length < 2) {
    console.log("搜索词太短，至少需要2个字符");
    return results;
  }

  const normalizedQuery = query.toLowerCase().trim();
  const currentLang = locale || currentLocale.value;
  console.log(`处理搜索词: "${normalizedQuery}", 当前语言: ${currentLang}`);

  try {
    // 加载索引
    const searchIndex = await loadSearchIndex();

    // 遍历索引项搜索
    for (const item of searchIndex) {
      // 调试输出
      console.log(
        `检查项: ${item.title}, 类型: ${item.type}, 标签: ${(
          item.tags || []
        ).join(", ")}`
      );

      // 语言过滤
      if (locale && item.locale && item.locale !== locale) {
        console.log(
          `跳过不匹配语言的项: ${item.title}, 项语言=${item.locale}, 搜索语言=${locale}`
        );
        continue;
      }

      let relevance = 0;
      let matchDetails = [];

      // 标题匹配
      if (item.title && item.title.toLowerCase().includes(normalizedQuery)) {
        relevance += WEIGHTS.title;
        matchDetails.push("title");
        console.log(`项 "${item.title}" 标题匹配搜索词 "${normalizedQuery}"`);
      }

      // 标签匹配
      if (item.tags && Array.isArray(item.tags)) {
        const normalizedTags = item.tags.map((tag: string) =>
          typeof tag === "string" ? tag.toLowerCase() : ""
        );
        const hasTagMatch = normalizedTags.some(
          (tag: string) => tag && tag.includes(normalizedQuery)
        );
        if (hasTagMatch) {
          relevance += WEIGHTS.tags;
          matchDetails.push("tags");
          console.log(`项 "${item.title}" 标签匹配搜索词 "${normalizedQuery}"`);
        }
      }

      // 添加结果
      if (relevance > 0) {
        console.log(
          `项 "${
            item.title
          }" 匹配成功, 相关度: ${relevance}, 匹配项: ${matchDetails.join(", ")}`
        );

        // 提取匹配上下文作为摘要
        let excerpt = "";
        if (item.content) {
          const contentLower = item.content.toLowerCase();
          const index = contentLower.indexOf(normalizedQuery);
          if (index !== -1) {
            const start = Math.max(0, index - 40);
            const end = Math.min(
              item.content.length,
              index + normalizedQuery.length + 40
            );
            excerpt =
              (start > 0 ? "..." : "") +
              item.content.substring(start, end).trim() +
              (end < item.content.length ? "..." : "");
          } else {
            excerpt = item.content.split("\n")[0];
          }
        }

        results.push({
          type: item.type,
          title: item.title,
          description: item.description || "",
          excerpt,
          url: item.url,
          tags: item.tags || [],
          date: item.date,
          locale: item.locale,
          relevance,
        });
      } else {
        console.log(`项 "${item.title}" 不匹配搜索词 "${normalizedQuery}"`);
      }
    }

    // 按相关性排序
    results.sort((a, b) => (b.relevance || 0) - (a.relevance || 0));

    console.log(`搜索完成. 找到 ${results.length} 个结果.`);

    // 返回前10个结果
    return results.slice(0, 10);
  } catch (error) {
    console.error("搜索出错:", error);
    return [];
  }
}
