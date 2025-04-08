# 快速入门指南

本指南将帮助您开始使用 FreshPress 创建静态网站。

## 前提条件

在开始之前，请确保您已安装 [Deno](https://deno.land/#installation)。

## 创建新项目

使用以下命令创建一个新的 FreshPress 项目：

```bash
deno run -A https://deno.land/x/freshpress@0.3.0/scripts/create.ts --name my-site
```

这将创建一个名为 `my-site` 的新目录，其中包含一个基本的 FreshPress 项目结构。

## 目录结构

新创建的项目具有以下结构：

```
my-site/                    # 项目根目录
├── .freshpress/            # FreshPress 配置目录
│   ├── config.ts           # 框架配置
│   ├── theme/              # 自定义主题
│   └── plugins/            # 本地插件
├── docs/                   # 文档内容
│   ├── guide/              # 指南文档
│   │   └── getting-started.md
│   ├── api/                # API 文档
│   └── index.md            # 首页
├── public/                 # 静态资源
│   └── logo.png
└── freshpress.config.ts    # 主配置文件
```

## 开发工作流程

### 启动开发服务器

```bash
deno task dev
```

这将启动开发服务器，您可以在 http://localhost:8000 访问您的网站。

### 构建静态网站

```bash
deno task build
```

这将生成一个包含您网站的静态 HTML、CSS 和 JavaScript 文件的 `dist` 目录。

### 预览构建结果

```bash
deno task preview
```

这将启动本地服务器，用于预览已构建的静态网站。

## 添加内容

FreshPress 使用 Markdown 文件来组织内容。您可以在 `docs` 目录中创建新的 Markdown 文件来添加内容。

例如，创建一个新的页面：

```markdown
# 我的新页面

这是一个新页面的内容。
```

## 下一步

- [了解如何使用 Markdown](/guide/markdown)
- [自定义网站主题](/guide/themes)
- [添加插件扩展功能](/guide/plugins) 