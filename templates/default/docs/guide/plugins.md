# 使用插件

FreshPress 的强大功能之一是其灵活的插件系统。插件可以扩展网站的功能，添加新的特性，甚至可以改变网站的行为。

## 内置插件

FreshPress 附带了几个内置插件，可以直接在配置文件中启用：

- **BlogPlugin**: 提供博客功能，包括文章列表、分类、标签等
- **SearchPlugin**: 为网站添加搜索功能
- **SitemapPlugin**: 自动生成网站地图
- **I18nPlugin**: 提供国际化和本地化支持
- **AnalyticsPlugin**: 集成分析和统计功能

## 启用插件

要启用插件，只需在 `freshpress.config.ts` 文件中的 `plugins` 数组中添加插件配置：

```typescript
// freshpress.config.ts
import { FreshPressConfig } from "$freshpress/mod.ts";

export const config: FreshPressConfig = {
  // ... 其他配置
  plugins: [
    {
      name: "blog",
      options: {
        postsDir: "docs/blog",
        postsPerPage: 10
      }
    },
    {
      name: "search",
      options: {
        indexContent: true
      }
    }
  ]
};
```

## 创建自定义插件

您可以通过实现 `Plugin` 接口来创建自己的插件：

1. 在 `plugins` 目录中创建一个新的目录，例如 `plugins/my-plugin`
2. 创建一个 `mod.ts` 文件作为插件的入口点
3. 实现 `Plugin` 接口

```typescript
// plugins/my-plugin/mod.ts
import { Plugin } from "$freshpress/mod.ts";

export class MyPlugin implements Plugin {
  name = "my-plugin";
  version = "1.0.0";
  
  private options: Record<string, unknown>;
  
  constructor(options: Record<string, unknown> = {}) {
    this.options = options;
  }
  
  async init() {
    console.log("初始化插件:", this.name);
    console.log("插件选项:", this.options);
  }
  
  // 其他插件方法
}
```

4. 在配置文件中使用你的插件

```typescript
// freshpress.config.ts
import { FreshPressConfig } from "$freshpress/mod.ts";
import { MyPlugin } from "./plugins/my-plugin/mod.ts";

export const config: FreshPressConfig = {
  // ... 其他配置
  plugins: [
    {
      name: "my-plugin",
      options: {
        // 插件选项
        setting1: "value1",
        setting2: true
      }
    }
  ]
};
```

## 插件生命周期

插件有以下生命周期方法：

- `init()`: 插件初始化时调用
- `beforeBuild()`: 在构建开始前调用
- `afterBuild()`: 在构建完成后调用
- `beforeRender(context)`: 在渲染页面前调用
- `afterRender(context, result)`: 在渲染页面后调用

## 获取所有可用插件

要查看所有可用的插件，可以运行以下命令：

```bash
deno task plugin:list
```

## 添加外部插件

要添加来自 npm 或 Deno 的外部插件，可以使用以下命令：

```bash
deno task plugin:add <插件名称>
```

例如：

```bash
deno task plugin:add freshpress-plugin-analytics
```

这将自动下载插件并更新您的配置文件。 