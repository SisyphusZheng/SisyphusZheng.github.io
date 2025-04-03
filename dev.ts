#!/usr/bin/env -S deno run -A --watch=static/,routes/

import dev from "$fresh/dev.ts";
import config from "./fresh.config.ts";

import "$std/dotenv/load.ts";

if (Deno.args.includes("build")) {
  const { build } = await import("$fresh/src/dev/mod.ts");
  await build(config);
  Deno.exit(0);
}

await dev(import.meta.url, "./main.ts", config);
