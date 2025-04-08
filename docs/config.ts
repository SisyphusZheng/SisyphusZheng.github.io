import { FreshPressConfig } from "../mod.ts";

/**
 * 默认站点配置
 */
export const defaultConfig: FreshPressConfig = {
  site: {
    title: "FreshPress Site",
    description: "A modern static site built with FreshPress",
    author: "FreshPress User",
    language: ["en-US"],
  },
  theme: {
    name: "default",
    options: {},
  },
  plugins: {
    enabled: [],
    config: {},
  },
  build: {
    output: "_site",
    optimize: true,
    minify: true,
  },
};

/**
 * 当前站点配置
 * 在实际应用中，这将从配置文件中加载
 */
export let siteConfig: FreshPressConfig = { ...defaultConfig };

/**
 * 加载配置
 * @param config 配置对象
 */
export function loadConfig(config: Partial<FreshPressConfig>): void {
  siteConfig = {
    ...defaultConfig,
    ...config,
    site: {
      ...defaultConfig.site,
      ...config.site,
    },
    theme: {
      ...defaultConfig.theme,
      ...config.theme,
    },
    plugins: {
      ...defaultConfig.plugins,
      ...config.plugins,
      enabled: [...(config.plugins?.enabled || defaultConfig.plugins.enabled)],
      config: {
        ...defaultConfig.plugins.config,
        ...config.plugins?.config,
      },
    },
    build: {
      ...defaultConfig.build,
      ...config.build,
    },
  };
}

/**
 * 获取配置值
 * @param key 配置键，使用点号分隔，如 "site.title"
 * @returns 配置值
 */
export function getConfigValue(key: string): any {
  const keys = key.split(".");
  let value: any = siteConfig;

  for (const k of keys) {
    if (value === undefined || value === null) {
      return undefined;
    }
    value = value[k];
  }

  return value;
}

/**
 * 设置配置值
 * @param key 配置键，使用点号分隔，如 "site.title"
 * @param value 配置值
 */
export function setConfigValue(key: string, value: any): void {
  const keys = key.split(".");
  let current: any = siteConfig;

  for (let i = 0; i < keys.length - 1; i++) {
    const k = keys[i];
    if (current[k] === undefined) {
      current[k] = {};
    }
    current = current[k];
  }

  current[keys[keys.length - 1]] = value;
}

/**
 * 验证配置
 * @returns 是否有效
 */
export function validateConfig(): boolean {
  // 在实际实现中，这将验证配置
  return true;
}

/**
 * 导出配置
 * @returns 配置对象
 */
export function exportConfig(): FreshPressConfig {
  return { ...siteConfig };
}
