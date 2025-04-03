#!/usr/bin/env -S deno run -A --watch=static/,routes/

import { start } from "$fresh/server.ts";
import manifest from "./fresh.gen.ts";
import config from "./fresh.config.ts";

await start(manifest, config); 