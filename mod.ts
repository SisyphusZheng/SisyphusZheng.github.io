/**
 * FreshPress - A modern static site generator based on Fresh framework
 * Built with Fresh 🍋 (https://fresh.deno.dev)
 * @module freshpress
 */

import { serve } from "https://deno.land/std@0.220.1/http/server.ts";
import { join } from "https://deno.land/std@0.220.1/path/mod.ts";
import { PluginManager } from "./core/plugin.ts";
import { ThemeManager } from "./core/theme.ts";
import { build } from "./core/build.ts";
import { ContentManager } from "./core/content.ts";

// 核心接口定义
export interface ContentManager {
  getContent(type: string, options?: any): Promise<Content[]>;
  renderContent(content: Content): Promise<string>;
  validateContent(content: Content): boolean;
}

export interface Theme {
  name: string;
  version: string;
  apply(): void;
  customize(options: ThemeOptions): void;
}

export interface Plugin {
  name: string;
  version: string;
  install(): Promise<void>;
  uninstall(): Promise<void>;
  activate?(): Promise<void>;
  deactivate?(): Promise<void>;
  configure(options: any): Promise<void>;
}

export interface Builder {
  build(): Promise<void>;
  watch(): Promise<void>;
  optimize(): Promise<void>;
}

// 导出核心类型
export interface Content {
  id: string;
  title: string;
  content: string;
  date?: string;
  tags?: string[];
  url?: string;
}

// 主题选项接口
export interface ThemeOptions {
  colors?: Record<string, string>;
  fonts?: Record<string, string>;
  spacing?: Record<string, string>;
  [key: string]: any;
}

// 配置接口
export interface FreshPressConfig {
  site: {
    title: string;
    description: string;
    baseUrl: string;
    language: string;
  };
  theme: {
    name: string;
    options: Record<string, unknown>;
  };
  plugins: {
    enabled: string[];
    options: Record<string, Record<string, unknown>>;
  };
  build: {
    outputDir: string;
    clean: boolean;
    minify: boolean;
  };
}

// 导出内置插件
export { BlogPlugin } from "./plugins/blog/mod.ts";
export { SearchPlugin } from "./plugins/search/mod.ts";
export { I18nPlugin } from "./plugins/i18n/mod.ts";
export { ProjectsPlugin } from "./plugins/projects/mod.ts";
export { ResumePlugin } from "./plugins/resume/mod.ts";

// 导出核心模块
export * from "./core/plugin.ts";
export * from "./core/theme.ts";
export * from "./core/content.ts";
export * from "./core/build.ts";

// 导出配置
export { siteConfig } from "./docs/config.ts";

/**
 * 定义配置的辅助函数
 */
export function defineConfig(config: FreshPressConfig): FreshPressConfig {
  return config;
}

// 导出版本信息
export const VERSION = "0.3.0";

/**
 * FreshPress信息
 */
export const about = {
  name: "FreshPress",
  description: "A modern static site generator based on Fresh framework",
  repository: "https://deno.land/x/freshpress",
  author: "FreshPress Team",
  license: "MIT",
};

// 导出插件管理器
export const pluginManager = new PluginManager();

// 导出主题管理器
export const themeManager = new ThemeManager();

// 默认导出
export default {
  VERSION,
  about,
};
