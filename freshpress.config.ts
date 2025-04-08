import { defineConfig } from "./mod.ts";

/**
 * FreshPress 站点配置
 * 编辑此文件以自定义您的站点设置
 */
export const config = defineConfig({
  // 站点基本信息
  site: {
    title: "FreshPress 站点",
    description: "使用 FreshPress 构建的现代化静态网站",
    baseUrl: "https://example.com",
    language: "zh-CN",
  },

  // 主题设置
  theme: {
    name: "default",
    options: {
      // 主题颜色配置
      colors: {
        primary: "#3b82f6",
        secondary: "#10b981",
        accent: "#8b5cf6",
      },
      // 字体配置
      fonts: {
        heading: "system-ui, sans-serif",
        body: "system-ui, sans-serif",
      },
    },
  },

  // 插件配置
  plugins: {
    enabled: [
      "blog", // 博客功能
      "search", // 搜索功能
      "i18n", // 国际化功能
      "projects", // 项目展示功能
      "resume", // 简历功能
    ],

    // 插件选项配置
    options: {
      // 博客插件配置
      blog: {
        postsDir: "./docs/blog", // 博客文章目录
        postsPerPage: 10, // 每页显示文章数
        showTags: true, // 显示标签
        showCategories: true, // 显示分类
      },

      // 搜索插件配置
      search: {
        indexContent: true, // 索引全文内容
        highlightResults: true, // 高亮搜索结果
        searchableTypes: ["blog", "page", "project"], // 可搜索的内容类型
      },

      // 国际化插件配置
      i18n: {
        defaultLocale: "zh-CN", // 默认语言
        locales: ["en-US", "zh-CN"], // 支持的语言列表
        translationsDir: "./docs/translations", // 翻译文件目录
        detectBrowserLocale: true, // 自动检测浏览器语言
      },

      // 项目展示插件配置
      projects: {
        projectsDir: "./docs/projects", // 项目数据目录
        showcaseLimit: 6, // 首页展示项目数量
      },

      // 简历插件配置
      resume: {
        resumeFile: "./docs/resume.json", // 简历数据文件
        allowDownload: true, // 允许下载PDF版本
      },
    },
  },

  // 构建配置
  build: {
    outputDir: "./_site", // 输出目录
    clean: true, // 构建前清理输出目录
    minify: true, // 压缩输出
  },
});

export default config;
