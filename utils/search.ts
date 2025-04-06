import { siteConfig } from "../data/config.ts";
import { currentLocale, Locale } from "./i18n.ts";
// Remove server-side imports
// import { getAllPosts } from "./blog.ts";
// import { getAllProjects } from "./projects.ts";

// Example blog data for client-side search
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
    title: "FreshPress Introduction",
    slug: "freshpress-introduction",
    date: "2024-03-15",
    tags: ["Deno", "Fresh", "TypeScript", "FreshPress"],
    content:
      "FreshPress is a modern static site generator based on the Fresh framework, designed to help developers quickly build personal websites or blogs.",
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

// Example project data
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

// Search weights
const WEIGHTS = {
  title: 5, // Title weight
  tags: 2, // Tag weight
  content: 0, // Content search disabled
  description: 0, // Description search disabled
};

// Index cache
let searchIndexCache: any[] | null = null;

// Load search index
async function loadSearchIndex(): Promise<any[]> {
  if (searchIndexCache) {
    return searchIndexCache;
  }

  try {
    console.log("📂 Loading search index file...");
    const response = await fetch("/search-index.json");
    if (!response.ok) {
      throw new Error(`Failed to load search index: ${response.status}`);
    }

    const data = await response.json();
    console.log(`✅ Loading complete, contains ${data.length} index items`);
    searchIndexCache = data;
    return data;
  } catch (error) {
    console.error("❌ Error loading search index:", error);
    return [];
  }
}

/**
 * Search content
 * @param query Search keyword
 * @param locale Optional language filter
 * @returns Search results array
 */
export async function searchContent(
  query: string,
  locale?: Locale
): Promise<SearchResult[]> {
  const results: SearchResult[] = [];
  console.log(`Starting search: "${query}", Language: ${locale || "all"}`);

  if (!query || query.trim().length < 2) {
    console.log("Search term too short, at least 2 characters required");
    return results;
  }

  const normalizedQuery = query.toLowerCase().trim();
  const currentLang = locale || currentLocale.value;
  console.log(
    `Processing search term: "${normalizedQuery}", Current language: ${currentLang}`
  );

  try {
    // Load index
    const searchIndex = await loadSearchIndex();

    // Search through index items
    for (const item of searchIndex) {
      // Debug output
      console.log(
        `Checking item: ${item.title}, Type: ${item.type}, Tags: ${(
          item.tags || []
        ).join(", ")}`
      );

      // Language filter
      if (locale && item.locale && item.locale !== locale) {
        console.log(
          `Skipping item with non-matching language: ${item.title}, Item language=${item.locale}, Search language=${locale}`
        );
        continue;
      }

      let relevance = 0;
      let matchDetails = [];

      // Title match
      if (item.title && item.title.toLowerCase().includes(normalizedQuery)) {
        relevance += WEIGHTS.title;
        matchDetails.push("title");
        console.log(
          `Item "${item.title}" title matches search term "${normalizedQuery}"`
        );
      }

      // Tag match
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
          console.log(
            `Item "${item.title}" tags match search term "${normalizedQuery}"`
          );
        }
      }

      // Add results
      if (relevance > 0) {
        console.log(
          `Item "${
            item.title
          }" matched successfully, Relevance: ${relevance}, Matched in: ${matchDetails.join(
            ", "
          )}`
        );

        // Extract context around match for excerpt
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
        console.log(
          `Item "${item.title}" does not match search term "${normalizedQuery}"`
        );
      }
    }

    // Sort by relevance
    results.sort((a, b) => (b.relevance || 0) - (a.relevance || 0));

    console.log(`Search completed. Found ${results.length} results.`);

    // Return top 10 results
    return results.slice(0, 10);
  } catch (error) {
    console.error("Search error:", error);
    return [];
  }
}
