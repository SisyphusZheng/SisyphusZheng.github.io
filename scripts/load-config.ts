/**
 * 配置加载脚本
 * 将根目录的freshpress.config.ts配置加载到系统中
 */

import { loadConfig } from "../docs/config.ts";
import { config } from "../freshpress.config.ts";

console.log("[Config] 正在加载网站配置...");

// 使用根目录的配置
loadConfig(config);

console.log("[Config] 配置加载完成");
console.log(`[Config] 站点标题: ${config.site.title}`);
console.log(`[Config] 启用的插件: ${config.plugins.enabled.join(", ")}`);

// 通知加载完成
console.log("[Config] 配置系统已初始化");

// 导出以便作为模块使用
export { config };
