/**
 * 简易插件管理脚本
 * 用法: deno run -A scripts/toggle-plugin.ts [plugin] [enable/disable]
 * 例如: deno run -A scripts/toggle-plugin.ts blog disable
 */

// 导入配置助手
import { main as generateConfig } from "./config-helper.ts";

// 使此文件成为模块
export {};

// 读取配置文件
const configPath = "./freshpress.config.ts";
const configContent = await Deno.readTextFile(configPath);

// 命令行参数
const plugin = Deno.args[0];
const action = Deno.args[1]?.toLowerCase();

// 检查参数
if (!plugin || (action !== "enable" && action !== "disable")) {
  console.log(
    "用法: deno run -A scripts/toggle-plugin.ts [plugin] [enable/disable]"
  );
  console.log("支持的插件: blog, search, i18n, projects, resume");
  console.log("示例: deno run -A scripts/toggle-plugin.ts blog disable");
  Deno.exit(1);
}

// 支持的插件列表
const supportedPlugins = ["blog", "search", "i18n", "projects", "resume"];

if (!supportedPlugins.includes(plugin)) {
  console.error(`错误: 不支持的插件 "${plugin}"`);
  console.log(`支持的插件: ${supportedPlugins.join(", ")}`);
  Deno.exit(1);
}

// 尝试提取当前启用的插件列表
const enabledRegex = /enabled:\s*\[([\s\S]*?)\]/;
const match = configContent.match(enabledRegex);

if (!match) {
  console.error("错误: 无法在配置文件中找到启用的插件列表");
  Deno.exit(1);
}

// 解析当前启用的插件
const enabledPluginsString = match[1];
const enabledPlugins = enabledPluginsString
  .split(",")
  .map((p) =>
    p
      .trim()
      .replace(/['"]/g, "")
      .replace(/\/\/.*$/, "")
      .trim()
  )
  .filter((p) => p);

// 执行操作
let newEnabledPlugins: string[];

if (action === "enable") {
  // 如果插件已启用，不做任何改变
  if (enabledPlugins.includes(plugin)) {
    console.log(`插件 "${plugin}" 已经启用`);
    Deno.exit(0);
  }
  // 添加插件到启用列表
  newEnabledPlugins = [...enabledPlugins, plugin];
  console.log(`已启用插件 "${plugin}"`);
} else {
  // 禁用插件
  newEnabledPlugins = enabledPlugins.filter((p) => p !== plugin);
  if (enabledPlugins.length === newEnabledPlugins.length) {
    console.log(`插件 "${plugin}" 已经禁用`);
    Deno.exit(0);
  }
  console.log(`已禁用插件 "${plugin}"`);
}

// 格式化新的启用插件列表
const newEnabledPluginsString = newEnabledPlugins
  .map((p) => `      "${p}"`)
  .join(",\n");

// 更新配置文件
const updatedContent = configContent.replace(
  enabledRegex,
  `enabled: [\n${newEnabledPluginsString}\n    ]`
);

// 写入文件
await Deno.writeTextFile(configPath, updatedContent);
console.log("配置文件已更新");

// 生成配置文件以便客户端读取
console.log("生成客户端配置文件...");
try {
  await generateConfig();
  console.log("客户端配置文件生成成功");
} catch (error) {
  console.error("生成客户端配置文件失败:", error);
}
