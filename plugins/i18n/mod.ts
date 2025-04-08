/**
 * FreshPress国际化插件
 * 提供多语言支持
 */

import { Plugin } from "../../core/plugin";
import { signal } from "@preact/signals";

/**
 * 国际化插件配置
 */
export interface I18nPluginConfig {
  /** 默认语言 */
  defaultLocale: string;
  /** 支持的语言列表 */
  locales: string[];
  /** 翻译文件目录 */
  translationsDir: string;
  /** 是否自动检测浏览器语言 */
  detectBrowserLocale: boolean;
  /** 语言切换策略 */
  switchStrategy: "path" | "query" | "cookie";
  /** 是否启用翻译回退 */
  fallback: boolean;
  /** 对于不支持的语言回退到指定语言 */
  fallbackLocale: string;
}

/**
 * 翻译条目类型
 */
export type TranslationEntry = string | Record<string, any>;

/**
 * 翻译字典类型
 */
export type TranslationDictionary = Record<string, TranslationEntry>;

/**
 * 国际化插件默认配置
 */
export const DEFAULT_CONFIG: I18nPluginConfig = {
  defaultLocale: "en-US",
  locales: ["en-US", "zh-CN"],
  translationsDir: "./docs/translations",
  detectBrowserLocale: true,
  switchStrategy: "path",
  fallback: true,
  fallbackLocale: "en-US",
};

/**
 * 国际化插件类
 */
export class I18nPlugin implements Plugin {
  name = "i18n";
  version = "1.0.0";
  description = "Internationalization plugin for FreshPress";
  author = "FreshPress Team";

  /** 插件配置 */
  config: I18nPluginConfig;

  /** 翻译字典 */
  private translations: Record<string, TranslationDictionary> = {};

  /** 当前语言 */
  private currentLocale: string;

  constructor(config: Partial<I18nPluginConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.currentLocale = this.config.defaultLocale;
  }

  /**
   * 安装插件
   */
  async install(): Promise<void> {
    // 创建必要的目录
    try {
      await Deno.mkdir(this.config.translationsDir, { recursive: true });

      // 创建默认翻译文件
      for (const locale of this.config.locales) {
        const filePath = `${this.config.translationsDir}/${locale}.json`;
        try {
          await Deno.stat(filePath);
        } catch (error) {
          if (error instanceof Deno.errors.NotFound) {
            await Deno.writeTextFile(
              filePath,
              JSON.stringify(
                {
                  hello: locale === "en-US" ? "Hello, world!" : "你好，世界！",
                },
                null,
                2
              )
            );
          }
        }
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
    // 插件卸载逻辑
  }

  /**
   * 激活插件
   */
  async activate(): Promise<void> {
    console.log(`[I18n] Activating i18n plugin...`);

    // 预加载所有翻译文件
    await this.preloadAllTranslations();

    // 设置当前语言到全局信号
    if (typeof window !== "undefined") {
      // 从localStorage获取用户偏好语言
      const preferredLocale = localStorage.getItem("preferred_locale");
      if (preferredLocale && this.config.locales.includes(preferredLocale)) {
        this.currentLocale = preferredLocale;
        console.log(`[I18n] 从存储加载偏好语言: ${preferredLocale}`);
      }
    }

    // 更新全局信号
    currentLocale.value = this.currentLocale;

    console.log(`[I18n] Plugin activated with locale: ${this.currentLocale}`);
    console.log(`[I18n] Available locales: ${this.config.locales.join(", ")}`);

    // 在客户端环境中，设置文档的lang属性
    if (typeof document !== "undefined") {
      document.documentElement.lang = this.currentLocale;
    }
  }

  /**
   * 预加载所有语言的翻译
   */
  private async preloadAllTranslations(): Promise<void> {
    // 加载基础翻译
    await this.loadTranslations();

    // 验证翻译键的一致性
    this.validateTranslationKeys();

    console.log(`[I18n] 已预加载所有语言翻译`);
  }

  /**
   * 验证不同语言间翻译键的一致性
   */
  private validateTranslationKeys(): void {
    // 获取所有语言的翻译键
    const locales = Object.keys(this.translations);
    if (locales.length <= 1) return; // 只有一种语言不需要验证

    // 以第一种语言的键作为基准
    const baseLocale = locales[0];
    const baseKeys = this.getAllKeys(this.translations[baseLocale]);

    // 验证其他语言是否有缺失的键
    for (const locale of locales) {
      if (locale === baseLocale) continue;

      const currentKeys = this.getAllKeys(this.translations[locale]);
      const missingKeys = baseKeys.filter((key) => !currentKeys.includes(key));

      if (missingKeys.length > 0) {
        console.warn(
          `[I18n] 语言 ${locale} 缺少以下翻译键: ${missingKeys.join(", ")}`
        );
      }
    }
  }

  /**
   * 递归获取所有翻译键（包括嵌套键）
   */
  private getAllKeys(obj: any, prefix = ""): string[] {
    let keys: string[] = [];

    for (const key in obj) {
      const newKey = prefix ? `${prefix}.${key}` : key;

      if (typeof obj[key] === "object" && obj[key] !== null) {
        // 递归处理嵌套对象
        keys = [...keys, ...this.getAllKeys(obj[key], newKey)];
      } else {
        keys.push(newKey);
      }
    }

    return keys;
  }

  /**
   * 检查特定语言的翻译是否已加载
   */
  isTranslationLoaded(locale: string): boolean {
    return (
      !!this.translations[locale] &&
      Object.keys(this.translations[locale]).length > 0
    );
  }

  /**
   * 停用插件
   */
  async deactivate(): Promise<void> {
    // 清空缓存
    this.translations = {};
  }

  /**
   * 配置插件
   */
  async configure(options: Partial<I18nPluginConfig>): Promise<void> {
    this.config = { ...this.config, ...options };

    // 重新加载翻译
    await this.loadTranslations();
  }

  /**
   * 加载翻译文件
   */
  private async loadTranslations(): Promise<void> {
    this.translations = {};

    try {
      console.log(`[I18n] 开始加载翻译文件`);

      // 根据已知的语言列表加载翻译文件
      for (const locale of this.config.locales) {
        try {
          // 使用API端点加载翻译
          if (typeof window !== "undefined") {
            // 浏览器环境
            console.log(`[I18n] 从API加载翻译: ${locale}`);
            const response = await fetch(`/api/translations/${locale}`);
            if (response.ok) {
              this.translations[locale] = await response.json();
              console.log(`[I18n] 已从API加载语言 ${locale} 的翻译`);
            } else {
              console.error(`[I18n] 从API加载翻译失败: ${response.statusText}`);
            }
          } else {
            // 服务器环境直接从文件系统读取
            console.log(`[I18n] 从文件系统加载翻译: ${locale}`);
            const filePath = `./docs/translations/${locale}.json`;
            const content = await Deno.readTextFile(filePath);
            this.translations[locale] = JSON.parse(content);
            console.log(`[I18n] 已加载语言 ${locale} 的翻译`);
          }
        } catch (error) {
          console.error(`[I18n] 加载翻译文件 ${locale} 失败:`, error);
        }
      }

      // 检查是否所有语言都加载失败
      if (Object.keys(this.translations).length === 0) {
        console.error(
          "[I18n] 警告: 所有翻译文件加载失败！请确保翻译文件存在于正确的位置。"
        );
      }
    } catch (error) {
      console.error("[I18n] 加载翻译时出错:", error);
    }
  }

  /**
   * 设置当前语言
   */
  setLocale(locale: string): void {
    console.log(
      `[I18n] 尝试设置语言: ${locale}, 当前语言: ${this.currentLocale}`
    );
    if (this.config.locales.includes(locale)) {
      this.currentLocale = locale;
      console.log(`[I18n] 语言设置成功: ${locale}`);
    } else if (this.config.fallback) {
      console.log(
        `[I18n] 语言 ${locale} 不受支持，回退到 ${this.config.fallbackLocale}`
      );
      this.currentLocale = this.config.fallbackLocale;
    } else {
      console.warn(`[I18n] 语言 ${locale} 不受支持且没有启用回退`);
    }
  }

  /**
   * 翻译文本
   */
  translate(
    key: string,
    params: Record<string, string> = {},
    locale?: string
  ): string {
    const targetLocale = locale || this.currentLocale;
    const dictionary = this.translations[targetLocale] || {};

    // 使用点号访问嵌套属性
    const keyPath = key.split(".");
    let value: any = dictionary;

    for (const segment of keyPath) {
      value = value?.[segment];
      if (value === undefined) break;
    }

    // 如果没有找到翻译，尝试回退
    if (
      value === undefined &&
      this.config.fallback &&
      targetLocale !== this.config.fallbackLocale
    ) {
      return this.translate(key, params, this.config.fallbackLocale);
    }

    // 如果还是没有找到翻译，返回键名
    if (typeof value !== "string") {
      return key;
    }

    // 替换参数
    return value.replace(/{{\s*([a-zA-Z0-9_]+)\s*}}/g, (_, name) => {
      return params[name] !== undefined ? params[name] : `{{${name}}}`;
    });
  }

  getLocale(): string {
    return this.currentLocale;
  }

  getLocales(): string[] {
    return this.config.locales;
  }
}

// 切换语言函数
export const toggleLocale = (): void => {
  const current = currentLocale.value;
  console.log("[I18n] 切换语言 - 当前:", current);

  const locales = defaultPlugin.getLocales();
  console.log("[I18n] 可用语言:", locales);

  const index = locales.indexOf(current);
  const nextIndex = (index + 1) % locales.length;
  const nextLocale = locales[nextIndex];
  console.log("[I18n] 下一个语言:", nextLocale);

  // 检查翻译是否已加载
  if (!defaultPlugin.isTranslationLoaded(nextLocale)) {
    console.log(`[I18n] 翻译未加载，正在加载 ${nextLocale} 的翻译...`);

    // 异步加载翻译
    defaultPlugin.setLocale(nextLocale);
    currentLocale.value = nextLocale;
  } else {
    // 直接更新locale
    defaultPlugin.setLocale(nextLocale);
    currentLocale.value = nextLocale;
  }

  // 在服务器端运行时不存在window对象
  if (typeof window !== "undefined") {
    // 触发语言变更事件
    window.dispatchEvent(
      new CustomEvent("fp:localeChange", {
        detail: { locale: nextLocale },
      })
    );
    console.log("[I18n] 已触发fp:localeChange事件");

    // 存储用户选择的语言到localStorage
    localStorage.setItem("preferred_locale", nextLocale);

    // 更新HTML的lang属性
    document.documentElement.lang = nextLocale;
  }
};

// 导出信号和类型
export const currentLocale = signal<string>("en-US");

// 语言类型
export type Locale = "en-US" | "zh-CN";

// 创建一个默认插件实例
const defaultPlugin = new I18nPlugin();

// 导出翻译函数
export const t = (
  key: string,
  params: Record<string, string> = {},
  locale?: string
): string => {
  return defaultPlugin.translate(
    key,
    params,
    locale || defaultPlugin.getLocale()
  );
};
