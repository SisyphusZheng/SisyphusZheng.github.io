#!/usr/bin/env -S deno run -A

/**
 * 初始化目录结构脚本
 * 检查并创建博客、项目和翻译所需的目录
 */

// 添加一个空的导出使文件成为模块
export {};

// 创建必要的目录结构
async function ensureDirectories() {
  console.log("📁 正在初始化必要的目录结构...");

  const directories = ["docs/blog", "docs/projects", "docs/translations"];

  for (const dir of directories) {
    try {
      await Deno.mkdir(dir, { recursive: true });
      console.log(`✅ 目录 ${dir} 已创建或已存在`);
    } catch (error) {
      console.error(`❌ 创建目录 ${dir} 失败:`, error);
    }
  }

  // 确保翻译文件存在
  await ensureTranslationFiles();

  console.log("✓ 目录初始化完成");
}

// 确保翻译文件存在
async function ensureTranslationFiles() {
  const translationsDir = "docs/translations";
  const locales = ["en-US", "zh-CN"] as const;

  const defaultTranslations: Record<
    (typeof locales)[number],
    Record<string, any>
  > = {
    "en-US": {
      site: {
        title: "FreshPress",
        description: "A modern static site generator based on Deno and Fresh",
      },
      nav: {
        home: "Home",
        blog: "Blog",
        projects: "Projects",
        resume: "Resume",
        about: "About",
      },
      search: {
        placeholder: "Search",
        noResults: "No results found",
        searching: "Searching...",
        results: "Search Results",
      },
    },
    "zh-CN": {
      site: {
        title: "FreshPress",
        description: "基于Deno和Fresh的现代静态站点生成器",
      },
      nav: {
        home: "首页",
        blog: "博客",
        projects: "项目",
        resume: "简历",
        about: "关于",
      },
      search: {
        placeholder: "搜索",
        noResults: "未找到结果",
        searching: "搜索中...",
        results: "搜索结果",
      },
    },
  };

  for (const locale of locales) {
    const filePath = `${translationsDir}/${locale}.json`;

    try {
      // 检查翻译文件是否存在
      try {
        await Deno.stat(filePath);
        console.log(`ℹ️ 翻译文件 ${locale}.json 已存在`);
      } catch (error) {
        // 如果文件不存在，创建默认翻译文件
        if (error instanceof Deno.errors.NotFound) {
          await Deno.writeTextFile(
            filePath,
            JSON.stringify(defaultTranslations[locale], null, 2)
          );
          console.log(`✅ 创建了默认的 ${locale}.json 翻译文件`);
        } else {
          throw error;
        }
      }
    } catch (error) {
      console.error(`❌ 处理翻译文件 ${locale}.json 失败:`, error);
    }
  }
}

// 运行脚本
await ensureDirectories();
