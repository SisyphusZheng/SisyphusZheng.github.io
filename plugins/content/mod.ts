/**
 * FreshPress内容管理插件
 * 提供内容管理和处理功能
 */

import { Plugin } from "../../core/plugin.ts";

/**
 * 内容接口
 */
export interface Content {
  id: string;
  title: string;
  content: string;
  date?: string;
  tags?: string[];
  url?: string;
  meta?: Record<string, any>;
}

/**
 * 内容插件配置
 */
export interface ContentPluginConfig {
  /** 内容缓存启用 */
  enableCache: boolean;
  /** 内容目录 */
  contentDir: string;
  /** 内容类型 */
  contentTypes: string[];
  /** 默认内容类型 */
  defaultType: string;
}

/**
 * 内容插件默认配置
 */
export const DEFAULT_CONFIG: ContentPluginConfig = {
  enableCache: true,
  contentDir: "content",
  contentTypes: ["page", "post", "project"],
  defaultType: "page",
};

/**
 * 内容插件类
 */
export class ContentPlugin implements Plugin {
  name = "content";
  version = "1.0.0";
  description = "Content management plugin for FreshPress";
  author = "FreshPress Team";

  /** 插件配置 */
  config: ContentPluginConfig;

  /** 内容缓存 */
  private contentCache: Map<string, Content[]> = new Map();

  constructor(config: Partial<ContentPluginConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * 安装插件
   */
  async install(): Promise<void> {
    // 创建内容目录
    try {
      await Deno.mkdir(this.config.contentDir, { recursive: true });

      // 为每种内容类型创建目录
      for (const type of this.config.contentTypes) {
        await Deno.mkdir(`${this.config.contentDir}/${type}`, {
          recursive: true,
        });
      }
    } catch (error) {
      // 目录可能已存在
      if (!(error instanceof Deno.errors.AlreadyExists)) {
        throw error;
      }
    }
  }

  /**
   * 卸载插件
   */
  async uninstall(): Promise<void> {
    // 清空缓存
    this.contentCache.clear();
  }

  /**
   * 激活插件
   */
  async activate(): Promise<void> {
    // 预加载内容
    if (this.config.enableCache) {
      for (const type of this.config.contentTypes) {
        await this.getContent(type);
      }
    }
  }

  /**
   * 停用插件
   */
  async deactivate(): Promise<void> {
    // 清空缓存
    this.contentCache.clear();
  }

  /**
   * 配置插件
   */
  async configure(options: Partial<ContentPluginConfig>): Promise<void> {
    this.config = { ...this.config, ...options };
  }

  /**
   * 获取内容
   */
  async getContent(
    type: string = this.config.defaultType,
    options: {
      refresh?: boolean;
      filter?: (content: Content) => boolean;
      sort?: (a: Content, b: Content) => number;
      limit?: number;
      offset?: number;
    } = {}
  ): Promise<Content[]> {
    const { refresh = false, filter, sort, limit, offset = 0 } = options;

    // 如果启用了缓存并且缓存中有数据，直接返回
    if (this.config.enableCache && !refresh && this.contentCache.has(type)) {
      let result = this.contentCache.get(type) || [];

      if (filter) {
        result = result.filter(filter);
      }

      if (sort) {
        result = [...result].sort(sort);
      }

      if (limit) {
        result = result.slice(offset, offset + limit);
      }

      return result;
    }

    // 否则从文件系统加载内容
    const contentPath = `${this.config.contentDir}/${type}`;
    const contentItems: Content[] = [];

    try {
      const entries = await Deno.readDir(contentPath);

      for await (const entry of entries) {
        if (
          entry.isFile &&
          (entry.name.endsWith(".md") || entry.name.endsWith(".json"))
        ) {
          const content = await this.loadContentFile(
            `${contentPath}/${entry.name}`
          );
          if (content) {
            contentItems.push(content);
          }
        }
      }

      // 更新缓存
      if (this.config.enableCache) {
        this.contentCache.set(type, contentItems);
      }

      // 应用过滤和排序
      let result = contentItems;

      if (filter) {
        result = result.filter(filter);
      }

      if (sort) {
        result = result.sort(sort);
      }

      if (limit) {
        result = result.slice(offset, offset + limit);
      }

      return result;
    } catch (error) {
      console.error(`Error loading content of type ${type}:`, error);
      return [];
    }
  }

  /**
   * 获取单个内容项
   */
  async getContentItem(
    id: string,
    type: string = this.config.defaultType
  ): Promise<Content | null> {
    // 先尝试从缓存获取
    if (this.config.enableCache && this.contentCache.has(type)) {
      const items = this.contentCache.get(type) || [];
      const item = items.find((item) => item.id === id);
      if (item) {
        return item;
      }
    }

    // 否则直接加载文件
    try {
      const mdPath = `${this.config.contentDir}/${type}/${id}.md`;
      const jsonPath = `${this.config.contentDir}/${type}/${id}.json`;

      // 检查文件是否存在
      try {
        await Deno.stat(mdPath);
        return this.loadContentFile(mdPath);
      } catch {
        try {
          await Deno.stat(jsonPath);
          return this.loadContentFile(jsonPath);
        } catch {
          return null;
        }
      }
    } catch (error) {
      console.error(`Error loading content item ${id} of type ${type}:`, error);
      return null;
    }
  }

  /**
   * 加载内容文件
   */
  private async loadContentFile(filePath: string): Promise<Content | null> {
    try {
      const content = await Deno.readTextFile(filePath);
      const id = filePath.split("/").pop()?.split(".")[0] || "";

      if (filePath.endsWith(".md")) {
        // 解析Markdown文件
        const {
          title,
          tags,
          date,
          content: mdContent,
        } = this.parseFrontMatter(content);
        return {
          id,
          title,
          content: mdContent,
          date,
          tags,
          url: `/${id}`,
        };
      } else if (filePath.endsWith(".json")) {
        // 解析JSON文件
        const data = JSON.parse(content);
        return {
          id,
          title: data.title || id,
          content: data.content || "",
          date: data.date,
          tags: data.tags,
          url: data.url || `/${id}`,
          meta: data,
        };
      }

      return null;
    } catch (error) {
      console.error(`Error loading content file ${filePath}:`, error);
      return null;
    }
  }

  /**
   * 解析Front Matter
   */
  private parseFrontMatter(content: string): Record<string, any> {
    // 使用简单的方法分割前言和内容
    const parts = content.trim().split(/---\r?\n/);

    // 如果不是有效的前言格式（至少有3个部分，第一个是空的）
    if (parts.length < 3) {
      return {
        title: "",
        date: "",
        tags: [],
        content: content,
      };
    }

    // 前言部分是第二部分
    const frontMatter = parts[1];
    // 内容部分是第三部分及之后的所有内容
    const contentParts = parts.slice(2);
    const mdContent = contentParts.join("---\n").trim();

    // 从前言中提取信息
    const titleMatch = frontMatter.match(/title:\s*"([^"]*)"/);
    const title = titleMatch ? titleMatch[1] : "";

    const dateMatch = frontMatter.match(/date:\s*"([^"]*)"/);
    const date = dateMatch ? dateMatch[1] : "";

    // 处理不同格式的tags
    let tags: string[] = [];
    const tagsMatch = frontMatter.match(/tags:\s*(.*)/)?.[1];

    if (tagsMatch) {
      if (tagsMatch.trim().startsWith("[") && tagsMatch.trim().endsWith("]")) {
        // 数组格式：["tag1", "tag2"]
        tags = tagsMatch
          .substring(tagsMatch.indexOf("[") + 1, tagsMatch.lastIndexOf("]"))
          .split(",")
          .map((tag) => tag.trim().replace(/"/g, ""));
      } else {
        // 字符串格式："tag1, tag2"
        tags = tagsMatch
          .replace(/"/g, "")
          .split(",")
          .map((tag) => tag.trim());
      }
    }

    return {
      title,
      date,
      tags,
      content: mdContent,
    };
  }

  /**
   * 保存内容
   */
  async saveContent(
    item: Content,
    type: string = this.config.defaultType
  ): Promise<boolean> {
    try {
      const path = `${this.config.contentDir}/${type}/${item.id}`;

      // 根据内容类型决定保存为Markdown还是JSON
      if (item.content && item.content.trim().length > 0) {
        // 保存为Markdown
        const frontMatter = `---
title: "${item.title}"
date: "${item.date || new Date().toISOString()}"
tags: ${JSON.stringify(item.tags || [])}
---

${item.content}`;

        await Deno.writeTextFile(`${path}.md`, frontMatter);
      } else {
        // 保存为JSON
        const data = {
          ...item,
          id: undefined, // 避免ID重复
        };

        await Deno.writeTextFile(`${path}.json`, JSON.stringify(data, null, 2));
      }

      // 更新缓存
      if (this.config.enableCache) {
        const contents = this.contentCache.get(type) || [];
        const index = contents.findIndex((c) => c.id === item.id);

        if (index >= 0) {
          contents[index] = item;
        } else {
          contents.push(item);
        }

        this.contentCache.set(type, contents);
      }

      return true;
    } catch (error) {
      console.error(`Error saving content ${item.id} of type ${type}:`, error);
      return false;
    }
  }

  /**
   * 删除内容
   */
  async deleteContent(
    id: string,
    type: string = this.config.defaultType
  ): Promise<boolean> {
    try {
      const mdPath = `${this.config.contentDir}/${type}/${id}.md`;
      const jsonPath = `${this.config.contentDir}/${type}/${id}.json`;

      let deleted = false;

      // 尝试删除Markdown文件
      try {
        await Deno.remove(mdPath);
        deleted = true;
      } catch {
        // 文件可能不存在
      }

      // 尝试删除JSON文件
      try {
        await Deno.remove(jsonPath);
        deleted = true;
      } catch {
        // 文件可能不存在
      }

      // 更新缓存
      if (deleted && this.config.enableCache) {
        const contents = this.contentCache.get(type) || [];
        const filtered = contents.filter((c) => c.id !== id);
        this.contentCache.set(type, filtered);
      }

      return deleted;
    } catch (error) {
      console.error(`Error deleting content ${id} of type ${type}:`, error);
      return false;
    }
  }

  /**
   * 获取版权信息
   */
  getCopyright(
    year: number = new Date().getFullYear(),
    text: string = ""
  ): string {
    const startYear = 2024;
    const yearText =
      startYear === year ? year.toString() : `${startYear}-${year}`;
    return `© ${yearText} ${text}`;
  }
}
