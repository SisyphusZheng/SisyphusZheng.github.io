#!/usr/bin/env -S deno run -A

import { start } from "$fresh/server.ts";
import manifest from "./fresh.gen.ts";
import config from "./fresh.config.ts";

/**
 * FreshPress - Modern static site generator based on Fresh framework
 *
 * Usage:
 * 1. Development: deno task start
 * 2. Build: deno task build
 */

await start(manifest, config);
