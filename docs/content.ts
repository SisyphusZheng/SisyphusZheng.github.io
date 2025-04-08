/**
 * Content management module
 */

import { siteConfig } from "./config.ts";

// Language type
export type Locale = "zh-CN" | "en-US";

// Content data
const content = {
  "zh-CN": {
    features: {
      title: "主要特性",
      items: [
        {
          icon: "🚀",
          title: "快速开发",
          description: "基于Deno和Fresh框架，提供现代化的开发体验",
        },
        {
          icon: "🔌",
          title: "插件系统",
          description: "灵活的插件系统，轻松扩展功能",
        },
        {
          icon: "🎨",
          title: "主题支持",
          description: "支持自定义主题，打造独特的网站风格",
        },
      ],
    },
    news: {
      title: "最新动态",
      blog: {
        title: "最新文章",
        readMore: "阅读更多",
      },
      updates: {
        title: "更新日志",
      },
    },
    quickStart: {
      title: "快速开始",
      subtitle: "只需几个简单的步骤，即可创建你的网站",
      cta: {
        text: "查看文档",
        link: "https://github.com/your-username/freshpress",
      },
    },
  },
  "en-US": {
    features: {
      title: "Features",
      items: [
        {
          icon: "🚀",
          title: "Rapid Development",
          description:
            "Built on Deno and Fresh framework for modern development experience",
        },
        {
          icon: "🔌",
          title: "Plugin System",
          description:
            "Flexible plugin system for easy functionality extension",
        },
        {
          icon: "🎨",
          title: "Theme Support",
          description: "Custom theme support for unique website styling",
        },
      ],
    },
    news: {
      title: "Latest News",
      blog: {
        title: "Latest Posts",
        readMore: "Read More",
      },
      updates: {
        title: "Changelog",
      },
    },
    quickStart: {
      title: "Quick Start",
      subtitle: "Create your website in just a few simple steps",
      cta: {
        text: "View Documentation",
        link: "https://github.com/freshpress/freshpress",
      },
    },
  },
};

/**
 * Get content for specified path
 */
export function getContent(path: string[], locale: Locale = "en-US"): string {
  let result = content[locale];
  for (const key of path) {
    if (result && typeof result === "object" && key in result) {
      result = result[key];
    } else {
      return "";
    }
  }
  return result as string;
}

/**
 * Get feature list
 */
export function getFeatures(locale: Locale = "en-US"): any[] {
  return content[locale].features.items;
}

/**
 * Get quick start steps
 */
export function getQuickStartSteps(locale: Locale = "en-US"): any[] {
  return [
    {
      title: locale === "zh-CN" ? "安装 Deno" : "Install Deno",
      code: "curl -fsSL https://deno.land/x/install/install.sh | sh",
    },
    {
      title: locale === "zh-CN" ? "创建项目" : "Create Project",
      code: "deno run -A -r https://freshpress.deno.dev my-website",
    },
    {
      title: locale === "zh-CN" ? "启动开发服务器" : "Start Development Server",
      code: "cd my-website && deno task dev",
    },
  ];
}

/**
 * Get changelog versions
 */
export function getChangelogVersions(locale: Locale = "en-US"): any[] {
  return [
    {
      version: "v0.3.0",
      date: "2024-04-08",
      changes:
        locale === "zh-CN"
          ? [
              "重构核心架构",
              "实现插件系统基础",
              "改进配置管理",
              "优化CLI工具",
              "完善项目模板",
            ]
          : [
              "Refactored core architecture",
              "Implemented plugin system foundation",
              "Improved configuration management",
              "Optimized CLI tools",
              "Enhanced project templates",
            ],
    },
  ];
}
