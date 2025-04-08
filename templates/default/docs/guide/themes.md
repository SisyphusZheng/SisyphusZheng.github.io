# 自定义主题

FreshPress 提供了灵活的主题系统，允许您自定义网站的外观和行为。本指南将帮助您了解如何使用和创建 FreshPress 主题。

## 内置主题

FreshPress 附带了一些内置主题：

- **default**: 默认主题，简洁现代的设计
- **docs**: 专为文档网站设计的主题
- **blog**: 专为博客网站设计的主题
- **portfolio**: 作品集展示主题

## 使用主题

要使用主题，只需在 `freshpress.config.ts` 文件中指定主题名称和选项：

```typescript
// freshpress.config.ts
import { FreshPressConfig } from "$freshpress/mod.ts";

export const config: FreshPressConfig = {
  // ... 其他配置
  theme: {
    name: "blog",
    options: {
      primaryColor: "#3498db",
      secondaryColor: "#2ecc71",
      fontFamily: "Inter, system-ui, sans-serif"
    }
  }
};
```

## 创建自定义主题

您可以通过以下步骤创建自定义主题：

1. 在 `themes` 目录中创建一个新的目录，例如 `themes/my-theme`
2. 创建一个 `mod.ts` 文件作为主题的入口点
3. 实现 `Theme` 接口

```typescript
// themes/my-theme/mod.ts
import { Theme } from "$freshpress/mod.ts";

export class MyTheme implements Theme {
  name = "my-theme";
  version = "1.0.0";
  
  private options: Record<string, unknown>;
  
  constructor(options: Record<string, unknown> = {}) {
    this.options = {
      // 默认选项
      primaryColor: "#3498db",
      secondaryColor: "#2ecc71",
      fontFamily: "system-ui, sans-serif",
      // 合并用户提供的选项
      ...options
    };
  }
  
  async init() {
    console.log("初始化主题:", this.name);
    console.log("主题选项:", this.options);
  }
  
  // 其他主题方法
}
```

4. 创建主题组件和样式

主题通常包含以下文件：

- `components/`: 包含主题组件的目录
  - `Layout.tsx`: 全局布局组件
  - `Header.tsx`: 页眉组件
  - `Footer.tsx`: 页脚组件
  - `Navigation.tsx`: 导航组件
  - 其他组件...
- `styles/`: 包含样式文件的目录
  - `main.css`: 主样式文件
  - 其他样式文件...

5. 在配置文件中使用您的主题

```typescript
// freshpress.config.ts
import { FreshPressConfig } from "$freshpress/mod.ts";
import { MyTheme } from "./themes/my-theme/mod.ts";

export const config: FreshPressConfig = {
  // ... 其他配置
  theme: {
    name: "my-theme",
    options: {
      // 主题选项
      primaryColor: "#ff6b6b",
      secondaryColor: "#4ecdc4"
    }
  }
};
```

## 主题生命周期

主题有以下生命周期方法：

- `init()`: 主题初始化时调用
- `beforeBuild()`: 在构建开始前调用
- `afterBuild()`: 在构建完成后调用
- `getLayout(props)`: 返回布局组件
- `getStyles()`: 返回主题样式

## 主题组件和钩子

主题可以提供以下组件和钩子：

- `Layout`: 全局布局组件
- `Header`: 页眉组件
- `Footer`: 页脚组件
- `Navigation`: 导航组件
- `DocLayout`: 文档布局组件
- `BlogLayout`: 博客布局组件
- `hooks`: 包含钩子函数的对象，用于扩展网站功能

## 获取所有可用主题

要查看所有可用的主题，可以运行以下命令：

```bash
deno task theme:list
```

## 添加外部主题

要添加来自 npm 或 Deno 的外部主题，可以使用以下命令：

```bash
deno task theme:add <主题名称>
```

例如：

```bash
deno task theme:add freshpress-theme-minimal
```

这将自动下载主题并更新您的配置文件。 