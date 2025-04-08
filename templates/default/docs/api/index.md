# API 文档

本节包含 FreshPress 的 API 文档，帮助您了解如何使用和扩展 FreshPress 的功能。

## 配置 API

FreshPress 的配置系统允许您自定义网站的各个方面。

### 基本配置

在项目根目录的 `freshpress.config.ts` 文件中定义配置：

```typescript
import { FreshPressConfig } from "$freshpress/mod.ts";

export const config: FreshPressConfig = {
  site: {
    title: "我的网站",
    description: "使用 FreshPress 创建的网站",
    language: "zh-CN",
    timezone: "Asia/Shanghai"
  },
  theme: {
    name: "default",
    options: {
      primaryColor: "#3498db",
      secondaryColor: "#2ecc71"
    }
  },
  plugins: [
    {
      name: "blog",
      options: {
        postsPerPage: 10,
        dateFormat: "YYYY-MM-DD"
      }
    }
  ],
  build: {
    output: "dist",
    clean: true
  }
};

export default config;
```

## 插件 API

FreshPress 的插件系统允许您扩展网站的功能。

### 创建插件

创建一个新的插件目录：

```typescript
// plugins/my-plugin/mod.ts
import { Plugin } from "$freshpress/mod.ts";

export class MyPlugin implements Plugin {
  name = "my-plugin";
  version = "1.0.0";
  
  constructor(options: Record<string, unknown> = {}) {
    // 初始化插件配置
    this.options = options;
  }
  
  // 插件初始化时调用
  async init() {
    console.log("插件初始化");
  }
  
  // 其他插件方法...
}
```

### 使用插件

在配置文件中添加插件：

```typescript
// freshpress.config.ts
export const config: FreshPressConfig = {
  // ...其他配置
  plugins: [
    {
      name: "my-plugin",
      options: {
        // 插件选项
      }
    }
  ]
};
```

## 主题 API

FreshPress 的主题系统允许您自定义网站的外观。

### 创建主题

```typescript
// themes/my-theme/mod.ts
import { Theme } from "$freshpress/mod.ts";

export class MyTheme implements Theme {
  name = "my-theme";
  version = "1.0.0";
  
  constructor(options: Record<string, unknown> = {}) {
    // 初始化主题配置
    this.options = options;
  }
  
  // 主题初始化时调用
  async init() {
    console.log("主题初始化");
  }
  
  // 其他主题方法...
}
```

有关更详细的 API 文档，请参考各个模块的具体说明。 