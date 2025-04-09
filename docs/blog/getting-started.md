---
title: 使用 FreshPress 开始你的静态网站之旅
slug: getting-started
date: 2024-04-10
author: zhizheng
excerpt: 了解如何使用 FreshPress 快速搭建现代化静态网站，从安装到发布，全面指南。
cover: /static/favicon.svg
tags:
  - 教程
  - 入门
  - Deno
---

# 使用 FreshPress 开始你的静态网站之旅

FreshPress 是一个现代化的静态网站生成器，基于 Deno 和 Fresh 框架构建。它提供了简单直观的 API，让你可以快速搭建高性能的静态网站。本文将带你了解如何安装 FreshPress 并创建你的第一个网站。

## 前置条件

在开始之前，请确保你的系统中已安装 Deno 运行时。如果没有，可以通过以下命令安装：

```bash
# Windows (PowerShell)
irm https://deno.land/install.ps1 | iex

# macOS, Linux
curl -fsSL https://deno.land/x/install/install.sh | sh
```

## 安装 FreshPress

使用以下命令创建一个新的 FreshPress 项目：

```bash
deno run -A --unstable-sloppy-imports https://freshpress.deno.dev/create.ts my-website
cd my-website
```

## 目录结构

创建项目后，你会看到以下目录结构：

```
my-website/
├── components/      # 可复用的组件
├── data/            # 网站数据（博客文章、项目等）
├── islands/         # 客户端交互组件
├── plugins/         # 插件目录
├── routes/          # 页面路由
├── static/          # 静态资源
├── themes/          # 主题目录
├── deno.json        # Deno 配置
└── import_map.json  # 导入映射
```

## 开发服务器

运行以下命令启动开发服务器：

```bash
deno task dev
```

然后在浏览器中打开 http://localhost:8000 即可看到你的网站。

## 添加内容

### 创建博客文章

在 `data/blog` 目录下创建 Markdown 文件，例如 `my-first-post.md`：

```markdown
---
title: 我的第一篇博客
slug: my-first-post
date: 2024-04-10
author: 你的名字
excerpt: 这是我使用 FreshPress 创建的第一篇博客文章。
cover: /images/blog/my-post.jpg
tags:
  - 博客
  - 示例
---

# 我的第一篇博客

这是正文内容...
```

### 创建项目展示

在 `data/projects` 目录下创建 JSON 文件，例如 `my-project.json`：

```json
{
  "id": "my-project",
  "slug": "my-project",
  "title": "我的项目",
  "description": "这是我的示例项目描述",
  "image": "/images/projects/my-project.jpg",
  "githubUrl": "https://github.com/yourusername/my-project",
  "demoUrl": "https://my-project-demo.com",
  "technologies": ["Deno", "TypeScript", "Fresh"],
  "features": ["响应式设计", "高性能", "易于使用"],
  "longDescription": "这里是项目的详细描述..."
}
```

## 构建静态网站

当你准备部署时，使用以下命令构建静态网站：

```bash
deno task build
```

构建完成后，所有静态文件都会生成在 `_site` 目录中。

## 部署

你可以将生成的 `_site` 目录部署到任何静态网站托管服务，如 Netlify、Vercel、GitHub Pages 等。

例如，使用 Deno Deploy 部署：

```bash
deno task deploy
```

## 结论

使用 FreshPress，你可以快速搭建现代化的静态网站，专注于内容创作而不是复杂的配置。通过插件系统，你还可以轻松扩展网站功能，满足各种需求。

如果你有任何问题或建议，请访问我们的 [GitHub 仓库](https://github.com/freshpress/freshpress)。

祝你使用愉快！ 