import { FreshPressConfig } from "$freshpress/mod.ts";

export const config: FreshPressConfig = {
  site: {
    title: "My FreshPress Site",
    description: "A modern static site built with FreshPress",
    language: "zh-CN",
    timezone: "Asia/Shanghai",
  },
  theme: {
    name: "default",
    options: {},
  },
  plugins: [],
  build: {
    output: "dist",
    clean: true,
  },
};

export default config;
