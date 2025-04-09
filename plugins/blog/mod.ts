/**
 * FreshPress博客插件
 * 提供博客文章管理和渲染功能
 */

import { Plugin } from "../../core/plugin.ts";
import { BlogPost } from "../../core/content.ts";

/**
 * 博客插件配置
 */
export interface BlogPluginConfig {
  /** 文章目录 */
  postsDir: string;
  /** 每页文章数 */
  postsPerPage: number;
  /** 摘要长度 */
  excerptLength: number;
  /** 是否启用标签 */
  enableTags: boolean;
  /** 是否启用分类 */
  enableCategories: boolean;
  /** 是否启用评论 */
  enableComments: boolean;
  /** 是否显示阅读时间 */
  showReadingTime: boolean;
}

/**
 * 博客插件默认配置
 */
export const DEFAULT_CONFIG: BlogPluginConfig = {
  postsDir: "blog",
  postsPerPage: 10,
  excerptLength: 200,
  enableTags: true,
  enableCategories: false,
  enableComments: false,
  showReadingTime: true,
};

/**
 * 博客插件类
 */
export class BlogPlugin implements Plugin {
  name = "blog";
  version = "1.0.0";
  description = "Blog plugin for FreshPress";
  author = "FreshPress Team";
  initialized = false;

  /** 插件配置 */
  config: BlogPluginConfig;

  /** 博客文章缓存 */
  private posts: BlogPost[] = [];

  constructor(config: Partial<BlogPluginConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * 安装插件
   */
  async install(): Promise<void> {
    // 创建必要的目录
    try {
      await Deno.mkdir(this.config.postsDir, { recursive: true });
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
    // 插件卸载逻辑
  }

  /**
   * 激活插件
   */
  async activate(): Promise<void> {
    // 加载博客文章
    await this.loadPosts();
    this.initialized = true;
  }

  /**
   * 停用插件
   */
  async deactivate(): Promise<void> {
    // 清空缓存
    this.posts = [];
    this.initialized = false;
  }

  /**
   * 配置插件
   */
  async configure(options: Partial<BlogPluginConfig>): Promise<void> {
    this.config = { ...this.config, ...options };
  }

  /**
   * 加载所有博客文章
   */
  async loadPosts(): Promise<BlogPost[]> {
    this.posts = [];
    const postsDir = this.config.postsDir;
    console.log(`Loading blog posts from: ${postsDir}`);

    try {
      // 使用 Deno.readDirSync 替代 Deno.readDir
      const entries = Array.from(Deno.readDirSync(postsDir));
      console.log(`Found ${entries.length} entries in directory`);

      for (const entry of entries) {
        if (entry.isFile && entry.name.endsWith(".md")) {
          console.log(`Processing file: ${entry.name}`);
          const filePath = `${postsDir}/${entry.name}`;

          try {
            const content = await Deno.readTextFile(filePath);
            console.log(
              `Read content (${content.length} chars) from ${filePath}`
            );

            // 直接解析文件内容
            // 兼容不同的换行符
            const normalizedContent = content.replace(/\r\n/g, "\n");
            const frontMatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
            const match = normalizedContent.match(frontMatterRegex);

            if (!match) {
              console.log(`No front matter in ${filePath}`);
              // 尝试打印文件开头部分以便调试
              console.log(
                `File starts with: ${normalizedContent
                  .substring(0, 50)
                  .replace(/\n/g, "\\n")}...`
              );
              continue;
            }

            const [, frontMatter, markdown] = match;
            const meta = this.parseFrontMatter(frontMatter);

            // 生成博客文章对象
            const slug = meta.slug || entry.name.replace(/\.md$/, "");
            const post: BlogPost = {
              id: slug,
              title: meta.title || "Untitled",
              content: markdown,
              url: `/blog/${slug}`,
              date: meta.date,
              updated: meta.updated,
              author: meta.author,
              tags: meta.tags,
              locale: meta.locale,
              description: meta.excerpt || this.generateExcerpt(markdown),
              cover: meta.cover,
              readingTime: this.calculateReadingTime(markdown),
              draft: meta.draft === true,
              meta,
            };

            this.posts.push(post);
            console.log(`Added post: ${post.title} (${post.id})`);
          } catch (error) {
            console.error(`Error processing file ${filePath}:`, error);
          }
        }
      }

      // 按日期排序（最新的在前）
      this.posts.sort((a, b) => {
        const dateA = a.date ? new Date(a.date).getTime() : 0;
        const dateB = b.date ? new Date(b.date).getTime() : 0;
        return dateB - dateA;
      });

      console.log(`Total posts loaded: ${this.posts.length}`);
      return this.posts;
    } catch (error) {
      console.error("Error loading blog posts:", error);
      return [];
    }
  }

  /**
   * 解析博客文章文件
   */
  private async parsePost(filePath: string): Promise<BlogPost | null> {
    try {
      const content = await Deno.readTextFile(filePath);

      // 解析前端元数据（Front Matter）
      const frontMatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
      const match = content.match(frontMatterRegex);

      if (!match) {
        return null;
      }

      const [, frontMatter, markdown] = match;
      const meta = this.parseFrontMatter(frontMatter);

      // 生成ID和URL
      const id = meta.id || filePath.split("/").pop()?.replace(".md", "") || "";
      const url = meta.url || `/blog/${id}`;

      // 计算阅读时间
      const readingTime = this.calculateReadingTime(markdown);

      return {
        id,
        title: meta.title || "Untitled",
        content: markdown,
        url,
        date: meta.date,
        updated: meta.updated,
        author: meta.author,
        tags: meta.tags,
        locale: meta.locale,
        description: meta.description || this.generateExcerpt(markdown),
        cover: meta.cover,
        readingTime,
        draft: meta.draft === true,
        meta,
      };
    } catch (error) {
      console.error(`Error parsing post ${filePath}:`, error);
      return null;
    }
  }

  /**
   * 解析前端元数据
   */
  private parseFrontMatter(frontMatter: string): Record<string, any> {
    const meta: Record<string, any> = {};
    const lines = frontMatter.split("\n");

    let inTagsBlock = false;
    let tags: string[] = [];

    for (const line of lines) {
      // 处理缩进的标签列表
      if (inTagsBlock) {
        if (line.trim().startsWith("-")) {
          tags.push(line.replace("-", "").trim());
          continue;
        } else {
          inTagsBlock = false;
          if (tags.length > 0) {
            meta["tags"] = tags;
          }
        }
      }

      // 检查是否遇到标签开始
      if (line.trim() === "tags:") {
        inTagsBlock = true;
        tags = [];
        continue;
      }

      const match = line.match(/^(\w+):\s*(.*)$/);
      if (match) {
        const [, key, value] = match;
        const trimmedValue = value.trim();

        if (key === "tags" && !inTagsBlock) {
          // 解析标签列表 [tag1, tag2, tag3] 或 tag1, tag2, tag3
          let tagsList = trimmedValue;
          if (tagsList.startsWith("[") && tagsList.endsWith("]")) {
            tagsList = tagsList.substring(1, tagsList.length - 1);
          }
          meta[key] = tagsList
            .split(",")
            .map((tag) => tag.trim())
            .filter((tag) => tag !== "");
        } else if (trimmedValue === "true" || trimmedValue === "false") {
          // 解析布尔值
          meta[key] = trimmedValue === "true";
        } else if (!isNaN(Number(trimmedValue)) && trimmedValue !== "") {
          // 解析数字
          meta[key] = Number(trimmedValue);
        } else {
          // 字符串
          meta[key] = trimmedValue;
        }
      }
    }

    // 确保最后的标签列表被添加
    if (inTagsBlock && tags.length > 0) {
      meta["tags"] = tags;
    }

    return meta;
  }

  /**
   * 生成文章摘要
   */
  private generateExcerpt(markdown: string): string {
    // 去除Markdown标记
    const text = markdown
      .replace(/!\[.*?\]\(.*?\)/g, "") // 图片
      .replace(/\[.*?\]\(.*?\)/g, "") // 链接
      .replace(/[#*`_~]/g, "") // 标记符号
      .replace(/\n/g, " ") // 换行
      .trim();

    // 截取摘要
    if (text.length <= this.config.excerptLength) {
      return text;
    }

    return text.substring(0, this.config.excerptLength) + "...";
  }

  /**
   * 计算阅读时间（分钟）
   */
  private calculateReadingTime(text: string): number {
    const wordsPerMinute = 200;
    const words = text.trim().split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  }

  /**
   * 获取所有文章
   */
  getPosts(
    options: {
      tag?: string;
      locale?: string;
      includeDrafts?: boolean;
      page?: number;
      limit?: number;
    } = {}
  ): BlogPost[] {
    const {
      tag,
      locale,
      includeDrafts = false,
      page = 1,
      limit = this.config.postsPerPage,
    } = options;

    let filteredPosts = [...this.posts];

    // 过滤草稿
    if (!includeDrafts) {
      filteredPosts = filteredPosts.filter((post) => !post.draft);
    }

    // 按标签过滤
    if (tag) {
      filteredPosts = filteredPosts.filter((post) => post.tags?.includes(tag));
    }

    // 按语言过滤
    if (locale) {
      filteredPosts = filteredPosts.filter((post) => post.locale === locale);
    }

    // 分页
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    return filteredPosts.slice(startIndex, endIndex);
  }

  /**
   * 获取文章总数
   */
  getPostCount(
    options: {
      tag?: string;
      locale?: string;
      includeDrafts?: boolean;
    } = {}
  ): number {
    const { tag, locale, includeDrafts = false } = options;

    let count = this.posts.length;

    // 过滤草稿
    if (!includeDrafts) {
      count = this.posts.filter((post) => !post.draft).length;
    }

    // 按标签过滤
    if (tag) {
      count = this.posts.filter((post) => post.tags?.includes(tag)).length;
    }

    // 按语言过滤
    if (locale) {
      count = this.posts.filter((post) => post.locale === locale).length;
    }

    return count;
  }

  /**
   * 获取单篇文章
   */
  getPostById(id: string): BlogPost | undefined {
    return this.posts.find((post) => post.id === id);
  }

  /**
   * 获取所有标签及其文章数
   */
  getTags(locale?: string): Map<string, number> {
    const tagMap = new Map<string, number>();

    const posts = locale
      ? this.posts.filter((post) => post.locale === locale && !post.draft)
      : this.posts.filter((post) => !post.draft);

    for (const post of posts) {
      if (post.tags) {
        for (const tag of post.tags) {
          const count = tagMap.get(tag) || 0;
          tagMap.set(tag, count + 1);
        }
      }
    }

    return tagMap;
  }
}

// 默认导出插件类
export default BlogPlugin;
