/**
 * 内容管理接口
 * 定义了FreshPress的内容模型和操作方法
 */

/**
 * 基础内容接口
 */
export interface Content {
  /** 内容唯一标识符 */
  id: string;
  /** 内容标题 */
  title: string;
  /** 内容正文 */
  content: string;
  /** 内容URL路径 */
  url: string;
  /** 创建日期 */
  date?: string;
  /** 更新日期 */
  updated?: string;
  /** 作者信息 */
  author?: string;
  /** 标签列表 */
  tags?: string[];
  /** 语言代码 */
  locale?: string;
  /** 元数据 */
  meta?: Record<string, unknown>;
}

/**
 * 博客文章接口
 */
export interface BlogPost extends Content {
  /** 文章描述/摘要 */
  description?: string;
  /** 封面图片 */
  cover?: string;
  /** 阅读时间（分钟） */
  readingTime?: number;
  /** 是否为草稿 */
  draft?: boolean;
}

/**
 * 项目接口
 */
export interface Project extends Content {
  /** 项目描述 */
  description: string;
  /** 项目技术栈 */
  technologies: string[];
  /** 项目链接 */
  link?: string;
  /** 项目源码 */
  source?: string;
  /** 项目图片 */
  image?: string;
  /** 是否为特色项目 */
  featured?: boolean;
}

/**
 * 页面接口
 */
export interface Page extends Content {
  /** 页面模板 */
  template?: string;
  /** 是否在导航中显示 */
  showInNav?: boolean;
  /** 导航顺序 */
  navOrder?: number;
}

/**
 * 内容管理器接口
 */
export interface ContentManager {
  /**
   * 获取指定类型的内容列表
   * @param type 内容类型
   * @param options 过滤选项
   */
  getContent<T extends Content>(
    type: string,
    options?: ContentOptions
  ): Promise<T[]>;

  /**
   * 获取单个内容
   * @param type 内容类型
   * @param id 内容ID
   */
  getContentById<T extends Content>(
    type: string,
    id: string
  ): Promise<T | null>;

  /**
   * 渲染内容
   * @param content 内容对象
   */
  renderContent(content: Content): Promise<string>;

  /**
   * 验证内容
   * @param content 内容对象
   * @param type 内容类型
   */
  validateContent(content: Content, type: string): boolean;
}

/**
 * 内容过滤选项
 */
export interface ContentOptions {
  /** 过滤标签 */
  tags?: string[];
  /** 过滤语言 */
  locale?: string;
  /** 排序字段 */
  sortBy?: string;
  /** 排序方向 */
  sortDirection?: "asc" | "desc";
  /** 分页限制 */
  limit?: number;
  /** 分页偏移 */
  offset?: number;
  /** 是否包含草稿 */
  includeDrafts?: boolean;
  /** 自定义过滤器 */
  filter?: (content: Content) => boolean;
}

/**
 * 内容源接口
 */
export interface ContentSource {
  /**
   * 从源加载内容
   * @param options 加载选项
   */
  loadContent(options?: any): Promise<Content[]>;

  /**
   * 源名称
   */
  name: string;

  /**
   * 源类型
   */
  type: string;
}

/**
 * 内容转换器接口
 */
export interface ContentTransformer {
  /**
   * 转换内容
   * @param content 原始内容
   */
  transform(content: Content): Promise<Content>;

  /**
   * 转换器名称
   */
  name: string;
}

/**
 * FreshPress 内容管理核心模块
 * 处理文档和其他内容文件的解析和渲染
 */

import {
  join,
  extname,
  basename,
  dirname,
} from "https://deno.land/std@0.208.0/path/mod.ts";
import { walk } from "https://deno.land/std@0.208.0/fs/walk.ts";
import { exists } from "https://deno.land/std@0.208.0/fs/exists.ts";

/**
 * 内容文件接口
 */
export interface ContentFile {
  id: string; // 唯一标识符
  path: string; // 文件路径
  url: string; // 访问URL
  title: string; // 标题
  content: string; // 原始内容
  html?: string; // 渲染后的HTML
  meta: Record<string, any>; // 元数据
}

/**
 * 解析 Markdown 文件
 * @param directory 目录路径
 * @returns 解析后的内容文件数组
 */
export async function parseMarkdownFiles(
  directory: string
): Promise<ContentFile[]> {
  const files: ContentFile[] = [];

  // 检查目录是否存在
  if (!(await exists(directory))) {
    console.warn(`目录不存在: ${directory}`);
    return files;
  }

  // 遍历目录
  for await (const entry of walk(directory, {
    exts: ["md", "mdx"],
    includeDirs: false,
  })) {
    try {
      // 读取文件内容
      const content = await Deno.readTextFile(entry.path);

      // 提取元数据和内容
      const { meta, body } = parseMarkdownContent(content);

      // 生成URL
      const relativePath = entry.path.substring(directory.length);
      const url = generateUrlFromPath(relativePath);

      // 创建内容文件对象
      const file: ContentFile = {
        id: basename(entry.path, extname(entry.path)),
        path: entry.path,
        url,
        title: meta.title || generateTitleFromPath(relativePath),
        content: body,
        meta,
      };

      files.push(file);
    } catch (error) {
      console.error(`解析文件 ${entry.path} 时出错:`, error);
    }
  }

  return files;
}

/**
 * 解析 Markdown 内容，提取元数据和正文
 * @param content Markdown 内容
 * @returns 元数据和正文
 */
export function parseMarkdownContent(content: string): {
  meta: Record<string, any>;
  body: string;
} {
  // 默认值
  const result = {
    meta: {},
    body: content,
  };

  // 尝试提取前置元数据
  const frontMatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
  const match = content.match(frontMatterRegex);

  if (!match) {
    return result;
  }

  // 提取元数据和正文
  const [, frontMatter, body] = match;

  // 解析元数据
  const meta: Record<string, any> = {};
  const lines = frontMatter.split("\n");

  let inListBlock = false;
  let currentKey = "";
  let listItems: string[] = [];

  for (const line of lines) {
    // 处理缩进的列表项
    if (inListBlock) {
      const listMatch = line.match(/^\s*-\s+(.+)$/);
      if (listMatch) {
        listItems.push(listMatch[1].trim());
        continue;
      } else {
        inListBlock = false;
        if (listItems.length > 0) {
          meta[currentKey] = listItems;
        }
      }
    }

    // 处理普通键值对
    const keyValueMatch = line.match(/^(\w+):\s*(.*)$/);
    if (keyValueMatch) {
      const [, key, value] = keyValueMatch;
      const trimmedValue = value.trim();

      // 检查是否是列表开始
      if (trimmedValue === "") {
        inListBlock = true;
        currentKey = key;
        listItems = [];
      } else {
        meta[key] = trimmedValue;
      }
    }
  }

  return { meta, body };
}

/**
 * 从文件路径生成URL
 * @param path 文件路径
 * @returns URL
 */
function generateUrlFromPath(path: string): string {
  // 移除 .md 或 .mdx 扩展名
  let url = path.replace(/\.(md|mdx)$/, "");

  // 处理index文件
  url = url.replace(/\/index$/, "/");

  // 确保以 / 开头
  if (!url.startsWith("/")) {
    url = "/" + url;
  }

  return url;
}

/**
 * 从文件路径生成标题
 * @param path 文件路径
 * @returns 标题
 */
function generateTitleFromPath(path: string): string {
  // 获取文件名（不含扩展名）
  const name = basename(path, extname(path));

  // 如果是index文件，使用父目录名
  if (name === "index") {
    const dir = dirname(path);
    return dir.split("/").pop() || "Home";
  }

  // 将连字符替换为空格并首字母大写
  return name.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
