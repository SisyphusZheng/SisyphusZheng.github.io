/**
 * 插件系统接口
 * 定义了FreshPress的插件模型和操作方法
 */

import { App } from "./app.ts";

/**
 * 插件基础接口
 */
export interface Plugin {
  /** 插件名称 */
  name: string;

  /** 插件版本 */
  version: string;

  /** 插件描述 */
  description: string;

  /** 插件作者 */
  author: string;

  /** 插件日志级别 */
  severity: string;

  /**
   * 安装插件
   */
  install?(app?: App): void;

  /**
   * 激活插件
   */
  activate?(): Promise<void>;

  /**
   * 停用插件
   */
  deactivate?(): void;

  /**
   * 配置插件
   */
  configure?(options: any): void;
}

/**
 * 应用接口
 */
export interface App {
  use(plugin: Plugin): void;
}

/**
 * 插件钩子类型
 */
export type PluginHook =
  | "beforeBuild"
  | "afterBuild"
  | "beforeRender"
  | "afterRender"
  | "beforeContentLoad"
  | "afterContentLoad";

/**
 * 插件钩子函数接口
 */
export interface PluginHookFunction {
  (context: any, ...args: any[]): Promise<any>;
}

/**
 * 插件管理器接口
 */
export interface PluginManager {
  /**
   * 获取所有插件
   */
  getAllPlugins(): Plugin[];

  /**
   * 获取指定插件
   * @param name 插件名称
   */
  getPlugin(name: string): Plugin | undefined;

  /**
   * 安装插件
   * @param name 插件名称
   * @param version 插件版本
   */
  installPlugin(name: string, version?: string): Promise<void>;

  /**
   * 卸载插件
   * @param name 插件名称
   */
  uninstallPlugin(name: string): Promise<void>;

  /**
   * 激活插件
   * @param name 插件名称
   */
  activatePlugin(name: string): Promise<void>;

  /**
   * 停用插件
   * @param name 插件名称
   */
  deactivatePlugin(name: string): Promise<void>;

  /**
   * 配置插件
   * @param name 插件名称
   * @param options 配置选项
   */
  configurePlugin(name: string, options: Record<string, any>): Promise<void>;

  /**
   * 注册钩子
   * @param hook 钩子名称
   * @param callback 回调函数
   * @param pluginName 插件名称
   */
  registerHook(
    hook: PluginHook,
    callback: PluginHookFunction,
    pluginName: string
  ): void;

  /**
   * 调用钩子
   * @param hook 钩子名称
   * @param context 上下文
   * @param args 参数
   */
  applyHook(hook: PluginHook, context: any, ...args: any[]): Promise<void>;
}

/**
 * 插件配置选项
 */
export interface PluginOptions {
  /** 是否自动激活 */
  autoActivate?: boolean;
  /** 依赖解析策略 */
  dependencyResolution?: "strict" | "loose";
  /** 插件版本 */
  version?: string;
  /** 配置选项 */
  config?: Record<string, any>;
}

/**
 * 插件注册表接口
 */
export interface PluginRegistry {
  /**
   * 注册插件
   * @param plugin 插件
   */
  register(plugin: Plugin): void;

  /**
   * 移除插件
   * @param name 插件名称
   */
  unregister(name: string): void;

  /**
   * 获取插件
   * @param name 插件名称
   */
  get(name: string): Plugin | null;

  /**
   * 获取所有插件
   */
  getAll(): Plugin[];
}

/**
 * 插件状态
 */
export enum PluginStatus {
  /** 已安装 */
  INSTALLED = "installed",
  /** 已激活 */
  ACTIVE = "active",
  /** 已停用 */
  INACTIVE = "inactive",
  /** 错误 */
  ERROR = "error",
}

/**
 * 插件管理器
 */
export class PluginManager {
  private plugins: Map<string, Plugin> = new Map();
  private activePlugins: Set<string> = new Set();

  /**
   * 注册插件
   */
  async register(plugin: Plugin): Promise<void> {
    if (this.plugins.has(plugin.name)) {
      throw new Error(`Plugin ${plugin.name} is already registered`);
    }

    // 检查依赖
    if (plugin.dependencies) {
      for (const dep of plugin.dependencies) {
        if (!this.plugins.has(dep)) {
          throw new Error(
            `Plugin ${plugin.name} depends on ${dep} which is not registered`
          );
        }
      }
    }

    this.plugins.set(plugin.name, plugin);
  }

  /**
   * 卸载插件
   */
  async unregister(name: string): Promise<void> {
    const plugin = this.plugins.get(name);
    if (!plugin) {
      throw new Error(`Plugin ${name} is not registered`);
    }

    // 检查是否有其他插件依赖此插件
    for (const [pluginName, p] of this.plugins) {
      if (p.dependencies?.includes(name)) {
        throw new Error(
          `Cannot unregister ${name} because ${pluginName} depends on it`
        );
      }
    }

    if (this.activePlugins.has(name)) {
      await this.deactivate(name);
    }

    this.plugins.delete(name);
  }

  /**
   * 激活插件
   */
  async activate(name: string): Promise<void> {
    const plugin = this.plugins.get(name);
    if (!plugin) {
      throw new Error(`Plugin ${name} is not registered`);
    }

    if (this.activePlugins.has(name)) {
      return;
    }

    // 激活依赖
    if (plugin.dependencies) {
      for (const dep of plugin.dependencies) {
        await this.activate(dep);
      }
    }

    await plugin.activate();
    this.activePlugins.add(name);
  }

  /**
   * 停用插件
   */
  async deactivate(name: string): Promise<void> {
    const plugin = this.plugins.get(name);
    if (!plugin) {
      throw new Error(`Plugin ${name} is not registered`);
    }

    if (!this.activePlugins.has(name)) {
      return;
    }

    // 检查是否有其他激活的插件依赖此插件
    for (const [pluginName, p] of this.plugins) {
      if (
        this.activePlugins.has(pluginName) &&
        p.dependencies?.includes(name)
      ) {
        throw new Error(
          `Cannot deactivate ${name} because ${pluginName} depends on it`
        );
      }
    }

    await plugin.deactivate();
    this.activePlugins.delete(name);
  }

  /**
   * 配置插件
   */
  async configure(name: string, options: Record<string, any>): Promise<void> {
    const plugin = this.plugins.get(name);
    if (!plugin) {
      throw new Error(`Plugin ${name} is not registered`);
    }

    await plugin.configure(options);
  }

  /**
   * 获取插件
   */
  getPlugin(name: string): Plugin | undefined {
    return this.plugins.get(name);
  }

  /**
   * 获取所有插件
   */
  getAllPlugins(): Plugin[] {
    return Array.from(this.plugins.values());
  }

  /**
   * 获取激活的插件
   */
  getActivePlugins(): Plugin[] {
    return Array.from(this.activePlugins).map(
      (name) => this.plugins.get(name)!
    );
  }

  /**
   * 检查插件是否激活
   */
  isActive(name: string): boolean {
    return this.activePlugins.has(name);
  }
}
