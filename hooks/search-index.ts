/**
 * 搜索索引监控钩子
 * 确保search-index.json文件存在且是最新的
 */

import { exists } from "https://deno.land/std@0.167.0/fs/exists.ts";
import { debounce } from "https://deno.land/std@0.167.0/async/debounce.ts";

// 检查搜索索引文件是否存在，不存在则创建
export async function ensureSearchIndex() {
  try {
    const indexExists = await exists("./static/search-index.json");

    if (!indexExists) {
      console.log("⚠️ 搜索索引文件不存在，正在生成...");

      // 运行索引生成脚本
      const process = Deno.run({
        cmd: ["deno", "run", "-A", "scripts/generate-search-index-dev.ts"],
        stdout: "piped",
        stderr: "piped",
      });

      const status = await process.status();

      if (!status.success) {
        const stderr = new TextDecoder().decode(await process.stderrOutput());
        console.error("❌ 搜索索引生成失败:", stderr);
      } else {
        console.log("✅ 搜索索引生成成功");
      }

      process.close();
    }
  } catch (error) {
    console.error("检查搜索索引时出错:", error);
  }
}

// 防抖函数，避免频繁更新
export const debouncedEnsureSearchIndex = debounce(ensureSearchIndex, 2000);

// 在开发环境中监听博客和项目文件变化
export function watchContentChanges() {
  if (Deno.env.get("DENO_ENV") !== "production") {
    try {
      // 监听博客文件夹变化
      const watcher = Deno.watchFs(["./blog", "./data/config.ts"]);

      (async () => {
        for await (const event of watcher) {
          if (event.kind === "modify" || event.kind === "create") {
            console.log("🔄 检测到内容变化，将更新搜索索引...");
            await debouncedEnsureSearchIndex();
          }
        }
      })();

      console.log("👀 已启动内容变化监控，将自动更新搜索索引");
    } catch (error) {
      console.error("设置文件监控时出错:", error);
    }
  }
}
