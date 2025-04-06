import { currentLocale, type Locale } from "./i18n.ts";
import siteContentJson from "../data/siteContent.json" with { type: "json" };

// 类型定义
type ContentPath = string[];
type SiteContent = typeof siteContentJson;

/**
 * 获取指定路径的内容
 * @param path 内容路径，如 ["site", "title"]
 * @param locale 可选语言，默认使用当前语言
 * @returns 路径对应的内容
 */
export function getContent(path: ContentPath, locale?: Locale): any {
  try {
    const lang = (locale ||
      (typeof currentLocale !== "undefined" ? currentLocale.value : "en-US")
    ) as keyof typeof siteContentJson;

    // 从JSON中获取指定语言的内容
    let content = siteContentJson[lang];

    // 遍历路径获取内容
    for (const key of path) {
      if (content && typeof content === "object" && key in content) {
        content = content[key as keyof typeof content];
      } else {
        console.warn(
          `Content not found for path: ${path.join(
            "."
          )} in locale: ${lang}`
        );
        return undefined;
      }
    }

    return content;
  } catch (error) {
    console.error(`Error getting content for path: ${path.join(".")}`, error);
    return undefined;
  }
}

/**
 * 格式化内容字符串，替换占位符
 * @param content 内容字符串，包含 {placeholder} 格式的占位符
 * @param replacements 替换值对象
 * @returns 替换占位符后的字符串
 */
export function formatContent(
  content: string,
  replacements: Record<string, string | number>
): string {
  if (!content) return "";

  return content.replace(/\{([^}]+)\}/g, (_, key) => {
    return replacements[key] !== undefined
      ? String(replacements[key])
      : `{${key}}`;
  });
}

/**
 * 获取格式化的内容
 * @param path 内容路径
 * @param replacements 替换值对象
 * @param locale 可选语言，默认使用当前语言
 * @returns 格式化后的内容
 */
export function getFormattedContent(
  path: ContentPath,
  replacements?: Record<string, string | number>,
  locale?: Locale
): string {
  const content = getContent(path, locale);

  if (typeof content !== "string") {
    return content || "";
  }

  return replacements ? formatContent(content, replacements) : content;
}

/**
 * 获取功能项列表
 * @param locale 可选语言，默认使用当前语言
 * @returns 功能项列表
 */
export function getFeatures(locale?: Locale) {
  return getContent(["features", "items"], locale) || [];
}

/**
 * 获取快速开始步骤
 * @param locale 可选语言，默认使用当前语言
 * @returns 快速开始步骤
 */
export function getQuickStartSteps(locale?: Locale) {
  return getContent(["quickStart", "steps"], locale) || [];
}

/**
 * 获取更新日志版本
 * @param locale 可选语言，默认使用当前语言
 * @returns 更新日志版本列表
 */
export function getChangelogVersions(locale?: Locale) {
  return getContent(["news", "updates", "versions"], locale) || [];
}

/**
 * 获取当前年份的版权信息
 * @param locale 可选语言，默认使用当前语言
 * @returns 格式化的版权信息
 */
export function getCopyright(locale?: Locale): string {
  const copyright = getContent(["footer", "copyright"], locale);
  return formatContent(copyright, {
    year: new Date().getFullYear().toString(),
  });
}

export default {
  getContent,
  formatContent,
  getFormattedContent,
  getFeatures,
  getQuickStartSteps,
  getChangelogVersions,
  getCopyright,
};
