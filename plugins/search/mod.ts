/**
 * FreshPress搜索插件
 * 提供全文搜索功能
 */

import { Plugin } from "../../core/plugin";
import { Content } from "../../core/content";
import { join } from "https://deno.land/std@0.177.0/path/mod.ts";

/**
 * 搜索插件配置
 */
export interface SearchPluginConfig {
  /** 索引文件路径 */
  indexPath: string;
  /** 是否自动生成索引 */
  autoIndex: boolean;
  /** 索引字段 */
  indexFields: string[];
  /** 搜索结果限制 */
  resultLimit: number;
  /** 是否高亮关键词 */
  highlightResults: boolean;
  /** 搜索权重配置 */
  weights: Record<string, number>;
  /** 内容来源目录 */
  contentDirs: string[];
}

/**
 * 搜索结果项
 */
export interface SearchResult {
  /** 内容ID */
  id: string;
  /** 内容标题 */
  title: string;
  /** 内容URL */
  url: string;
  /** 内容摘要 */
  excerpt: string;
  /** 内容类型 */
  type: string;
  /** 相关度分数 */
  score: number;
  /** 高亮片段 */
  highlights?: string[];
}

/**
 * 索引项
 */
interface IndexItem {
  /** 内容ID */
  id: string;
  /** 内容标题 */
  title: string;
  /** 内容URL */
  url: string;
  /** 内容类型 */
  type: string;
  /** 内容文本 */
  text: string;
  /** 索引字段 */
  [key: string]: any;
}

/**
 * 搜索插件默认配置
 */
export const DEFAULT_CONFIG: SearchPluginConfig = {
  indexPath: "./docs/search-index.json",
  autoIndex: true,
  indexFields: ["title", "content", "tags", "description"],
  resultLimit: 10,
  highlightResults: true,
  weights: {
    title: 2.0,
    content: 1.0,
    tags: 1.5,
    description: 1.2,
  },
  contentDirs: ["./content", "./blog", "./routes", "./docs"],
};

/**
 * 搜索插件类
 */
export class SearchPlugin implements Plugin {
  name = "search";
  version = "1.0.0";
  description = "Search plugin for FreshPress";
  author = "FreshPress Team";

  /** 插件配置 */
  config: SearchPluginConfig;

  /** 搜索索引 */
  private index: IndexItem[] = [];

  /** 是否已初始化 */
  initialized = false;

  constructor(config: Partial<SearchPluginConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * 安装插件
   */
  async install(): Promise<void> {
    // 创建必要的目录
    try {
      const indexDir = this.config.indexPath.split("/").slice(0, -1).join("/");
      await Deno.mkdir(indexDir, { recursive: true });
      console.log(`[搜索插件] 创建索引目录: ${indexDir}`);
    } catch (error) {
      // 目录可能已存在
      if (!(error instanceof Deno.errors.AlreadyExists)) {
        console.error(`[搜索插件] 创建索引目录失败:`, error);
        throw error;
      }
    }

    // 如果配置为自动索引，则生成初始索引
    if (this.config.autoIndex) {
      try {
        console.log(`[搜索插件] 开始生成初始索引...`);
        const content = await this.collectContent();
        await this.generateIndex(content);
        console.log(
          `[搜索插件] 初始索引生成完成，共 ${this.index.length} 条记录`
        );
      } catch (error) {
        console.error(`[搜索插件] 生成初始索引失败:`, error);
      }
    }
  }

  /**
   * 卸载插件
   */
  async uninstall(): Promise<void> {
    // 插件卸载逻辑
    try {
      await Deno.remove(this.config.indexPath);
      console.log(`[搜索插件] 已删除索引文件: ${this.config.indexPath}`);
    } catch (error) {
      // 文件可能不存在
      if (!(error instanceof Deno.errors.NotFound)) {
        console.error(`[搜索插件] 删除索引文件失败:`, error);
        throw error;
      }
    }
  }

  /**
   * 激活插件
   */
  async activate(): Promise<void> {
    // 加载搜索索引
    await this.loadIndex();

    // 如果索引为空且配置为自动索引，则生成索引
    if (this.index.length === 0 && this.config.autoIndex) {
      try {
        console.log(`[搜索插件] 索引为空，开始自动生成...`);
        const content = await this.collectContent();
        await this.generateIndex(content);
        console.log(
          `[搜索插件] 自动索引生成完成，共 ${this.index.length} 条记录`
        );
      } catch (error) {
        console.error(`[搜索插件] 自动生成索引失败:`, error);
      }
    }

    this.initialized = true;
    console.log(`[搜索插件] 已激活，索引包含 ${this.index.length} 条记录`);
  }

  /**
   * 停用插件
   */
  async deactivate(): Promise<void> {
    // 清空缓存
    this.index = [];
    this.initialized = false;
    console.log(`[搜索插件] 已停用`);
  }

  /**
   * 配置插件
   */
  async configure(options: Partial<SearchPluginConfig>): Promise<void> {
    this.config = { ...this.config, ...options };
    console.log(`[搜索插件] 配置已更新`);

    // 重新加载索引
    if (this.initialized) {
      await this.loadIndex();
      console.log(
        `[搜索插件] 已重新加载索引，包含 ${this.index.length} 条记录`
      );
    }
  }

  /**
   * 加载搜索索引
   */
  private async loadIndex(): Promise<void> {
    try {
      console.log(`[搜索插件] 正在加载索引: ${this.config.indexPath}`);
      const content = await Deno.readTextFile(this.config.indexPath);
      this.index = JSON.parse(content);
      console.log(`[搜索插件] 索引加载成功，共 ${this.index.length} 条记录`);
    } catch (error) {
      // 如果索引文件不存在，创建一个空索引
      if (error instanceof Deno.errors.NotFound) {
        console.log(`[搜索插件] 索引文件不存在，创建空索引`);
        this.index = [];
        await this.saveIndex();
      } else {
        console.error(`[搜索插件] 加载索引失败:`, error);
      }
    }
  }

  /**
   * 保存搜索索引
   */
  private async saveIndex(): Promise<void> {
    try {
      console.log(`[搜索插件] 正在保存索引: ${this.config.indexPath}`);
      await Deno.writeTextFile(
        this.config.indexPath,
        JSON.stringify(this.index, null, 2)
      );
      console.log(`[搜索插件] 索引保存成功，共 ${this.index.length} 条记录`);
    } catch (error) {
      console.error(`[搜索插件] 保存索引失败:`, error);
    }
  }

  /**
   * 收集内容
   */
  private async collectContent(): Promise<Content[]> {
    const content: Content[] = [];

    // 从配置的内容目录收集内容
    for (const dir of this.config.contentDirs) {
      try {
        console.log(`[搜索插件] 正在收集内容: ${dir}`);
        await this.collectContentFromDir(dir, content);
      } catch (error) {
        console.error(`[搜索插件] 收集内容失败 (${dir}):`, error);
      }
    }

    console.log(`[搜索插件] 内容收集完成，共 ${content.length} 条记录`);
    return content;
  }

  /**
   * 从目录中收集内容
   */
  private async collectContentFromDir(
    dir: string,
    content: Content[]
  ): Promise<void> {
    try {
      const entries = Deno.readDirSync(dir);
      for (const entry of entries) {
        const path = join(dir, entry.name);

        if (entry.isDirectory) {
          // 递归处理子目录
          await this.collectContentFromDir(path, content);
        } else if (entry.isFile) {
          // 处理文件内容
          if (
            path.endsWith(".md") ||
            path.endsWith(".mdx") ||
            path.endsWith(".tsx") ||
            path.endsWith(".jsx")
          ) {
            try {
              const fileContent = await Deno.readTextFile(path);
              const id = path.replace(/\\/g, "/");
              const url = this.filePathToUrl(path);

              // 尝试提取标题
              let title = entry.name.replace(/\.(md|mdx|tsx|jsx)$/i, "");
              const titleMatch =
                fileContent.match(/^#\s+(.+)$/m) ||
                fileContent.match(/title[:|=]\s*["'](.+?)["']/i);
              if (titleMatch) {
                title = titleMatch[1];
              }

              // 创建内容对象
              const contentItem: Content = {
                id,
                title,
                url,
                content: fileContent,
                date:
                  (await Deno.stat(path)).mtime?.toISOString() ||
                  new Date().toISOString(),
                tags: [],
                meta: {
                  type: this.getContentType(path),
                  path: path,
                },
              };

              // 尝试提取标签
              const tagsMatch = fileContent.match(/tags[:|=]\s*\[(.+?)\]/i);
              if (tagsMatch) {
                contentItem.tags = tagsMatch[1]
                  .split(",")
                  .map((tag) => tag.trim().replace(/["']/g, ""));
              }

              content.push(contentItem);
            } catch (error) {
              console.error(`[搜索插件] 处理文件失败 (${path}):`, error);
            }
          }
        }
      }
    } catch (error) {
      console.error(`[搜索插件] 读取目录失败 (${dir}):`, error);
    }
  }

  /**
   * 根据文件路径判断内容类型
   */
  private getContentType(path: string): string {
    if (path.includes("/blog/")) return "blog";
    if (path.includes("/routes/")) return "page";
    if (path.includes("/docs/")) return "documentation";
    return "page";
  }

  /**
   * 将文件路径转换为URL
   */
  private filePathToUrl(path: string): string {
    // 去除文件扩展名
    let url = path.replace(/\.(md|mdx|tsx|jsx)$/i, "");

    // 处理常见的目录结构
    if (url.includes("/routes/")) {
      url = url.replace(/.*\/routes\//, "/");
    } else if (url.includes("/blog/")) {
      url = url.replace(/.*\/blog\//, "/blog/");
    } else if (url.includes("/docs/")) {
      url = url.replace(/.*\/docs\//, "/docs/");
    } else if (url.includes("/content/")) {
      url = url.replace(/.*\/content\//, "/");
    }

    // 处理索引文件
    if (url.endsWith("/index")) {
      url = url.replace(/\/index$/, "/");
    }

    return url;
  }

  /**
   * 生成搜索索引
   */
  async generateIndex(content: Content[]): Promise<void> {
    console.log(`[搜索插件] 开始生成索引，处理 ${content.length} 条内容`);
    this.index = [];

    for (const item of content) {
      const indexItem: IndexItem = {
        id: item.id,
        title: item.title,
        url: item.url,
        type: item.meta?.type || "page",
        text: this.extractText(item),
      };

      // 添加索引字段
      for (const field of this.config.indexFields) {
        if (field in item) {
          indexItem[field] = item[field as keyof Content];
        }
      }

      this.index.push(indexItem);
    }

    await this.saveIndex();
  }

  /**
   * 从内容中提取文本
   */
  private extractText(content: Content): string {
    // 合并所有可能的文本字段
    const textParts: string[] = [content.title, content.content];

    if (content.meta?.description) {
      textParts.push(content.meta.description as string);
    }

    if (content.tags) {
      textParts.push(content.tags.join(" "));
    }

    return textParts.filter(Boolean).join(" ");
  }

  /**
   * 搜索内容
   * @param query 搜索关键词
   * @returns 搜索结果
   */
  async search(query: string): Promise<SearchResult[]> {
    if (!this.initialized) {
      console.log(`[搜索插件] 首次搜索，初始化插件`);
      await this.loadIndex();
      this.initialized = true;
    }

    if (!query || query.trim().length === 0) {
      return [];
    }

    console.log(`[搜索插件] 正在搜索: "${query}"`);
    const searchTerms = query.toLowerCase().split(/\s+/).filter(Boolean);

    if (searchTerms.length === 0) {
      return [];
    }

    // 增强型搜索实现
    const results = this.index
      .map((item) => {
        // 计算相关性分数
        let score = 0;
        const highlights: string[] = [];
        const itemTitle = item.title.toLowerCase();
        const itemText = item.text.toLowerCase();
        const itemTags = Array.isArray(item.tags)
          ? item.tags.map((t) => t.toLowerCase())
          : [];

        for (const term of searchTerms) {
          // 精确匹配
          const exactTitleMatch = itemTitle.includes(term);
          const exactContentMatch = itemText.includes(term);
          const exactTagMatch = itemTags.some((tag) => tag.includes(term));

          // 部分匹配（对中文降低匹配阈值）
          // 对中文字符，只要有1个字符就可以进行部分匹配
          const isChinese = /[\u4e00-\u9fa5]/.test(term);
          const partialMatchThreshold = isChinese
            ? 1
            : Math.min(3, term.length - 1);

          // 检查是否有部分匹配
          let partialTitleMatch = false;
          let partialContentMatch = false;

          // 调整条件，对中文字符即使长度小于4也进行部分匹配
          if (term.length >= (isChinese ? 1 : 4)) {
            for (let i = partialMatchThreshold; i < term.length; i++) {
              const partialTerm = term.substring(0, i);
              if (itemTitle.includes(partialTerm)) {
                partialTitleMatch = true;
              }
              if (itemText.includes(partialTerm)) {
                partialContentMatch = true;
              }
            }
          }

          // 评分计算
          // 精确标题匹配得分最高
          if (exactTitleMatch) {
            score += this.config.weights.title * 2;
          }
          // 部分标题匹配得分次之
          else if (partialTitleMatch) {
            score += this.config.weights.title * 1.2;
          }

          // 精确内容匹配
          if (exactContentMatch) {
            score += this.config.weights.content;

            // 提取匹配上下文作为摘要
            if (this.config.highlightResults) {
              const termIndex = itemText.indexOf(term);
              if (termIndex >= 0) {
                const start = Math.max(0, termIndex - 40);
                const end = Math.min(
                  itemText.length,
                  termIndex + term.length + 60
                );
                let highlight = item.text.substring(start, end);

                // 添加省略号
                if (start > 0) highlight = "..." + highlight;
                if (end < item.text.length) highlight += "...";

                highlights.push(highlight);
              }
            }
          }
          // 部分内容匹配
          else if (partialContentMatch) {
            score += this.config.weights.content * 0.7;
          }

          // 标签匹配
          if (exactTagMatch) {
            score += this.config.weights.tags;
          }

          // 对中文查询给予额外的权重提升
          if (
            isChinese &&
            (exactTitleMatch || exactContentMatch || exactTagMatch)
          ) {
            score *= 1.2; // 增加20%的额外得分
          }
        }

        return {
          id: item.id,
          title: item.title,
          url: item.url,
          excerpt:
            highlights.length > 0
              ? highlights[0]
              : item.text.substring(0, 150) + "...",
          type: item.type,
          score,
          highlights: highlights.length > 0 ? highlights : undefined,
        };
      })
      .filter((result) => result.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, this.config.resultLimit);

    console.log(`[搜索插件] 搜索完成，找到 ${results.length} 条结果`);
    return results;
  }

  /**
   * 添加内容到索引
   */
  async addToIndex(content: Content): Promise<void> {
    console.log(`[搜索插件] 添加内容到索引: ${content.id}`);
    const indexItem: IndexItem = {
      id: content.id,
      title: content.title,
      url: content.url,
      type: content.meta?.type || "page",
      text: this.extractText(content),
    };

    // 添加索引字段
    for (const field of this.config.indexFields) {
      if (field in content) {
        indexItem[field] = content[field as keyof Content];
      }
    }

    // 移除旧索引项（如果存在）
    this.index = this.index.filter((item) => item.id !== content.id);

    // 添加新索引项
    this.index.push(indexItem);

    await this.saveIndex();
  }

  /**
   * 从索引中移除内容
   */
  async removeFromIndex(id: string): Promise<void> {
    console.log(`[搜索插件] 从索引中移除内容: ${id}`);
    this.index = this.index.filter((item) => item.id !== id);
    await this.saveIndex();
  }

  /**
   * 重建索引
   */
  async rebuildIndex(): Promise<void> {
    console.log(`[搜索插件] 开始重建索引...`);
    const content = await this.collectContent();
    await this.generateIndex(content);
    console.log(`[搜索插件] 索引重建完成，共 ${this.index.length} 条记录`);
  }
}

// 默认导出插件类
export default SearchPlugin;
