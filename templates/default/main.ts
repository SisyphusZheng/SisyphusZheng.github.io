#!/usr/bin/env -S deno run -A

import { serve } from "$std/http/server.ts";
import { serveDir } from "$std/http/file_server.ts";
import { join, dirname, fromFileUrl } from "$std/path/mod.ts";

const port = 8000;
const currentDir = dirname(fromFileUrl(import.meta.url));
const distDir = join(currentDir, "dist");

// 检查dist目录是否存在
try {
  const stat = await Deno.stat(distDir);
  if (!stat.isDirectory) {
    console.error(`错误: ${distDir} 不是一个目录`);
    Deno.exit(1);
  }
} catch (error) {
  if (error instanceof Deno.errors.NotFound) {
    console.error(
      `错误: 构建输出目录 ${distDir} 不存在。请先运行 'deno task build'`
    );
    Deno.exit(1);
  }
  throw error;
}

console.log(`启动预览服务器: http://localhost:${port}/`);

await serve(
  async (req) => {
    return await serveDir(req, {
      fsRoot: distDir,
    });
  },
  { port }
);
