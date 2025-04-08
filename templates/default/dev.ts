#!/usr/bin/env -S deno run -A

import { serve } from "$fresh/server.ts";
import { config } from "$freshpress/mod.ts";
import { dirname, fromFileUrl, join } from "$std/path/mod.ts";

const currentDir = dirname(fromFileUrl(import.meta.url));

// 获取命令行参数
const build = Deno.args.includes("build");

if (build) {
  const { buildSite } = await import("$freshpress/core/build.ts");

  console.log("开始构建静态网站...");

  try {
    await buildSite({
      rootDir: currentDir,
      outDir: join(currentDir, "dist"),
      config,
    });

    console.log("网站构建成功！输出目录：dist/");
  } catch (error) {
    console.error("构建失败：", error);
    Deno.exit(1);
  }
} else {
  const { createFreshConfig } = await import("$freshpress/core/index.ts");

  const freshConfig = await createFreshConfig({
    rootDir: currentDir,
    config,
  });

  console.log(`启动开发服务器: http://localhost:8000/`);

  await serve(freshConfig.handle, {
    port: 8000,
    onListen() {
      console.log("服务器已启动");
    },
  });
}
