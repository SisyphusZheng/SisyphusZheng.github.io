/**
 * 主题系统接口
 * 定义了FreshPress的主题模型和操作方法
 */

/**
 * 主题接口
 */
export interface Theme {
  /** 主题名称 */
  name: string;
  /** 主题版本 */
  version: string;
  /** 主题描述 */
  description: string;
  /** 主题作者 */
  author?: string;
  /** 主题配置 */
  config: ThemeConfig;
  /** 应用主题 */
  apply(): void;
  /** 自定义主题 */
  customize(options: ThemeOptions): void;
}

/**
 * 主题配置接口
 */
export interface ThemeConfig {
  /** 颜色配置 */
  colors: Record<string, string>;
  /** 字体配置 */
  fonts: Record<string, string>;
  /** 间距配置 */
  spacing: Record<string, string>;
  /** 断点配置 */
  breakpoints: Record<string, string>;
  /** 布局配置 */
  layout: Record<string, any>;
  /** 自定义配置 */
  custom?: Record<string, any>;
}

/**
 * 主题选项接口
 */
export interface ThemeOptions {
  /** 颜色选项 */
  colors?: Record<string, string>;
  /** 字体选项 */
  fonts?: Record<string, string>;
  /** 间距选项 */
  spacing?: Record<string, string>;
  /** 断点选项 */
  breakpoints?: Record<string, string>;
  /** 布局选项 */
  layout?: Record<string, any>;
  /** 自定义选项 */
  custom?: Record<string, any>;
}

/**
 * 主题管理器接口
 */
export interface ThemeManager {
  /**
   * 获取所有主题
   */
  getAllThemes(): Theme[];

  /**
   * 获取指定主题
   * @param name 主题名称
   */
  getTheme(name: string): Theme | null;

  /**
   * 获取当前主题
   */
  getCurrentTheme(): Theme | null;

  /**
   * 设置当前主题
   * @param name 主题名称
   */
  setCurrentTheme(name: string): void;

  /**
   * 添加主题
   * @param theme 主题对象
   */
  addTheme(theme: Theme): void;

  /**
   * 移除主题
   * @param name 主题名称
   */
  removeTheme(name: string): void;

  /**
   * 应用当前主题
   */
  applyCurrentTheme(): void;
}

/**
 * 主题资源接口
 */
export interface ThemeAssets {
  /** CSS文件列表 */
  css: string[];
  /** JavaScript文件列表 */
  js: string[];
  /** 图片文件列表 */
  images: Record<string, string>;
  /** 字体文件列表 */
  fonts: Record<string, string>;
  /** 其他资源 */
  other?: Record<string, string>;
}

/**
 * 主题组件接口
 */
export interface ThemeComponent {
  /** 组件名称 */
  name: string;
  /** 组件类型 */
  type: "layout" | "partial" | "component";
  /** 组件路径 */
  path: string;
}

/**
 * 主题管理器实现类
 * 管理系统中的所有主题，并处理主题应用和切换逻辑
 */
export class ThemeManager {
  private themes: Map<string, Theme> = new Map();
  private currentThemeName: string | null = null;

  constructor() {
    console.log("[ThemeManager] 初始化主题管理器");
  }

  /**
   * 获取所有主题
   */
  getAllThemes(): Theme[] {
    return Array.from(this.themes.values());
  }

  /**
   * 获取指定主题
   * @param name 主题名称
   */
  getTheme(name: string): Theme | null {
    return this.themes.get(name) || null;
  }

  /**
   * 获取当前主题
   */
  getCurrentTheme(): Theme | null {
    if (!this.currentThemeName) return null;
    return this.getTheme(this.currentThemeName);
  }

  /**
   * 设置当前主题
   * @param name 主题名称
   */
  setCurrentTheme(name: string): void {
    if (!this.themes.has(name)) {
      throw new Error(`找不到主题: ${name}`);
    }
    this.currentThemeName = name;
    this.applyCurrentTheme();
  }

  /**
   * 添加主题
   * @param theme 主题对象
   */
  addTheme(theme: Theme): void {
    if (!theme || !theme.name) {
      throw new Error("无效的主题对象");
    }
    this.themes.set(theme.name, theme);
    console.log(`[ThemeManager] 添加主题: ${theme.name}`);
  }

  /**
   * 移除主题
   * @param name 主题名称
   */
  removeTheme(name: string): void {
    if (this.currentThemeName === name) {
      this.currentThemeName = null;
    }
    this.themes.delete(name);
  }

  /**
   * 应用当前主题
   */
  applyCurrentTheme(): void {
    const theme = this.getCurrentTheme();
    if (theme) {
      console.log(`[ThemeManager] 应用主题: ${theme.name}`);
      theme.apply();
    }
  }
}
