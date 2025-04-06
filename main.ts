#!/usr/bin/env -S deno run -A --watch=static/,routes/

import { start } from "$fresh/server.ts";
import manifest from "./fresh.gen.ts";
import config from "./fresh.config.ts";
import { buildStatic } from "https://deno.land/x/fresh@1.7.3/src/server/build.ts";

/**
 * FreshPress - Modern static site generator based on Fresh framework
 *
 * Usage:
 * 1. Development: deno task start
 * 2. Build: deno task build
 */

// Check if static site build is required
const isBuild = Deno.args.includes("--build");

if (isBuild) {
  try {
    console.log("Starting static site build...");
    const { buildStatic } = await import(
      "https://deno.land/x/fresh@1.7.3/src/server/build.ts"
    );
    await buildStatic(manifest, config);
    console.log("Static site build complete!");
  } catch (error) {
    console.error("Error building static site:", error);
    Deno.exit(1);
  }
  Deno.exit(0);
}

async function main(args: string[]) {
  // Get current working directory
  const workingDir = Deno.cwd();

  // Default build directory
  const outDir = args[0] || "_site";
  const fullOutDir = new URL(outDir, `file://${workingDir}/`);

  console.log(`🍋 FreshPress - Building static site...`);
  console.log(`📂 Output directory: ${outDir}\n`);

  try {
    await buildStatic(manifest, {
      outDir: fullOutDir,
      forceBuild: true,
      ...config.static,
    });
    console.log(`✅ Build complete!`);
  } catch (error) {
    console.error(`❌ Build failed:`, error);
    Deno.exit(1);
  }
}

// Start build process
if (import.meta.main) {
  await main(Deno.args);
}
