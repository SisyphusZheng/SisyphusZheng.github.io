/**
 * FreshPress默认主题
 * 提供基础的主题样式和布局
 */

import { Theme, ThemeConfig, ThemeOptions } from "../../core/theme.ts";

/**
 * 默认主题配置
 */
export const DEFAULT_CONFIG: ThemeConfig = {
  // 颜色配置
  colors: {
    // 主要颜色
    primary: "#3498db",
    primaryDark: "#217dbb",
    primaryLight: "#5faee3",

    // 次要颜色
    secondary: "#2ecc71",
    secondaryDark: "#25a25a",
    secondaryLight: "#54d98c",

    // 强调色
    accent: "#9b59b6",
    accentDark: "#8e44ad",
    accentLight: "#b07cc6",

    // 灰度
    white: "#ffffff",
    gray100: "#f8f9fa",
    gray200: "#e9ecef",
    gray300: "#dee2e6",
    gray400: "#ced4da",
    gray500: "#adb5bd",
    gray600: "#6c757d",
    gray700: "#495057",
    gray800: "#343a40",
    gray900: "#212529",
    black: "#000000",

    // 状态颜色
    success: "#28a745",
    info: "#17a2b8",
    warning: "#ffc107",
    danger: "#dc3545",

    // 文本颜色
    textPrimary: "#212529",
    textSecondary: "#6c757d",
    textLight: "#f8f9fa",

    // 背景颜色
    bgPrimary: "#ffffff",
    bgSecondary: "#f8f9fa",
    bgDark: "#343a40",
  },

  // 字体配置
  fonts: {
    // 字体族
    base: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    heading:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    monospace:
      "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",

    // 字体大小
    sizeBase: "1rem",
    sizeSm: "0.875rem",
    sizeLg: "1.25rem",
    sizeXl: "1.5rem",
    size2xl: "1.75rem",
    size3xl: "2rem",
    size4xl: "2.5rem",
    size5xl: "3rem",

    // 字体粗细
    weightLight: "300",
    weightNormal: "400",
    weightMedium: "500",
    weightBold: "700",
  },

  // 间距配置
  spacing: {
    0: "0",
    1: "0.25rem",
    2: "0.5rem",
    3: "0.75rem",
    4: "1rem",
    5: "1.25rem",
    6: "1.5rem",
    8: "2rem",
    10: "2.5rem",
    12: "3rem",
    16: "4rem",
    20: "5rem",
    24: "6rem",
    32: "8rem",
    40: "10rem",
    48: "12rem",
    56: "14rem",
    64: "16rem",
  },

  // 断点配置
  breakpoints: {
    xs: "0",
    sm: "576px",
    md: "768px",
    lg: "992px",
    xl: "1200px",
    xxl: "1400px",
  },

  // 布局配置
  layout: {
    containerMaxWidth: "1200px",
    containerPadding: "1rem",
    sidebarWidth: "280px",
    navbarHeight: "64px",
    footerPadding: "2rem",
    gridColumns: 12,
    gridGap: "1rem",
  },
};

/**
 * 默认主题
 */
export class DefaultTheme implements Theme {
  name = "default";
  version = "1.0.0";
  description = "Default theme for FreshPress";
  author = "FreshPress Team";

  /** 主题配置 */
  config: ThemeConfig;

  constructor(options: ThemeOptions = {}) {
    this.config = this.mergeConfig(DEFAULT_CONFIG, options);
  }

  /**
   * 应用主题
   */
  apply(): void {
    // 在实际的实现中，这会将主题应用到全局样式
    console.log(`Applying ${this.name} theme (v${this.version})`);
  }

  /**
   * 自定义主题
   */
  customize(options: ThemeOptions): void {
    this.config = this.mergeConfig(this.config, options);
  }

  /**
   * 合并配置
   */
  protected mergeConfig(
    base: ThemeConfig,
    override: ThemeOptions
  ): ThemeConfig {
    const result: any = { ...base };

    for (const [key, value] of Object.entries(override)) {
      if (
        key in base &&
        typeof base[key as keyof ThemeConfig] === "object" &&
        value &&
        typeof value === "object"
      ) {
        result[key] = {
          ...base[key as keyof ThemeConfig],
          ...value,
        };
      } else if (value !== undefined) {
        result[key] = value;
      }
    }

    return result as ThemeConfig;
  }

  /**
   * 生成CSS变量
   */
  generateCssVariables(): string {
    let css = ":root {\n";

    // 添加颜色变量
    for (const [name, value] of Object.entries(this.config.colors)) {
      css += `  --color-${name}: ${value};\n`;
    }

    // 添加字体变量
    for (const [name, value] of Object.entries(this.config.fonts)) {
      css += `  --font-${name}: ${value};\n`;
    }

    // 添加间距变量
    for (const [name, value] of Object.entries(this.config.spacing)) {
      css += `  --spacing-${name}: ${value};\n`;
    }

    // 添加布局变量
    for (const [name, value] of Object.entries(this.config.layout)) {
      css += `  --layout-${name}: ${value};\n`;
    }

    css += "}\n";
    return css;
  }

  /**
   * 获取主题资源路径
   */
  getAssetPath(asset: string): string {
    return `/themes/${this.name}/${asset}`;
  }

  /**
   * 获取主题CSS路径
   */
  getCssPath(): string {
    return `/themes/${this.name}/style.css`;
  }

  /**
   * 获取主题JS路径
   */
  getJsPath(): string {
    return `/themes/${this.name}/main.js`;
  }

  /**
   * 获取布局路径
   */
  getLayoutPath(layout: string = "default"): string {
    return `/themes/${this.name}/layouts/${layout}.tsx`;
  }
}

// 默认导出主题类
export default DefaultTheme;
