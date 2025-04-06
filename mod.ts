/**
 * FreshPress - A modern static site generator based on Fresh framework
 * @module freshpress
 */

// Export public API from utility modules
export * from "./utils/blog.ts";
export * from "./utils/content.ts";
export * from "./utils/i18n.ts";
export * from "./utils/date.ts";
export * from "./utils/search.ts";

// Export main configuration
export { siteConfig } from "./data/config.ts";

// Export version information
export const VERSION = "0.2.0";

/**
 * FreshPress information
 */
export const about = {
  name: "FreshPress",
  description: "A modern static site generator based on Fresh framework",
  repository: "https://github.com/username/freshpress",
  author: "FreshPress Team",
  license: "MIT",
};

/**
 * Start a new FreshPress project
 * @param {string} projectName - Project name
 * @returns {Promise<void>}
 */
export async function createProject(projectName: string): Promise<void> {
  console.log(`Creating new FreshPress project: ${projectName}`);

  // Project scaffolding functionality
  // In actual implementation, this would clone the template repository and set up initial files

  console.log(`
    Project created successfully! 🎉
    
    cd ${projectName}
    deno task start
  `);
}

// Default export
export default {
  VERSION,
  about,
  createProject,
};
