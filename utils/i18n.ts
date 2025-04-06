import { signal, effect } from "https://esm.sh/@preact/signals@1.2.1";

export type Locale = "zh-CN" | "en-US";

type TranslationType = {
  [K in Locale]: {
    siteName: string;
    description: string;
    nav: {
      home: string;
      blog: string;
      projects: string;
      resume: string;
    };
    hero: {
      title: string;
      subtitle: string;
      blog: string;
      projects: string;
    };
    skills: {
      title: string;
    };
    news: {
      title: string;
      blog: {
        title: string;
        readMore: string;
      };
      project: {
        title: string;
        viewProject: string;
      };
      updates?: {
        title: string;
        versions: Array<{
          version: string;
          date: string;
          changes: string[];
        }>;
      };
    };
    stats: {
      blogViews: string;
      blogFollowers: string;
      articles: string;
      projects: string;
    };
    search: {
      placeholder: string;
      noResults: string;
      searching: string;
      blog: string;
      project: string;
      type: string;
      title: string;
      tags: string;
      date: string;
      all: string;
      recentSearches: string;
      clearHistory: string;
      pressToSearch: string;
    };
    blog: {
      title: string;
      description: string;
      readMore: string;
      backToList: string;
      publishedOn: string;
      updatedOn: string;
      tags: string;
      relatedPosts: string;
      latestPosts: string;
      popularPosts: string;
      searchPlaceholder?: string;
      allTags?: string;
      noPosts?: string;
      pagination?: {
        previous: string;
        next: string;
        pageInfo: string;
      };
    };
    project: {
      title: string;
      description: string;
      viewProject: string;
      visitSite: string;
      viewSource: string;
      technologies: string;
      features: string;
      details: string;
    };
    common: {
      loading: string;
      error: string;
      success: string;
      retry: string;
      cancel: string;
      confirm: string;
      save: string;
      delete: string;
      edit: string;
      preview: string;
    };
    errors: {
      notFound: string;
      pageNotFound: string;
      returnHome: string;
      serverError: string;
    };
    footer: {
      copyright: string;
      poweredBy: string;
      socialLinks: string;
      links?: {
        github: string;
        twitter: string;
        discord: string;
        docs: string;
      };
    };
    features?: {
      title: string;
      items: Array<{
        icon: string;
        title: string;
        description: string;
      }>;
    };
    quickStart?: {
      title: string;
      subtitle: string;
      steps: Array<{
        title: string;
        code: string;
      }>;
      cta: {
        text: string;
        link: string;
      };
    };
    resume?: {
      basicInfo: string;
      name: string;
      education: string;
      skills: string;
      projects: string;
      experience: string;
      email: string;
      github: string;
      projectDescription: string;
      responsibility1: string;
      responsibility2: string;
    };
  };
};

// Get saved language setting from localStorage, or use browser language if not available
const getInitialLocale = (): Locale => {
  if (typeof window === "undefined") return "en-US";

  const savedLocale = localStorage.getItem("locale") as Locale;
  if (savedLocale && (savedLocale === "zh-CN" || savedLocale === "en-US")) {
    return savedLocale;
  }

  const browserLang = navigator.language;
  return browserLang.startsWith("zh") ? "zh-CN" : "en-US";
};

export const currentLocale = signal<Locale>(getInitialLocale());

// Monitor language changes and save to localStorage
if (typeof window !== "undefined") {
  effect(() => {
    localStorage.setItem("locale", currentLocale.value);
    document.documentElement.lang = currentLocale.value;
  });
}

export const translations: TranslationType = {
  "zh-CN": {
    siteName: "FreshPress",
    description: "基于Fresh框架的现代静态站点生成器",
    nav: {
      home: "首页",
      blog: "博客",
      projects: "项目",
      resume: "简历",
    },
    hero: {
      title: "FreshPress",
      subtitle: "基于Fresh的现代静态站点生成器，快速构建你的网站",
      blog: "浏览博客",
      projects: "查看项目",
    },
    skills: {
      title: "技术栈",
    },
    news: {
      title: "最新动态",
      blog: {
        title: "最新博客",
        readMore: "阅读更多",
      },
      project: {
        title: "最新项目",
        viewProject: "查看项目",
      },
      updates: {
        title: "更新日志",
        versions: [
          {
            version: "v0.2.0",
            date: "2024-04-07",
            changes: [
              "添加暗色主题支持",
              "增强Markdown渲染功能",
              "完整的静态站点生成支持",
              "修复多语言显示问题",
            ],
          },
          {
            version: "v0.1.0",
            date: "2024-03-21",
            changes: [
              "初始项目设置",
              "基本博客功能实现",
              "项目展示页面",
              "响应式设计支持",
            ],
          },
        ],
      },
    },
    stats: {
      blogViews: "博客浏览量",
      blogFollowers: "博客关注者",
      articles: "社区文章",
      projects: "开源项目",
    },
    search: {
      placeholder: "搜索文章和项目...",
      noResults: "未找到相关结果",
      searching: "搜索中...",
      blog: "博客",
      project: "项目",
      type: "类型",
      title: "标题",
      tags: "标签",
      date: "日期",
      all: "全部",
      recentSearches: "最近搜索",
      clearHistory: "清除历史",
      pressToSearch: "输入关键词搜索",
    },
    blog: {
      title: "博客文章",
      description: "分享技术见解和项目经验",
      readMore: "阅读更多 →",
      backToList: "返回列表",
      publishedOn: "发布于",
      updatedOn: "更新于",
      tags: "标签",
      relatedPosts: "相关文章",
      latestPosts: "最新文章",
      popularPosts: "热门文章",
      searchPlaceholder: "搜索文章...",
      allTags: "全部",
      noPosts: "没有找到匹配的文章",
      pagination: {
        previous: "上一页",
        next: "下一页",
        pageInfo: "第 {current} 页，共 {total} 页",
      },
    },
    project: {
      title: "项目展示",
      description: "我参与的一些开源和个人项目",
      viewProject: "查看项目",
      visitSite: "访问网站",
      viewSource: "查看源码",
      technologies: "使用技术",
      features: "主要特性",
      details: "项目详情",
    },
    common: {
      loading: "加载中",
      error: "错误",
      success: "成功",
      retry: "重试",
      cancel: "取消",
      confirm: "确认",
      save: "保存",
      delete: "删除",
      edit: "编辑",
      preview: "预览",
    },
    errors: {
      notFound: "未找到",
      pageNotFound: "页面不存在",
      returnHome: "返回首页",
      serverError: "服务器错误",
    },
    footer: {
      copyright: "版权所有",
      poweredBy: "技术支持",
      socialLinks: "社交链接",
      links: {
        github: "GitHub",
        twitter: "Twitter",
        discord: "Discord",
        docs: "文档",
      },
    },
    features: {
      title: "主要特性",
      items: [
        {
          icon: "🚀",
          title: "现代化架构",
          description:
            "基于Deno和Fresh框架，使用岛屿架构（Islands Architecture）实现高性能渲染，最小化客户端JavaScript。",
        },
        {
          icon: "��",
          title: "多语言支持",
          description:
            "内置国际化系统，轻松支持多语言内容，自动根据用户语言设置切换显示内容。",
        },
        {
          icon: "🔍",
          title: "智能搜索",
          description:
            "全文搜索功能，支持搜索博客文章、项目和其他内容，根据相关性排序结果。",
        },
        {
          icon: "📝",
          title: "Markdown增强",
          description:
            "支持代码高亮、自动目录生成、自定义组件等Markdown增强功能，让内容展示更丰富。",
        },
        {
          icon: "🎨",
          title: "主题系统",
          description:
            "基于CSS变量的主题系统，支持亮色和暗色模式，可自定义网站风格和颜色方案。",
        },
        {
          icon: "⚡",
          title: "静态站点生成",
          description:
            "支持完全静态化生成，部署到任何静态托管服务，同时保留服务端功能。",
        },
      ],
    },
    quickStart: {
      title: "快速开始",
      subtitle: "只需几步，即可创建您自己的FreshPress网站",
      steps: [
        {
          title: "1. 克隆仓库",
          code: "git clone https://github.com/username/freshpress.git my-website",
        },
        {
          title: "2. 启动开发服务器",
          code: "cd my-website\ndeno task start",
        },
        {
          title: "3. 创建内容",
          code: "# 在blog目录下创建Markdown文件\ntouch blog/my-first-post.md",
        },
      ],
      cta: {
        text: "GitHub仓库",
        link: "https://github.com/username/freshpress",
      },
    },
    resume: {
      basicInfo: "基本信息",
      name: "姓名",
      education: "学历",
      skills: "技能",
      projects: "项目经验",
      experience: "工作经验",
      email: "邮箱",
      github: "GitHub",
      projectDescription: "基于Fresh框架的现代静态站点生成器",
      responsibility1: "开发和维护企业级Web应用",
      responsibility2: "优化前端架构和构建流程",
    },
  },
  "en-US": {
    siteName: "FreshPress",
    description: "Modern static site generator based on Fresh framework",
    nav: {
      home: "Home",
      blog: "Blog",
      projects: "Projects",
      resume: "Resume",
    },
    hero: {
      title: "FreshPress",
      subtitle:
        "Modern static site generator based on Fresh, build your website quickly",
      blog: "Browse Blog",
      projects: "View Projects",
    },
    skills: {
      title: "Tech Stack",
    },
    news: {
      title: "Latest Updates",
      blog: {
        title: "Latest Blog",
        readMore: "Read More",
      },
      project: {
        title: "Latest Projects",
        viewProject: "View Project",
      },
      updates: {
        title: "Changelog",
        versions: [
          {
            version: "v0.2.0",
            date: "2024-04-07",
            changes: [
              "Added dark theme support",
              "Enhanced Markdown rendering",
              "Complete static site generation support",
              "Fixed multilingual display issues",
            ],
          },
          {
            version: "v0.1.0",
            date: "2024-03-21",
            changes: [
              "Initial project setup",
              "Basic blog functionality",
              "Project showcase page",
              "Responsive design support",
            ],
          },
        ],
      },
    },
    stats: {
      blogViews: "Blog Views",
      blogFollowers: "Blog Followers",
      articles: "Community Articles",
      projects: "Open Source Projects",
    },
    search: {
      placeholder: "Search articles and projects...",
      noResults: "No relevant results found",
      searching: "Searching...",
      blog: "Blog",
      project: "Project",
      type: "Type",
      title: "Title",
      tags: "Tags",
      date: "Date",
      all: "All",
      recentSearches: "Recent Searches",
      clearHistory: "Clear History",
      pressToSearch: "Enter keywords to search",
    },
    blog: {
      title: "Blog Posts",
      description: "Sharing technical insights and project experiences",
      readMore: "Read More →",
      backToList: "Back to List",
      publishedOn: "Published on",
      updatedOn: "Updated on",
      tags: "Tags",
      relatedPosts: "Related Posts",
      latestPosts: "Latest Posts",
      popularPosts: "Popular Posts",
      searchPlaceholder: "Search articles...",
      allTags: "All",
      noPosts: "No matching articles found",
      pagination: {
        previous: "Previous",
        next: "Next",
        pageInfo: "Page {current} of {total}",
      },
    },
    project: {
      title: "Project Showcase",
      description:
        "Some open source and personal projects I've participated in",
      viewProject: "View Project",
      visitSite: "Visit Website",
      viewSource: "View Source",
      technologies: "Technologies Used",
      features: "Key Features",
      details: "Project Details",
    },
    common: {
      loading: "Loading",
      error: "Error",
      success: "Success",
      retry: "Retry",
      cancel: "Cancel",
      confirm: "Confirm",
      save: "Save",
      delete: "Delete",
      edit: "Edit",
      preview: "Preview",
    },
    errors: {
      notFound: "Not Found",
      pageNotFound: "Page Not Found",
      returnHome: "Return Home",
      serverError: "Server Error",
    },
    footer: {
      copyright: "Copyright",
      poweredBy: "Powered By",
      socialLinks: "Social Links",
      links: {
        github: "GitHub",
        twitter: "Twitter",
        discord: "Discord",
        docs: "Documentation",
      },
    },
    features: {
      title: "Key Features",
      items: [
        {
          icon: "🚀",
          title: "Modern Architecture",
          description:
            "Based on Deno and Fresh framework, using Islands Architecture for high-performance rendering with minimal client-side JavaScript.",
        },
        {
          icon: "🌏",
          title: "Multilingual Support",
          description:
            "Built-in internationalization system, easily support multilingual content, automatically switch display content according to user language settings.",
        },
        {
          icon: "🔍",
          title: "Smart Search",
          description:
            "Full-text search functionality, support searching blog posts, projects and other content, sorting results by relevance.",
        },
        {
          icon: "📝",
          title: "Enhanced Markdown",
          description:
            "Support for code highlighting, automatic table of contents generation, custom components and other Markdown enhancements for richer content presentation.",
        },
        {
          icon: "🎨",
          title: "Theme System",
          description:
            "CSS variable-based theme system, supporting light and dark modes, customizable website styles and color schemes.",
        },
        {
          icon: "⚡",
          title: "Static Site Generation",
          description:
            "Support for fully static generation, deployment to any static hosting service, while retaining server-side functionality.",
        },
      ],
    },
    quickStart: {
      title: "Quick Start",
      subtitle: "Just a few steps to create your own FreshPress website",
      steps: [
        {
          title: "1. Clone Repository",
          code: "git clone https://github.com/username/freshpress.git my-website",
        },
        {
          title: "2. Start Development Server",
          code: "cd my-website\ndeno task start",
        },
        {
          title: "3. Create Content",
          code: "# Create Markdown files in the blog directory\ntouch blog/my-first-post.md",
        },
      ],
      cta: {
        text: "GitHub Repository",
        link: "https://github.com/username/freshpress",
      },
    },
    resume: {
      basicInfo: "Basic Information",
      name: "Name",
      education: "Education",
      skills: "Skills",
      projects: "Projects",
      experience: "Work Experience",
      email: "Email",
      github: "GitHub",
      projectDescription:
        "Modern static site generator based on Fresh framework",
      responsibility1: "Developed and maintained enterprise web applications",
      responsibility2: "Optimized frontend architecture and build processes",
    },
  },
};

// Use nested keys to access translations
export function t(key: string, locale: Locale = currentLocale.value): string {
  const keys = key.split(".");
  let result: any = translations[locale];

  for (const k of keys) {
    if (result && typeof result === "object" && k in result) {
      result = result[k];
    } else {
      console.warn(`Translation key not found: ${key}`);
      return key;
    }
  }

  return result;
}

// Toggle between available locales
export function toggleLocale(): void {
  // 切换语言
  const newLocale = currentLocale.value === "zh-CN" ? "en-US" : "zh-CN";

  // 先设置currentLocale值，确保signal更新
  currentLocale.value = newLocale;

  // 保存到localStorage
  if (typeof window !== "undefined") {
    localStorage.setItem("locale", newLocale);

    // 使用强制重定向而不是简单刷新
    // 构建相同URL但添加时间戳参数强制浏览器不使用缓存
    const currentUrl = window.location.href;
    // 清除可能已存在的lang参数
    const baseUrl = currentUrl.split("?")[0];
    const redirectUrl = `${baseUrl}?lang=${newLocale}&t=${Date.now()}`;

    console.log("完全切换语言到:", newLocale);
    window.location.href = redirectUrl;
  }
}

// Format date according to current locale
export function formatDate(
  date: Date | string,
  locale: Locale = currentLocale.value
): string {
  const d = typeof date === "string" ? new Date(date) : date;

  if (locale === "zh-CN") {
    return d.toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
