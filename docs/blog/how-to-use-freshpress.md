---
title: 如何使用 FreshPress 创建现代静态网站
date: 2024-04-10
author: 张三
tags: [FreshPress, 静态网站, Deno, 教程]
excerpt: 本文介绍了如何发布和使用 FreshPress 框架，从框架发布到用户使用的完整流程。
---

# 如何使用 FreshPress 创建现代静态网站

最近我发布了我的新项目 FreshPress，这是一个基于 Deno 和 Fresh 的现代静态网站生成框架。在这篇文章中，我想分享一下如何将这个框架发布出去，以及用户如何使用它来创建自己的网站。

## 发布框架

作为框架开发者，我首先需要将 FreshPress 发布到 Deno 的模块注册表。有两种主要方式：

### 方式一：通过 deno.land/x 发布

这是最常见的方式，步骤如下：

1. 将代码推送到 GitHub 仓库
2. 创建版本标签，例如 `v0.3.0`
3. deno.land/x 会自动镜像仓库内容

用户就可以通过 `https://deno.land/x/freshpress@0.3.0/` 这样的 URL 来使用我的框架了。

### 方式二：使用 jsr.io

如果想要更专业的包管理体验，可以使用 JSR：

```bash
deno publish
```

这会将框架发布到 JSR 注册表，用户可以通过 `jsr:@username/freshpress` 这样的导入路径来使用。

## 用户使用方式

作为用户，有几种方式可以开始使用 FreshPress：

### 方式一：使用 create 脚本（推荐）

最简单的方式是直接运行我提供的创建脚本：

```bash
# 创建名为 my-site 的新项目
deno run -A https://deno.land/x/freshpress@0.3.0/scripts/create.ts my-site

# 或者使用交互式创建
deno run -A https://deno.land/x/freshpress@0.3.0/scripts/create.ts --interactive
```

这个脚本会创建一个包含所有必要文件的新项目，包括配置文件、目录结构和一些示例文档。然后就可以：

```bash
# 进入项目目录
cd my-site

# 启动开发服务器
deno task dev

# 构建静态站点
deno task build

# 预览构建结果
deno task preview
```

### 方式二：手动创建项目

对于希望更灵活控制项目的高级用户，可以手动创建项目：

1. 创建项目目录结构（docs、public 等）
2. 创建 `deno.json` 配置文件和导入映射
3. 创建 `freshpress.config.ts` 配置文件
4. 在 `docs` 目录添加 Markdown 内容

## 插件和主题扩展

FreshPress 的一大特色是其可扩展性。用户可以使用我内置的任务来管理插件和主题：

```bash
# 列出所有可用插件
deno task plugin:list

# 添加插件
deno task plugin:add blog

# 列出所有可用主题
deno task theme:list

# 添加主题
deno task theme:add minimal
```

这些命令会自动处理依赖下载和配置更新，让用户专注于内容创作。

## 配置管理

为了方便用户管理配置，我还提供了一系列配置相关命令：

```bash
# 获取特定配置项
deno task config:get site.title

# 设置配置项
deno task config:set site.title "我的博客"

# 列出所有配置
deno task config:list
```

## 我的使用体验

作为 FreshPress 的创建者，我自己也在使用它来构建几个项目。从我的经验来看，这种方式比传统的静态网站生成器有几个明显优势：

1. **开发体验**：Deno 的现代特性和 Fresh 的快速刷新让开发过程非常流畅
2. **性能**：生成的静态网站非常快，没有大量的客户端 JavaScript
3. **可维护性**：基于插件的架构让功能扩展变得简单
4. **部署简便**：生成的静态文件可以部署到任何静态托管服务

## 结语

FreshPress 是我尝试解决静态网站生成过程中常见问题的一个尝试。它结合了现代 Web 技术和最佳实践，为用户提供了一个简单但功能强大的工具。

如果你正在寻找一个现代的静态网站生成框架，特别是如果你已经熟悉 Deno 和 Fresh，那么 FreshPress 可能正是你需要的解决方案。

欢迎访问 [FreshPress 文档](https://freshpress.dev) 了解更多信息，或者在 [GitHub](https://github.com/username/freshpress) 上为项目贡献代码。 