import { siteConfig } from "../data/config.ts";
import { currentLocale, Locale } from "./i18n.ts";
import { getAllPosts } from "./blog.ts";
import { getAllProjects } from "./projects.ts";

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

// Adjust search weights, increase the weight of title
const WEIGHTS = {
  title: 5, // Increase title weight to prioritize title matches
  tags: 2,
  content: 1,
  description: 1.5,
};

/**
 * Search blog and project content
 * @param query Search keyword
 * @param locale Optional language filter
 * @returns Array of search results
 */
export async function searchContent(
  query: string,
  locale?: Locale
): Promise<SearchResult[]> {
  const results: SearchResult[] = [];
  console.log(`Starting search: "${query}", Language: ${locale || "All"}`);

  if (!query || query.trim().length < 2) {
    console.log("Search term too short, at least 2 characters required");
    return results;
  }

  const normalizedQuery = query.toLowerCase().trim();
  const currentLang = locale || currentLocale.value;
  console.log(
    `Processed search term: "${normalizedQuery}", Current language: ${currentLang}`
  );

  // Search blog posts
  try {
    const posts = await getAllPosts();
    console.log(`Found ${posts.length} blog posts to search`);

    for (const post of posts) {
      // Debug output basic info for each article
      console.log(
        `Checking blog: "${post.title}", Language: ${
          post.locale || "Unspecified"
        }, Tags: ${post.tags?.join(", ") || "None"}`
      );

      // Skip if language specified and post language doesn't match (unless post has no language specified)
      if (currentLang && post.locale && post.locale !== currentLang) {
        // Only skip when the post has a specific language setting that doesn't match the current language
        console.log(
          `Skipping post with non-matching language: ${post.title}, Post language=${post.locale}, Current language=${currentLang}`
        );
        continue;
      }

      let relevance = 0;
      let matchDetails = [];

      // Calculate title match (case insensitive)
      if (post.title && post.title.toLowerCase().includes(normalizedQuery)) {
        relevance += WEIGHTS.title;
        matchDetails.push("title");
        console.log(
          `Post "${post.title}" title matches search term "${normalizedQuery}"`
        );
      }

      // Calculate tag match
      if (post.tags && post.tags.length > 0) {
        const normalizedTags = post.tags.map((tag) =>
          typeof tag === "string" ? tag.toLowerCase() : ""
        );
        const hasTagMatch = normalizedTags.some(
          (tag) => tag && tag.includes(normalizedQuery)
        );
        if (hasTagMatch) {
          relevance += WEIGHTS.tags;
          matchDetails.push("tags");
          console.log(
            `Post "${post.title}" tags match search term "${normalizedQuery}"`
          );
        }
      }

      // Calculate content match
      if (
        post.content &&
        post.content.toLowerCase().includes(normalizedQuery)
      ) {
        relevance += WEIGHTS.content;
        matchDetails.push("content");
        console.log(
          `Post "${post.title}" content matches search term "${normalizedQuery}"`
        );
      }

      if (relevance > 0) {
        console.log(
          `Blog "${
            post.title
          }" matches, Relevance: ${relevance}, Matches: ${matchDetails.join(
            ", "
          )}`
        );

        // Extract match context as excerpt
        let excerpt = "";
        if (post.content) {
          const contentLower = post.content.toLowerCase();
          const index = contentLower.indexOf(normalizedQuery);
          if (index !== -1) {
            const start = Math.max(0, index - 40);
            const end = Math.min(
              post.content.length,
              index + normalizedQuery.length + 40
            );
            excerpt =
              (start > 0 ? "..." : "") +
              post.content.substring(start, end).trim() +
              (end < post.content.length ? "..." : "");
          } else {
            excerpt = post.content.split("\n")[0];
          }
        }

        results.push({
          type: "blog",
          title: post.title,
          description:
            post.description ||
            (post.content ? post.content.split("\n")[0] : ""),
          excerpt,
          url: `/blog/${post.slug}`,
          tags: post.tags || [],
          date: post.date,
          locale: post.locale,
          relevance,
        });
      } else {
        console.log(
          `Post "${post.title}" does not match search term "${normalizedQuery}"`
        );
      }
    }
  } catch (error) {
    console.error("Error searching blogs:", error);
  }

  // Search projects
  try {
    const projects = getAllProjects();
    console.log(`Found ${projects.length} projects to search`);

    for (const project of projects) {
      // Skip if project structure is undefined
      if (!project || typeof project !== "object") {
        console.log("Skipping invalid project structure");
        continue;
      }

      // Debug output project basic info
      console.log(
        `Checking project: "${project.title}", Technologies: ${
          project.technologies?.join(", ") || "None"
        }`
      );

      let relevance = 0;
      let matchDetails = [];

      // Calculate title match
      if (
        project.title &&
        project.title.toLowerCase().includes(normalizedQuery)
      ) {
        relevance += WEIGHTS.title;
        matchDetails.push("title");
        console.log(
          `Project "${project.title}" title matches search term "${normalizedQuery}"`
        );
      }

      // Calculate description match
      if (
        project.description &&
        project.description.toLowerCase().includes(normalizedQuery)
      ) {
        relevance += WEIGHTS.description;
        matchDetails.push("description");
        console.log(
          `Project "${project.title}" description matches search term "${normalizedQuery}"`
        );
      }

      // Calculate tech tags match
      if (project.technologies && project.technologies.length > 0) {
        const normalizedTags = project.technologies.map((tech) =>
          tech.toLowerCase()
        );
        const hasTagMatch = normalizedTags.some((tech) =>
          tech.includes(normalizedQuery)
        );
        if (hasTagMatch) {
          relevance += WEIGHTS.tags;
          matchDetails.push("technologies");
          console.log(
            `Project "${project.title}" technologies match search term "${normalizedQuery}"`
          );
        }
      }

      // Add to results if relevant
      if (relevance > 0) {
        console.log(
          `Project "${
            project.title
          }" matches, Relevance: ${relevance}, Matches: ${matchDetails.join(
            ", "
          )}`
        );

        // Generate URL from title for projects
        const projectUrl = `/projects/${project.title
          .toLowerCase()
          .replace(/\s+/g, "-")}`;

        results.push({
          type: "project",
          title: project.title,
          description: project.description || "",
          url: projectUrl,
          tags: project.technologies || [],
          relevance,
        });
      }
    }
  } catch (error) {
    console.error("Error searching projects:", error);
  }

  // Sort results by relevance (highest first)
  results.sort((a, b) => (b.relevance || 0) - (a.relevance || 0));

  console.log(`Search complete. Found ${results.length} results.`);

  // Return top 10 results
  return results.slice(0, 10);
}

/**
 * Save recent searches to localStorage
 * @param query Search term to save
 */
export function saveRecentSearch(query: string): void {
  if (typeof window === "undefined" || !query || query.trim().length < 2) {
    return;
  }

  try {
    const trimmedQuery = query.trim();
    const savedSearches = getRecentSearches();

    // Check if the search already exists
    const exists = savedSearches.includes(trimmedQuery);

    // If it exists, remove it to add to the beginning
    const updatedSearches = exists
      ? [trimmedQuery, ...savedSearches.filter((s) => s !== trimmedQuery)]
      : [trimmedQuery, ...savedSearches];

    // Limit to 10 recent searches
    const limitedSearches = updatedSearches.slice(0, 10);

    localStorage.setItem("recentSearches", JSON.stringify(limitedSearches));
  } catch (error) {
    console.error("Error saving recent search:", error);
  }
}

/**
 * Get recent searches from localStorage
 * @returns Array of recent search terms
 */
export function getRecentSearches(): string[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const savedSearches = localStorage.getItem("recentSearches");
    if (!savedSearches) return [];

    return JSON.parse(savedSearches);
  } catch (error) {
    console.error("Error retrieving recent searches:", error);
    return [];
  }
}

/**
 * Clear all recent searches from localStorage
 */
export function clearRecentSearches(): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.removeItem("recentSearches");
  } catch (error) {
    console.error("Error clearing recent searches:", error);
  }
}
