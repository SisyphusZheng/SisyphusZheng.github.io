import { i18nPlugin } from "./i18n/mod.ts";
import { BlogPlugin } from "./blog/mod.ts";
import { ProjectsPlugin } from "./projects/mod.ts";

// 创建插件实例
const blogPlugin = new BlogPlugin({
  postsDir: "docs/blog",
});
const projectsPlugin = new ProjectsPlugin();

// 初始化所有插件
export async function initPlugins() {
  console.log("[Plugins] 开始初始化所有插件...");

  // 初始化i18n插件
  if (!i18nPlugin.initialized) {
    console.log("[Plugins] 初始化i18n插件");
    await i18nPlugin.activate();
  }

  // 初始化博客插件
  if (!blogPlugin.initialized) {
    console.log("[Plugins] 初始化博客插件");
    await blogPlugin.activate();
  }

  // 初始化项目插件
  if (!projectsPlugin.initialized) {
    console.log("[Plugins] 初始化项目插件");
    await projectsPlugin.activate();
  }

  console.log("[Plugins] 所有插件初始化完成");
}

// 导出常用插件实例
export { i18nPlugin, blogPlugin, projectsPlugin };
