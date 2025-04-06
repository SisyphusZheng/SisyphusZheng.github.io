#!/usr/bin/env -S deno run -A
/**
 * FreshPress CLI - Command line interface for FreshPress
 * Provides common operations like build and start
 */

import { parse } from "https://deno.land/std@0.170.0/flags/mod.ts";
import * as path from "https://deno.land/std@0.170.0/path/mod.ts";

const VERSION = "0.2.0";

// Parse command line arguments
const args = parse(Deno.args);
const command = args._[0]?.toString() || "help";

// Display help text
function showHelp() {
  console.log(`
FreshPress - Modern static site generator based on Fresh

USAGE:
  freshpress <command> [options]

COMMANDS:
  start       Start development server
  build       Build static site
  preview     Preview built site
  help        Show this help
  version     Show version

EXAMPLES:
  freshpress start    # Start development server
  freshpress build    # Build static site
`);
}

// Display version information
function showVersion() {
  console.log(`FreshPress v${VERSION}`);
}

async function main() {
  // Execute selected command
  switch (command) {
    case "start":
      // Start development server
      console.log("🚀 Starting development server...");
      const startProcess = Deno.run({
        cmd: ["deno", "task", "start"],
        stdout: "inherit",
        stderr: "inherit",
      });
      await startProcess.status();
      break;

    case "build":
      // Build static site
      console.log("🔨 Building static site...");
      const buildProcess = Deno.run({
        cmd: ["deno", "task", "build"],
        stdout: "inherit",
        stderr: "inherit",
      });
      await buildProcess.status();
      break;

    case "preview":
      // Preview built site
      console.log("👀 Previewing built site...");
      const previewProcess = Deno.run({
        cmd: ["deno", "task", "preview"],
        stdout: "inherit",
        stderr: "inherit",
      });
      await previewProcess.status();
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

if (import.meta.main) {
  main();
}
