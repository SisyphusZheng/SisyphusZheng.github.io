/**
 * FreshPress日期处理插件
 * 提供国际化日期格式化和处理功能
 */

import { Plugin } from "../../core/plugin.ts";

/**
 * 日期插件配置
 */
export interface DatePluginConfig {
  /** 默认格式 */
  defaultFormat: string;
  /** 默认语言 */
  defaultLocale: string;
  /** 相对时间启用 */
  enableRelativeTime: boolean;
  /** 相对时间阈值(毫秒) */
  relativeTimeThreshold: number;
}

/**
 * 日期插件默认配置
 */
export const DEFAULT_CONFIG: DatePluginConfig = {
  defaultFormat: "YYYY-MM-DD",
  defaultLocale: "zh-CN",
  enableRelativeTime: true,
  relativeTimeThreshold: 7 * 24 * 60 * 60 * 1000, // 7天
};

/**
 * 月份名称
 */
const MONTH_NAMES: Record<string, string[]> = {
  "en-US": [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],
  "zh-CN": [
    "一月",
    "二月",
    "三月",
    "四月",
    "五月",
    "六月",
    "七月",
    "八月",
    "九月",
    "十月",
    "十一月",
    "十二月",
  ],
};

/**
 * 星期名称
 */
const WEEKDAY_NAMES: Record<string, string[]> = {
  "en-US": [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ],
  "zh-CN": [
    "星期日",
    "星期一",
    "星期二",
    "星期三",
    "星期四",
    "星期五",
    "星期六",
  ],
};

/**
 * 日期插件类
 */
export class DatePlugin implements Plugin {
  name = "date";
  version = "1.0.0";
  description = "Date formatting and processing plugin for FreshPress";
  author = "FreshPress Team";

  /** 插件配置 */
  config: DatePluginConfig;

  constructor(config: Partial<DatePluginConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * 安装插件
   */
  async install(): Promise<void> {
    // 日期插件不需要特殊安装步骤
  }

  /**
   * 卸载插件
   */
  async uninstall(): Promise<void> {
    // 日期插件不需要特殊卸载步骤
  }

  /**
   * 激活插件
   */
  async activate(): Promise<void> {
    // 日期插件不需要特殊激活步骤
  }

  /**
   * 停用插件
   */
  async deactivate(): Promise<void> {
    // 日期插件不需要特殊停用步骤
  }

  /**
   * 配置插件
   */
  async configure(options: Partial<DatePluginConfig>): Promise<void> {
    this.config = { ...this.config, ...options };
  }

  /**
   * 格式化日期
   * @param date 日期对象或日期字符串
   * @param format 格式字符串
   * @param locale 语言环境
   * @returns 格式化后的日期字符串
   */
  formatDate(
    date: Date | string,
    format: string = this.config.defaultFormat,
    locale: string = this.config.defaultLocale
  ): string {
    const dateObj = typeof date === "string" ? new Date(date) : date;

    if (isNaN(dateObj.getTime())) {
      return "Invalid Date";
    }

    // 如果启用了相对时间，并且日期在阈值内，则返回相对时间
    if (this.config.enableRelativeTime) {
      const now = new Date();
      const diff = now.getTime() - dateObj.getTime();

      if (diff < this.config.relativeTimeThreshold) {
        return this.getRelativeTime(dateObj, now, locale);
      }
    }

    return format.replace(
      /YYYY|YY|MM|M|DD|D|HH|H|mm|m|ss|s|SSS|ddd|dd|d/g,
      (match) => {
        switch (match) {
          case "YYYY":
            return dateObj.getFullYear().toString();
          case "YY":
            return dateObj.getFullYear().toString().slice(-2);
          case "MM":
            return (dateObj.getMonth() + 1).toString().padStart(2, "0");
          case "M":
            return (dateObj.getMonth() + 1).toString();
          case "DD":
            return dateObj.getDate().toString().padStart(2, "0");
          case "D":
            return dateObj.getDate().toString();
          case "HH":
            return dateObj.getHours().toString().padStart(2, "0");
          case "H":
            return dateObj.getHours().toString();
          case "mm":
            return dateObj.getMinutes().toString().padStart(2, "0");
          case "m":
            return dateObj.getMinutes().toString();
          case "ss":
            return dateObj.getSeconds().toString().padStart(2, "0");
          case "s":
            return dateObj.getSeconds().toString();
          case "SSS":
            return dateObj.getMilliseconds().toString().padStart(3, "0");
          case "ddd":
            return this.getWeekdayName(dateObj.getDay(), locale);
          case "dd":
            return this.getWeekdayShortName(dateObj.getDay(), locale);
          case "d":
            return dateObj.getDay().toString();
          default:
            return match;
        }
      }
    );
  }

  /**
   * 获取相对时间
   */
  private getRelativeTime(date: Date, now: Date, locale: string): string {
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (locale === "zh-CN") {
      if (diffSec < 60) return "刚刚";
      if (diffMin < 60) return `${diffMin}分钟前`;
      if (diffHour < 24) return `${diffHour}小时前`;
      if (diffDay < 30) return `${diffDay}天前`;
    } else {
      if (diffSec < 60) return "just now";
      if (diffMin < 60) return `${diffMin} minute${diffMin > 1 ? "s" : ""} ago`;
      if (diffHour < 24)
        return `${diffHour} hour${diffHour > 1 ? "s" : ""} ago`;
      if (diffDay < 30) return `${diffDay} day${diffDay > 1 ? "s" : ""} ago`;
    }

    // 如果超过30天，返回标准格式
    return this.formatDate(date, "YYYY-MM-DD", locale);
  }

  /**
   * 获取星期名称
   */
  getWeekdayName(
    day: number,
    locale: string = this.config.defaultLocale
  ): string {
    const names = WEEKDAY_NAMES[locale] || WEEKDAY_NAMES["en-US"];
    return names[day];
  }

  /**
   * 获取星期短名称
   */
  getWeekdayShortName(
    day: number,
    locale: string = this.config.defaultLocale
  ): string {
    const name = this.getWeekdayName(day, locale);
    return locale === "zh-CN" ? name.substring(0, 3) : name.substring(0, 3);
  }

  /**
   * 获取月份名称
   */
  getMonthName(
    month: number,
    locale: string = this.config.defaultLocale
  ): string {
    const names = MONTH_NAMES[locale] || MONTH_NAMES["en-US"];
    return names[month];
  }

  /**
   * 获取月份短名称
   */
  getMonthShortName(
    month: number,
    locale: string = this.config.defaultLocale
  ): string {
    const name = this.getMonthName(month, locale);
    return locale === "zh-CN" ? name : name.substring(0, 3);
  }

  /**
   * 计算两个日期之间的差距
   */
  dateDiff(
    date1: Date | string,
    date2: Date | string = new Date(),
    unit: "days" | "hours" | "minutes" | "seconds" | "milliseconds" = "days"
  ): number {
    const d1 = typeof date1 === "string" ? new Date(date1) : date1;
    const d2 = typeof date2 === "string" ? new Date(date2) : date2;

    const diffMs = Math.abs(d2.getTime() - d1.getTime());

    switch (unit) {
      case "days":
        return Math.floor(diffMs / (1000 * 60 * 60 * 24));
      case "hours":
        return Math.floor(diffMs / (1000 * 60 * 60));
      case "minutes":
        return Math.floor(diffMs / (1000 * 60));
      case "seconds":
        return Math.floor(diffMs / 1000);
      case "milliseconds":
      default:
        return diffMs;
    }
  }
}
