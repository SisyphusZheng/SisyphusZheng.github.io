import { Plugin } from "./plugin.ts";

/**
 * 应用程序基础接口
 */
export interface App {
  /**
   * 使用插件
   */
  use(plugin: Plugin): void;
}
