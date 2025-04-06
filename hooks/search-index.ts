/**
 * Hook to ensure the search index exists and is up to date
 * Useful when using search functionality
 */

import { exists } from "https://deno.land/std@0.167.0/fs/exists.ts";
import { debounce } from "https://deno.land/std@0.167.0/async/debounce.ts";

// 检查搜索索引文件是否存在，不存在则创建
export async function ensureSearchIndex() {
  try {
    const indexExists = await exists("./static/search-index.json");

    if (!indexExists) {
      console.log("⚠️ Search index file does not exist, generating...");

      // 运行索引生成脚本
      const process = Deno.run({
        cmd: ["deno", "run", "-A", "scripts/generate-search-index-dev.ts"],
        stdout: "piped",
        stderr: "piped",
      });

      const status = await process.status();

      if (!status.success) {
        const stderr = new TextDecoder().decode(await process.stderrOutput());
        console.error("❌ Search index generation failed:", stderr);
      } else {
        console.log("✅ Search index generation successful");
      }

      process.close();
    }
  } catch (error) {
    console.error("Error checking search index:", error);
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
            console.log("🔄 Detected content change, updating search index...");
            await debouncedEnsureSearchIndex();
          }
        }
      })();

      console.log(
        "👀 Content change monitoring started, search index will be automatically updated"
      );
    } catch (error) {
      console.error("Error setting file monitoring:", error);
    }
  }
}
