
// 自动生成的配置文件 - 请勿手动修改
window.__fp_config = {
  "site": {
    "title": "FreshPress 站点",
    "description": "使用 FreshPress 构建的现代化静态网站",
    "language": "zh-CN"
  },
  "plugins": {
    "enabled": [
      "blog",
      "search",
      "i18n",
      "projects",
      "resume"
    ]
  }
};
window.__enabledPlugins = ["blog","search","i18n","projects","resume"];
console.log("[Config] 已加载配置:", window.__fp_config);
console.log("[Config] 已启用插件:", window.__enabledPlugins);

// 存入localStorage以供离线使用
try {
  localStorage.setItem('fp_config', JSON.stringify(window.__fp_config));
} catch (e) {
  console.error("[Config] 无法保存配置到localStorage:", e);
}
