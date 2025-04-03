import { signal, effect } from "https://esm.sh/@preact/signals@1.2.1";

export type Locale = "zh-CN" | "en-US";

type TranslationType = {
  [K in Locale]: {
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
    };
  };
};

// 从 localStorage 获取保存的语言设置，如果没有则使用浏览器语言
const getInitialLocale = (): Locale => {
  if (typeof window === "undefined") return "zh-CN";
  
  const savedLocale = localStorage.getItem("locale") as Locale;
  if (savedLocale && (savedLocale === "zh-CN" || savedLocale === "en-US")) {
    return savedLocale;
  }

  const browserLang = navigator.language;
  return browserLang.startsWith("zh") ? "zh-CN" : "en-US";
};

export const currentLocale = signal<Locale>(getInitialLocale());

// 监听语言变化并保存到 localStorage
if (typeof window !== "undefined") {
  effect(() => {
    localStorage.setItem("locale", currentLocale.value);
    document.documentElement.lang = currentLocale.value;
  });
}

export const translations: TranslationType = {
  "zh-CN": {
    nav: {
      home: "首页",
      blog: "博客",
      projects: "项目",
      resume: "简历",
    },
    hero: {
      title: "你好，我是郑治",
      subtitle: "一名热爱技术的前端开发者",
      blog: "阅读博客",
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
    },
    stats: {
      blogViews: "博客浏览量",
      blogFollowers: "博客粉丝",
      articles: "社区收录文章",
      projects: "开源项目",
    },
    search: {
      placeholder: "搜索文章和项目...",
      noResults: "未找到相关结果",
      searching: "搜索中...",
    },
  },
  "en-US": {
    nav: {
      home: "Home",
      blog: "Blog",
      projects: "Projects",
      resume: "Resume",
    },
    hero: {
      title: "Hi, I'm Zhi Zheng",
      subtitle: "A passionate frontend developer",
      blog: "Read Blog",
      projects: "View Projects",
    },
    skills: {
      title: "Skills",
    },
    news: {
      title: "Latest Updates",
      blog: {
        title: "Latest Posts",
        readMore: "Read More",
      },
      project: {
        title: "Latest Projects",
        viewProject: "View Project",
      },
    },
    stats: {
      blogViews: "Blog Views",
      blogFollowers: "Blog Followers",
      articles: "Featured Articles",
      projects: "Open Source Projects",
    },
    search: {
      placeholder: "Search posts and projects...",
      noResults: "No results found",
      searching: "Searching...",
    },
  },
};

export function t(key: string, locale: Locale = currentLocale.value): string {
  const keys = key.split(".");
  let value: any = translations[locale];
  
  for (const k of keys) {
    if (value === undefined) return key;
    value = value[k];
  }
  
  return value || key;
} 