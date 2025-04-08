/**
 * 简易的配置助手
 * 直接从文件系统读取配置文件并解析
 */

// 让此文件成为模块
export {};

/**
 * 读取并解析配置文件
 */
async function readConfigFile() {
  try {
    const configPath = "./freshpress.config.ts";
    const configContent = await Deno.readTextFile(configPath);
    console.log("[ConfigHelper] 已读取配置文件");

    // 提取站点信息
    const titleMatch = configContent.match(/title:\s*"([^"]+)"/);
    const descriptionMatch = configContent.match(/description:\s*"([^"]+)"/);
    const languageMatch = configContent.match(/language:\s*"([^"]+)"/);

    const title = titleMatch ? titleMatch[1] : "FreshPress Site";
    const description = descriptionMatch
      ? descriptionMatch[1]
      : "A site built with FreshPress";
    const language = languageMatch ? languageMatch[1] : "en-US";

    // 提取启用的插件列表
    const enabledRegex = /enabled:\s*\[([\s\S]*?)\]/;
    const match = configContent.match(enabledRegex);

    let enabledPlugins = ["blog", "search", "projects", "resume", "i18n"];

    if (match) {
      // 解析当前启用的插件
      const enabledPluginsString = match[1];
      // 使用更精确的正则表达式匹配插件名称，去除注释
      const pluginRegex = /"([^"]+)"/g;
      const plugins = [];
      let pluginMatch;

      while ((pluginMatch = pluginRegex.exec(enabledPluginsString)) !== null) {
        plugins.push(pluginMatch[1]);
      }

      if (plugins.length > 0) {
        enabledPlugins = plugins;
      }
    }

    const config = {
      site: {
        title,
        description,
        language,
      },
      plugins: {
        enabled: enabledPlugins,
      },
    };

    console.log("[ConfigHelper] 配置解析完成:", config);
    return config;
  } catch (error) {
    console.error("[ConfigHelper] 读取或解析配置文件失败:", error);
    return null;
  }
}

/**
 * 保存配置到静态文件中，以便客户端读取
 */
async function saveConfigToStatic(config: any) {
  try {
    if (!config) return;

    // 确保static目录存在
    try {
      await Deno.mkdir("static", { recursive: true });
    } catch (e) {
      // 目录可能已存在，忽略错误
    }

    // 创建一个简单的JavaScript文件，设置全局变量
    const jsContent = `
// 自动生成的配置文件 - 请勿手动修改
window.__fp_config = ${JSON.stringify(config, null, 2)};
window.__enabledPlugins = ${JSON.stringify(config.plugins.enabled)};
console.log("[Config] 已加载配置:", window.__fp_config);
console.log("[Config] 已启用插件:", window.__enabledPlugins);

// 存入localStorage以供离线使用
try {
  localStorage.setItem('fp_config', JSON.stringify(window.__fp_config));
} catch (e) {
  console.error("[Config] 无法保存配置到localStorage:", e);
}
`;

    // 写入静态文件
    await Deno.writeTextFile("static/fp-config.js", jsContent);
    console.log("[ConfigHelper] 配置已保存到静态文件");
    return true;
  } catch (error) {
    console.error("[ConfigHelper] 保存配置到静态文件失败:", error);
    return false;
  }
}

// 主函数
export async function main() {
  console.log("[ConfigHelper] 开始处理配置...");
  const config = await readConfigFile();
  if (config) {
    await saveConfigToStatic(config);
    console.log("[ConfigHelper] 配置处理完成");
    return true;
  } else {
    console.error("[ConfigHelper] 配置处理失败");
    return false;
  }
}

// 如果直接运行此脚本
if (import.meta.main) {
  await main();
}
