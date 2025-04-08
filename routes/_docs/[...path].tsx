/**
 * FreshPress 文档路由处理器
 * 处理 docs/ 目录下的 Markdown 文件，将其转换为 HTML 页面
 */

import { Handlers, PageProps } from "$fresh/server.ts";
import { join, dirname } from "$std/path/mod.ts";
import { exists } from "$std/fs/exists.ts";
import {
  parseMarkdownFiles,
  parseMarkdownContent,
} from "../../core/content.ts";
import DocsLayout from "../../components/DocsLayout.tsx";
import Markdown from "../../components/Markdown.tsx";

// 获取站点配置
let siteConfig: any = {
  title: "FreshPress 文档",
  description: "基于 Deno 和 Fresh 构建的现代静态站点生成器",
  themeConfig: {
    nav: [
      { text: "指南", link: "/guide/" },
      { text: "参考", link: "/reference/" },
    ],
    sidebar: {
      "/guide/": [
        {
          text: "指南",
          items: [
            { text: "介绍", link: "/guide/" },
            { text: "快速开始", link: "/guide/getting-started" },
            { text: "配置", link: "/guide/configuration" },
          ],
        },
      ],
      "/reference/": [
        {
          text: "API 参考",
          items: [
            { text: "配置", link: "/reference/configuration" },
            { text: "主题", link: "/reference/theme" },
            { text: "插件", link: "/reference/plugins" },
          ],
        },
      ],
    },
  },
};

// 尝试加载用户配置
try {
  const configPath = join(Deno.cwd(), "freshpress.config.ts");
  if (await exists(configPath)) {
    const userConfig = await import(configPath);
    siteConfig = userConfig.default || userConfig;
  }
} catch (error) {
  console.error("加载配置文件时出错:", error);
}

interface DocPageData {
  content: string;
  title: string;
  html: string;
  meta: Record<string, any>;
  path: string;
}

export const handler: Handlers<DocPageData | null> = {
  async GET(req, ctx) {
    // 获取请求路径
    const { path } = ctx.params;
    const pathSegments = (path as string).split("/").filter(Boolean);

    // 构建文件路径
    let filePath = "";
    let fileContent = "";
    let docData: DocPageData | null = null;

    // 目录映射
    const rootDir = "docs";

    // 尝试找到对应的 Markdown 文件
    const possiblePaths = [
      // /guide/ -> /docs/guide/index.md
      join(rootDir, ...pathSegments, "index.md"),
      // /guide/getting-started -> /docs/guide/getting-started.md
      join(rootDir, ...pathSegments) + ".md",
      // /guide/getting-started.html -> /docs/guide/getting-started.md
      join(rootDir, ...pathSegments.map((p) => p.replace(/\.html$/, ""))) +
        ".md",
    ];

    // 查找文件
    for (const path of possiblePaths) {
      try {
        if (await exists(path)) {
          filePath = path;
          fileContent = await Deno.readTextFile(path);
          break;
        }
      } catch (_error) {
        // 文件不存在，继续查找
      }
    }

    // 如果找到文件，解析内容
    if (fileContent) {
      const { meta, body } = parseMarkdownContent(fileContent);

      // 将 Markdown 渲染为 HTML
      // 这里可以使用 Markdown 解析库，现在简单起见直接返回内容
      docData = {
        content: body,
        title: meta.title || path.split("/").pop() || "文档",
        html: body, // 实际使用时应该将 body 转换为 HTML
        meta,
        path: filePath,
      };
    } else {
      // 未找到文件，返回 404
      return ctx.renderNotFound();
    }

    return ctx.render(docData);
  },
};

export default function DocPage({ data }: PageProps<DocPageData | null>) {
  if (!data) {
    return (
      <DocsLayout title="404 Not Found" config={siteConfig}>
        <div class="flex flex-col items-center justify-center min-h-screen py-12">
          <h1 class="text-4xl font-bold mb-4">404 Not Found</h1>
          <p class="text-lg mb-8">找不到请求的页面</p>
          <a
            href="/"
            class="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors"
          >
            返回首页
          </a>
        </div>
      </DocsLayout>
    );
  }

  return (
    <DocsLayout title={data.title} config={siteConfig}>
      <div class="prose max-w-none dark:prose-invert">
        <h1>{data.title}</h1>
        <Markdown content={data.content} />
      </div>
    </DocsLayout>
  );
}
