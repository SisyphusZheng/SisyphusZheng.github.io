#!/usr/bin/env -S deno run -A

/// <reference no-default-lib="true" />
/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />

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
