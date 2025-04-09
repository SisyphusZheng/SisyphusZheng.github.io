#!/usr/bin/env -S deno run -A

/// <reference no-default-lib="true" />
/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />

import { serve } from "https://deno.land/std@0.208.0/http/server.ts";
import { serveDir } from "https://deno.land/std@0.208.0/http/file_server.ts";

// 从环境变量获取端口，默认为8000
const PORT = parseInt(Deno.env.get("PORT") || "8000");

// 启动HTTP服务器
console.log(`🚀 启动FreshPress静态服务器，端口：${PORT}`);

serve(
  async (req) => {
    return await serveDir(req, {
      fsRoot: "./_site",
      urlRoot: "",
      showDirListing: false,
      enableCors: true,
    });
  },
  { port: PORT }
);
