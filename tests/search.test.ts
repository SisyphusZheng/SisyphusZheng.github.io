// @ts-ignore
import {
  assertEquals,
  assertExists,
} from "https://deno.land/std@0.208.0/assert/mod.ts";
// @ts-ignore
import { SearchPlugin, SearchPluginConfig } from "../plugins/search/mod.ts";
// @ts-ignore
import { Content } from "../core/content.ts";

// @ts-ignore
Deno.test("SearchPlugin - 基本功能", async (t: any) => {
  const plugin = new SearchPlugin();

  await t.step("初始化", async () => {
    await plugin.install();
    await plugin.activate();
    assertExists(plugin);
  });

  await t.step("生成索引", async () => {
    const content: Content[] = [
      {
        id: "1",
        title: "测试文章",
        content: "这是一篇测试文章",
        url: "/test",
        meta: {
          type: "post",
          description: "测试描述",
        },
        tags: ["测试", "文章"],
      },
    ];

    await plugin.generateIndex(content);
    const results = await plugin.search("测试");
    assertEquals(results.length, 1);
    assertEquals(results[0].title, "测试文章");
  });

  await t.step("配置更新", async () => {
    const newConfig: Partial<SearchPluginConfig> = {
      resultLimit: 5,
      highlightResults: true,
    };

    await plugin.configure(newConfig);
    assertEquals(plugin.config.resultLimit, 5);
    assertEquals(plugin.config.highlightResults, true);
  });

  await t.step("清理", async () => {
    await plugin.deactivate();
    await plugin.uninstall();
  });
});
