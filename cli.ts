#!/usr/bin/env -S deno run -A
/**
 * FreshPress CLI
 * Command line utility for FreshPress projects
 */

import { parse } from "https://deno.land/std@0.170.0/flags/mod.ts";
import * as path from "https://deno.land/std@0.170.0/path/mod.ts";
import { ensureDir } from "https://deno.land/std@0.170.0/fs/ensure_dir.ts";

const VERSION = "0.2.0";

// Parse command line arguments
const args = parse(Deno.args);
const command = args._[0]?.toString() || "help";

// Display help text
function showHelp() {
  console.log(`
FreshPress CLI v${VERSION} - Modern static site generator for Deno
Powered by Fresh framework (https://fresh.deno.dev)

USAGE:
  freshpress <command> [options]

COMMANDS:
  create <name>  Create a new FreshPress project
  dev            Start development server
  build          Build static site
  preview        Preview built site
  search         Generate search index
  help           Show this help
  version        Show version information

EXAMPLES:
  freshpress create my-website     # Create a new project
  freshpress dev                   # Start development server
  freshpress build                 # Build static site
`);
}

// Display version information
function showVersion() {
  console.log(`FreshPress v${VERSION}`);
}

// Create a new project
async function createProject(name: string) {
  if (!name) {
    console.error("Error: Please provide a project name");
    console.log("Usage: freshpress create <project-name>");
    Deno.exit(1);
  }

  console.log(`🍋 Creating new FreshPress project: ${name}`);

  try {
    // Create project directory
    await ensureDir(name);
    console.log(`📁 Creating project directory: ${name}`);

    // Clone template repository
    console.log("📥 Downloading FreshPress template...");

    const process = Deno.run({
      cmd: [
        "git",
        "clone",
        "https://deno.land/x/freshpress",
        name,
        "--depth=1",
      ],
      stdout: "piped",
      stderr: "piped",
    });

    const status = await process.status();

    if (!status.success) {
      const stderr = new TextDecoder().decode(await process.stderrOutput());
      throw new Error(`Failed to clone template: ${stderr}`);
    }

    // Remove git directory
    await Deno.remove(path.join(name, ".git"), { recursive: true });

    // Initialize new git repository
    const gitInit = Deno.run({
      cmd: ["git", "init"],
      cwd: name,
      stdout: "piped",
      stderr: "piped",
    });

    await gitInit.status();
    gitInit.close();

    console.log(`
🎉 FreshPress project created successfully!

To get started:
  cd ${name}
  deno task dev
    
For more information, see the README.md file in your project.
`);
  } catch (error) {
    console.error("❌ Error creating project:", error.message);
    Deno.exit(1);
  }
}

// Main function
async function main() {
  switch (command) {
    case "create":
      await createProject(args._[1]?.toString() || "");
      break;

    case "dev":
      console.log("🚀 Starting development server...");
      const devProcess = Deno.run({
        cmd: ["deno", "task", "dev"],
        stdout: "inherit",
        stderr: "inherit",
      });
      await devProcess.status();
      break;

    case "build":
      console.log("🔨 Building static site...");
      const buildProcess = Deno.run({
        cmd: ["deno", "task", "build"],
        stdout: "inherit",
        stderr: "inherit",
      });
      await buildProcess.status();
      break;

    case "preview":
      console.log("👀 Previewing built site...");
      const previewProcess = Deno.run({
        cmd: ["deno", "task", "preview"],
        stdout: "inherit",
        stderr: "inherit",
      });
      await previewProcess.status();
      break;

    case "search":
      console.log("🔍 Generating search index...");
      const searchProcess = Deno.run({
        cmd: ["deno", "task", "gen-search-index"],
        stdout: "inherit",
        stderr: "inherit",
      });
      await searchProcess.status();
      break;

    case "help":
      showHelp();
      break;

    case "version":
      showVersion();
      break;

    default:
      console.error(`Unknown command: ${command}`);
      showHelp();
      Deno.exit(1);
  }
}

// Execute main function
if (import.meta.main) {
  main().catch((error) => {
    console.error("Error:", error);
    Deno.exit(1);
  });
}
