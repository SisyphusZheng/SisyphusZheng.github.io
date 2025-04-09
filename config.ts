// 默认站点配置
export const config = {
  site: {
    title: "FreshPress",
    description: "现代静态网站生成器",
    language: ["en-US", "zh-CN"],
  },
  plugins: {
    enabled: ["blog", "projects", "i18n", "search", "resume"],
  },
  theme: {
    default: "default",
  },
};
