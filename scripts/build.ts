#!/usr/bin/env -S deno run -A
/**
 * FreshPress Static Site Generator
 * For building static HTML output containing all pages
 */
import { walk } from "https://deno.land/std@0.167.0/fs/walk.ts";
import { ensureDir } from "https://deno.land/std@0.167.0/fs/ensure_dir.ts";
import {
  join,
  dirname,
  basename,
  extname,
} from "https://deno.land/std@0.167.0/path/mod.ts";
import { serve } from "https://deno.land/std@0.140.0/http/server.ts";
import { copy } from "https://deno.land/std@0.167.0/fs/copy.ts";
import { getAllPosts, parseFrontMatter } from "../utils/blog.ts";
import { siteConfig } from "../data/config.ts";

// Config
const OUTPUT_DIR = "./dist";
const SERVER_URL = "http://localhost:8000";
const ROUTES_DIR = "./routes";
const STATIC_DIR = "./static";
const LOCALES = ["zh-CN", "en-US"];

async function main() {
  console.log("🍋 FreshPress Static Site Generator starting...");

  // Ensure the output directory exists
  await ensureDir(OUTPUT_DIR);

  // Start Fresh server
  console.log("🚀 Starting development server...");
  const freshProcess = Deno.run({
    cmd: ["deno", "task", "start"],
    stdout: "piped",
    stderr: "piped",
  });

  // Wait for server to start
  await waitForServerReady(PORT);

  try {
    // Copy static files
    console.log("📂 Copying static resources...");
    await copy(STATIC_DIR, join(OUTPUT_DIR, "static"), { overwrite: true });

    // Generate search index
    console.log("🔍 Generating search index...");
    const searchIndexProcess = Deno.run({
      cmd: ["deno", "run", "-A", "scripts/generate-search-index.ts"],
      stdout: "piped",
      stderr: "piped",
    });

    const searchIndexStatus = await searchIndexProcess.status();
    if (!searchIndexStatus.success) {
      console.error("❌ Generating search index failed");
      const stderr = new TextDecoder().decode(
        await searchIndexProcess.stderrOutput()
      );
      console.error(stderr);
    } else {
      console.log("✅ Search index generated successfully");
    }
    searchIndexProcess.close();

    // Get all routes
    console.log("🗺️ Analyzing routes...");
    const routeFiles = [];
    for await (const entry of walk(ROUTES_DIR)) {
      if (
        entry.isFile &&
        entry.name.endsWith(".tsx") &&
        !entry.name.startsWith("_")
      ) {
        routeFiles.push(entry.path);
      }
    }

    // Generate page list
    const pagesToRender = [];

    // Add home and basic pages
    pagesToRender.push("/");
    pagesToRender.push("/blog");
    pagesToRender.push("/projects");

    // Get all blog posts
    const blogPosts = await getAllPosts();

    // Add page for each blog post
    for (const post of blogPosts) {
      pagesToRender.push(`/blog/${post.slug}`);
    }

    // Project pages
    for (const project of siteConfig.projects.items) {
      const slug = project.title
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]/g, "");
      pagesToRender.push(`/projects/${slug}`);
    }

    // Multilingual support
    const allPages = [];
    for (const page of pagesToRender) {
      for (const locale of LOCALES) {
        allPages.push({
          url: page,
          locale,
        });
      }
    }

    // Create a progress bar
    let completed = 0;
    const total = allPages.length;

    // Render all pages
    console.log(`🔨 Starting to generate ${total} pages...`);

    for (const { url, locale } of allPages) {
      const outputPath =
        url === "/"
          ? join(OUTPUT_DIR, locale, "index.html")
          : join(OUTPUT_DIR, locale, url, "index.html");

      // Ensure directory exists
      await ensureDir(dirname(outputPath));

      try {
        // Build full URL (with language parameter)
        const fullUrl = `${SERVER_URL}${url}?locale=${locale}`;

        // Get page HTML
        const response = await fetch(fullUrl);
        if (!response.ok) {
          console.error(
            `❌ Unable to get page ${url} (${locale}): ${response.status} ${response.statusText}`
          );
          continue;
        }

        // Get HTML content
        const html = await response.text();

        // Save HTML file
        await Deno.writeTextFile(outputPath, html);

        // Update progress
        completed++;
        const percent = Math.floor((completed / total) * 100);
        const progressBar =
          "█".repeat(Math.floor(percent / 2)) +
          "░".repeat(50 - Math.floor(percent / 2));
        console.log(
          `[${progressBar}] ${percent}% (${completed}/${total}) - Generating ${locale}${url}`
        );
      } catch (error) {
        console.error(`❌ Rendering ${url} (${locale}) failed:`, error);
      }
    }

    // Create redirect file for each language
    for (const locale of LOCALES) {
      const redirectHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta http-equiv="refresh" content="0;url=/${locale}/">
            <link rel="canonical" href="/${locale}/">
            <title>Redirecting to /${locale}/</title>
          </head>
          <body>
            <p>Redirecting to <a href="/${locale}/">/${locale}/</a>...</p>
          </body>
        </html>
      `;

      await Deno.writeTextFile(join(OUTPUT_DIR, "index.html"), redirectHtml);
    }

    // Generate site map
    await generateSitemap(allPages);

    console.log("✅ Static site generation completed!");
  } catch (error) {
    console.error("❌ Error during generation:", error);
  } finally {
    // Close server
    freshProcess.kill("SIGTERM");
    freshProcess.close();
  }
}

// Generate site map
async function generateSitemap(pages) {
  console.log("🗺️ Generating site map...");

  const siteUrl = siteConfig.site.url || "https://example.com";

  let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
  sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  // Add all pages to site map
  for (const { url, locale } of pages) {
    const fullUrl = `${siteUrl}/${locale}${url === "/" ? "" : url}`;

    sitemap += "  <url>\n";
    sitemap += `    <loc>${fullUrl}</loc>\n`;
    sitemap += "    <lastmod>" + new Date().toISOString() + "</lastmod>\n";

    // Higher priority for home page
    if (url === "/") {
      sitemap += "    <priority>1.0</priority>\n";
    } else if (url.startsWith("/blog/")) {
      sitemap += "    <priority>0.8</priority>\n";
    } else {
      sitemap += "    <priority>0.6</priority>\n";
    }

    sitemap += "  </url>\n";
  }

  sitemap += "</urlset>";

  await Deno.writeTextFile(join(OUTPUT_DIR, "sitemap.xml"), sitemap);
}

// Start main function
if (import.meta.main) {
  main().catch(console.error);
}
