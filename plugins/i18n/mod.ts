/**
 * FreshPress国际化插件
 * 提供多语言支持
 */

import { Plugin } from "../../core/plugin.ts";
import { App } from "../../core/app.ts";
import { signal } from "../../utils/signal.ts";

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
 * 语言类型
 */
export type Locale = string;

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

// 当前语言的全局信号
const _currentLocale = signal<string>(DEFAULT_CONFIG.defaultLocale);
// 重新导出供组件使用
export const currentLocale = _currentLocale;

/**
 * 国际化插件类
 */
export class I18nPlugin implements Plugin {
  name = "i18n";
  version = "1.0.0";
  description = "Internationalization plugin for FreshPress";
  author = "FreshPress Team";
  severity = "info"; // 添加severity属性

  /** 插件配置 */
  config: I18nPluginConfig;

  /** 翻译字典 */
  private translations: Record<string, TranslationDictionary> = {};

  /** 当前语言 */
  private currentLocale: string;

  /** 加载失败的翻译文件 */
  private failedLoads: Record<string, boolean> = {};

  /** 翻译加载状态 */
  private isLoading = false;

  /** 翻译加载完成信号 */
  private loaded = signal(false);

  /** 插件初始化状态 */
  public initialized = false;

  constructor(config: Partial<I18nPluginConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.currentLocale = this.config.defaultLocale;
  }

  /**
   * 安装插件
   */
  install(app: App): void {
    console.log(`[I18n] Installing i18n plugin...`);
  }

  /**
   * 激活插件
   */
  async activate(): Promise<void> {
    if (this.initialized) {
      console.log("[I18n] 插件已初始化，跳过激活");
      return;
    }

    console.log("[I18n] Activating i18n plugin...");

    try {
      // 预加载所有语言翻译
      await this.preloadAllTranslations();

      // 客户端环境下，从localStorage读取用户首选语言
      if (typeof window !== "undefined") {
        // 从localStorage读取偏好语言
        const storedLocale = localStorage.getItem("preferred_locale");
        if (storedLocale && this.config.locales.includes(storedLocale)) {
          this.setLocale(storedLocale);
        } else if (this.config.detectBrowserLocale) {
          // 尝试从浏览器语言中匹配
          const browserLang = navigator.language;
          const closestLang = this.findClosestLocale(browserLang);
          if (closestLang) {
            this.setLocale(closestLang);
          }
        }

        // 安装全局翻译函数
        this.installGlobalTranslation();
      }

      this.initialized = true;
      console.log(`[I18n] Plugin activated with locale: ${this.currentLocale}`);
      console.log(
        `[I18n] Available locales: ${this.config.locales.join(", ")}`
      );
      console.log(
        `[I18n] Loaded translations: `,
        Object.keys(this.translations)
      );
    } catch (error) {
      console.error("[I18n] Failed to activate plugin:", error);
    }
  }

  /**
   * 在浏览器环境安装全局翻译函数和变量
   */
  private installGlobalTranslation(): void {
    if (typeof window === "undefined") return;

    // 安装全局翻译函数
    window.__t = (key, params = {}, locale) => {
      return this.translate(key, params, locale);
    };

    // 设置当前语言
    window.__currentLocale = this.currentLocale;

    // 将翻译字典添加到全局对象
    window.__translations = this.translations;

    console.log("[I18n] 全局翻译函数已安装，可以使用window.__t()进行翻译");
  }

  /**
   * 预加载所有语言的翻译
   */
  private async preloadAllTranslations(): Promise<void> {
    if (this.isLoading) {
      console.log(`[I18n] 翻译正在加载中，等待完成...`);
      return;
    }

    this.isLoading = true;
    console.log(`[I18n] 开始加载翻译文件...`);

    try {
      // 加载基础翻译
      await this.loadTranslations();

      // 验证翻译键的一致性
      this.validateTranslationKeys();

      console.log(`[I18n] 已预加载所有语言翻译`);
      this.loaded.value = true;
    } catch (error) {
      console.error(`[I18n] 加载翻译文件失败:`, error);
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * 加载翻译文件
   */
  private async loadTranslations(): Promise<void> {
    const { locales, translationsDir } = this.config;

    for (const locale of locales) {
      if (this.failedLoads[locale]) {
        console.warn(`[I18n] 跳过已失败的翻译文件: ${locale}`);
        continue;
      }

      try {
        const filePath = `${translationsDir}/${locale}.json`;
        const content = await Deno.readTextFile(filePath);
        this.translations[locale] = JSON.parse(content);
        console.log(`[I18n] 成功加载翻译文件: ${locale}`);
      } catch (error) {
        console.error(`[I18n] 加载翻译文件失败 ${locale}:`, error);
        this.failedLoads[locale] = true;
      }
    }

    // 检查是否所有翻译文件都加载失败
    const allFailed = locales.every((locale) => this.failedLoads[locale]);
    if (allFailed) {
      console.warn(`[I18n] 所有翻译文件加载失败`);
    }
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
   * 递归获取对象中所有键的路径
   */
  private getAllKeys(obj: any, prefix = ""): string[] {
    let keys: string[] = [];

    for (const key in obj) {
      if (typeof obj[key] === "object" && obj[key] !== null) {
        keys = [
          ...keys,
          ...this.getAllKeys(obj[key], prefix ? `${prefix}.${key}` : key),
        ];
      } else {
        keys.push(prefix ? `${prefix}.${key}` : key);
      }
    }

    return keys;
  }

  /**
   * 设置当前语言
   */
  setLocale(locale: string): void {
    if (!this.config.locales.includes(locale)) {
      console.warn(
        `[I18n] 不支持的语言: ${locale}，使用默认语言: ${this.config.defaultLocale}`
      );
      locale = this.config.defaultLocale;
    }

    this.currentLocale = locale;
    _currentLocale.value = locale;

    // 更新localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("preferred_locale", locale);
      document.documentElement.lang = locale;
    }

    console.log(`[I18n] 当前语言已设置为: ${locale}`);
  }

  /**
   * 获取当前语言
   */
  getLocale(): string {
    return this.currentLocale;
  }

  /**
   * 获取支持的语言列表
   */
  getLocales(): string[] {
    return this.config.locales;
  }

  /**
   * 获取已加载的所有翻译
   */
  getTranslations(): Record<string, TranslationDictionary> {
    return this.translations;
  }

  /**
   * 翻译指定的键
   */
  translate(
    key: string,
    params: Record<string, string> = {},
    locale?: string
  ): string {
    const targetLocale = locale || this.currentLocale;
    const dictionary = this.translations[targetLocale];

    // 详细调试信息
    console.log(
      `[I18n] 翻译请求: key=${key}, locale=${targetLocale}, 可用字典:`,
      dictionary ? Object.keys(dictionary).join(", ") : "无"
    );

    if (!dictionary) {
      console.warn(`[I18n] 找不到语言的翻译字典: ${targetLocale}`);

      // 尝试回退到其他语言
      if (this.config.fallback && targetLocale !== this.config.fallbackLocale) {
        console.log(`[I18n] 尝试回退到${this.config.fallbackLocale}语言`);
        return this.translate(key, params, this.config.fallbackLocale);
      }

      return key;
    }

    // 获取嵌套的翻译值
    const value = this.getNestedValue(dictionary, key);
    console.log(`[I18n] 翻译键 ${key} 的值: `, value);

    if (value === undefined) {
      console.warn(`[I18n] 找不到翻译键: ${key} (语言: ${targetLocale})`);

      // 尝试回退到其他语言
      if (this.config.fallback && targetLocale !== this.config.fallbackLocale) {
        console.log(`[I18n] 尝试回退到${this.config.fallbackLocale}语言`);
        return this.translate(key, params, this.config.fallbackLocale);
      }

      return key;
    }

    // 替换参数
    const finalValue =
      typeof value === "string" && Object.keys(params).length > 0
        ? this.replaceParams(value, params)
        : String(value);

    // 调试信息
    console.log(`[I18n] 翻译最终结果: ${key} => ${finalValue}`);

    return finalValue;
  }

  /**
   * 获取嵌套对象中的值
   */
  private getNestedValue(obj: any, path: string): string | undefined {
    console.log(`[I18n] 查找嵌套键: ${path}, 对象类型:`, typeof obj);

    if (!path || !obj) {
      console.log(`[I18n] 路径或对象为空`);
      return undefined;
    }

    // 处理路径中的点符号，分割成数组
    const parts = path.split(".");
    let current = obj;

    // 遍历路径
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (current[part] === undefined) {
        console.log(
          `[I18n] 在路径 ${parts.slice(0, i + 1).join(".")} 找不到键 ${part}`
        );
        return undefined;
      }
      current = current[part];
    }

    console.log(`[I18n] 找到值:`, current);
    return current;
  }

  /**
   * 替换文本中的参数
   */
  private replaceParams(text: string, params: Record<string, string>): string {
    return text.replace(/\{(\w+)\}/g, (match, key) => {
      return params[key] !== undefined ? params[key] : match;
    });
  }

  /**
   * 停用插件
   */
  deactivate(): void {
    console.log(`[I18n] Deactivating i18n plugin...`);
    this.initialized = false;
    this.loaded.value = false;
  }

  /**
   * 配置插件
   */
  configure(options: Partial<I18nPluginConfig>): void {
    this.config = { ...this.config, ...options };
    console.log(`[I18n] Plugin reconfigured`);
  }

  /**
   * 等待翻译加载完成
   */
  async waitForTranslations(): Promise<void> {
    if (this.loaded.value) {
      return;
    }

    if (this.isLoading) {
      // 等待加载完成
      return new Promise((resolve) => {
        const checkLoaded = () => {
          if (this.loaded.value) {
            resolve();
          } else {
            setTimeout(checkLoaded, 50);
          }
        };

        checkLoaded();
      });
    } else {
      // 开始加载
      await this.preloadAllTranslations();
    }
  }

  // 添加一个新方法用于强制加载特定语言
  async forceLoadLanguage(locale: string): Promise<boolean> {
    console.log(`[I18n] 强制加载语言: ${locale}`);

    if (this.translations[locale]) {
      console.log(`[I18n] 该语言已加载: ${locale}`);
      return true;
    }

    try {
      const filePath = `${this.config.translationsDir}/${locale}.json`;
      console.log(`[I18n] 尝试加载翻译文件: ${filePath}`);

      const content = await Deno.readTextFile(filePath);
      this.translations[locale] = JSON.parse(content);
      console.log(
        `[I18n] 成功加载翻译文件: ${locale}，键数量: ${
          Object.keys(this.translations[locale]).length
        }`
      );

      // 添加一些测试翻译结果
      const testKey = "nav.home";
      const testResult = this.getNestedValue(
        this.translations[locale],
        testKey
      );
      console.log(`[I18n] 测试翻译: ${testKey} => ${testResult}`);

      return true;
    } catch (error) {
      console.error(`[I18n] 强制加载语言失败: ${locale}`, error);
      this.failedLoads[locale] = true;
      return false;
    }
  }

  private findClosestLocale(browserLang: string): string | undefined {
    const lang = browserLang.split("-")[0];
    return this.config.locales.find((locale) => locale.startsWith(lang));
  }
}

// 全局单例实例，直接导出
export const i18nPlugin = new I18nPlugin();

/**
 * 翻译函数简写
 */
export const t = (
  key: string,
  params: Record<string, string> = {},
  locale?: string
): string => {
  // 使用模块级单例而不是从globalThis获取
  if (!i18nPlugin.initialized) {
    console.warn(`[I18n] i18n插件未初始化，返回原始键: ${key}`);
    return key;
  }

  return i18nPlugin.translate(key, params, locale);
};

/**
 * 切换语言函数
 */
export function toggleLocale(): void {
  // 使用模块级单例
  if (!i18nPlugin.initialized) {
    console.warn(`[I18n] i18n插件未初始化，无法切换语言`);
    return;
  }

  const currentLocale = i18nPlugin.getLocale();
  const locales = i18nPlugin.getLocales();

  if (locales.length < 2) {
    console.warn(`[I18n] 可用语言少于2种，无法切换`);
    return;
  }

  // 获取当前语言在列表中的索引
  const currentIndex = locales.indexOf(currentLocale);

  // 计算下一个语言的索引（循环）
  const nextIndex = (currentIndex + 1) % locales.length;

  // 设置新语言
  i18nPlugin.setLocale(locales[nextIndex]);

  // 触发自定义事件，通知其他组件语言已更改
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("localechange", {
        detail: { locale: locales[nextIndex] },
      })
    );
  }
}

// 为window添加全局翻译函数
declare global {
  interface Window {
    __t: (
      key: string,
      params?: Record<string, string>,
      locale?: string
    ) => string;
    __translations: Record<string, any>;
    __currentLocale: string;
  }
}

/**
 * 从全局对象获取翻译值
 */
function getTranslationFromGlobal(
  key: string,
  params: Record<string, string> = {},
  locale?: string
): string | undefined {
  if (typeof window === "undefined") return undefined;

  const targetLocale = locale || window.__currentLocale || "en-US";
  const translations = window.__translations || {};
  const dictionary = translations[targetLocale];

  if (!dictionary) return undefined;

  // 处理嵌套键
  const parts = key.split(".");
  let value = dictionary;

  for (const part of parts) {
    if (!value || typeof value !== "object") return undefined;
    value = value[part];
  }

  if (value === undefined) return undefined;

  // 替换参数
  if (typeof value === "string" && Object.keys(params).length > 0) {
    return value.replace(/\{(\w+)\}/g, (_, paramName) => {
      return params[paramName] || `{${paramName}}`;
    });
  }

  return String(value);
}
