/**
 * FreshPress深色主题
 * 继承默认主题并提供深色模式的样式
 */

import { ThemeConfig, ThemeOptions } from "../../core/theme.ts";
import DefaultTheme, { DEFAULT_CONFIG } from "../default/mod.ts";

/**
 * 深色主题配置
 */
export const DARK_CONFIG: ThemeConfig = {
  ...DEFAULT_CONFIG,
  // 覆盖颜色配置
  colors: {
    // 主要颜色
    primary: "#61dafb",
    primaryDark: "#21a9d6",
    primaryLight: "#8fe7fc",

    // 次要颜色
    secondary: "#10b981",
    secondaryDark: "#059669",
    secondaryLight: "#34d399",

    // 强调色
    accent: "#8b5cf6",
    accentDark: "#6d28d9",
    accentLight: "#a78bfa",

    // 灰度
    white: "#ffffff",
    gray100: "#f3f4f6",
    gray200: "#e5e7eb",
    gray300: "#d1d5db",
    gray400: "#9ca3af",
    gray500: "#6b7280",
    gray600: "#4b5563",
    gray700: "#374151",
    gray800: "#1f2937",
    gray900: "#111827",
    black: "#000000",

    // 状态颜色
    success: "#10b981",
    info: "#0ea5e9",
    warning: "#f59e0b",
    danger: "#ef4444",

    // 文本颜色
    textPrimary: "#f9fafb",
    textSecondary: "#e5e7eb",
    textLight: "#d1d5db",

    // 背景颜色
    bgPrimary: "#1f2937",
    bgSecondary: "#111827",
    bgDark: "#030712",
  },
};

/**
 * 深色主题
 */
export class DarkTheme extends DefaultTheme {
  name = "dark";
  version = "1.0.0";
  description = "Dark theme for FreshPress";
  author = "FreshPress Team";

  constructor(options: ThemeOptions = {}) {
    super();
    this.config = this.mergeConfig(DARK_CONFIG, options);
  }

  /**
   * 应用主题
   */
  apply(): void {
    // 在实际的实现中，这会将主题应用到全局样式
    console.log(`Applying ${this.name} theme (v${this.version})`);

    // 添加深色模式特有的功能
    this.addDarkModeStyles();
  }

  /**
   * 添加深色模式特有的样式
   */
  private addDarkModeStyles(): void {
    // 这里可以添加深色模式特有的样式或功能
  }

  /**
   * 检测系统颜色模式
   */
  detectColorScheme(): "light" | "dark" {
    if (typeof window !== "undefined" && window.matchMedia) {
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    return "dark"; // 默认为深色
  }

  /**
   * 生成CSS变量
   */
  generateCssVariables(): string {
    const css = super.generateCssVariables();

    // 添加深色模式特有的变量
    return (
      css +
      `
@media (prefers-color-scheme: dark) {
  :root {
    /* 自动深色模式变量 */
    --auto-bg-color: var(--color-bgPrimary);
    --auto-text-color: var(--color-textPrimary);
  }
}
`
    );
  }
}

// 默认导出主题类
export default DarkTheme;
