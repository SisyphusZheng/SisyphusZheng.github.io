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
      about: string;
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
    description: "Modern static site generator based on Fresh framework",
    nav: {
      home: "Home",
      blog: "Blog",
      projects: "Projects",
      resume: "Resume",
      about: "About",
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
      about: "About",
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
  currentLocale.value = currentLocale.value === "zh-CN" ? "en-US" : "zh-CN";
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
