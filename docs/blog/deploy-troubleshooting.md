---
title: FreshPress部署问题排查与样式丢失解决方案
slug: deploy-troubleshooting
date: 2024-05-20
author: zhizheng
excerpt: 解决FreshPress静态站点部署后样式丢失问题的完整排查过程与解决方案
cover: /static/favicon.svg
tags:
  - 教程
  - 排错
  - 部署
  - 样式
---

# FreshPress部署问题排查与样式丢失解决方案

在使用FreshPress框架开发网站时，我们可能会遇到"部署后样式完全丢失"的问题。本文将详细记录这一问题的排查过程和解决方案，帮助其他开发者避免类似的问题。

## 问题概述

当我们在本地使用`deno task dev`命令进行开发时，网站样式正常显示。然而，当执行`deno task build`构建静态网站并部署后，发现网站样式完全丢失。通过排查，发现存在以下几个核心问题：

1. **构建命令配置不正确**：使用了不匹配的构建命令，导致生成的静态文件与开发环境不一致
2. **临时页面覆盖**：构建过程会将静态资源目录中的文件复制到输出目录，覆盖已生成的HTML文件
3. **依赖路径问题**：`puppeteer`模块没有在import_map中正确映射，导致构建错误

## 解决方案

### 1. 恢复原始构建流程

将`deno.json`中的构建任务恢复为原始配置：

```json
"build": "GITHUB_CLIENT_ID=fake GITHUB_CLIENT_SECRET=fake FACEBOOK_CLIENT_ID=fake FACEBOOK_CLIENT_SECRET=fake GOOGLE_CLIENT_ID=fake GOOGLE_CLIENT_SECRET=fake deno run -A scripts/build-search-index.ts && deno run -A --unstable-kv dev.ts build",
"start": "deno run -A dev.ts",
```

这确保了构建过程与开发环境完全一致。即使不需要这些环境变量，也建议保留它们以防止构建过程中的潜在错误。

### 2. 设置正确的入口文件

创建标准的`dev.ts`和`main.ts`文件：

```typescript
// dev.ts
#!/usr/bin/env -S deno run -A --watch=static/,routes/

import dev from "$fresh/dev.ts";
import config from "./fresh.config.ts";

import "$std/dotenv/load.ts";

await dev(import.meta.url, "./main.ts", config);
```

```typescript
// main.ts
import { start } from "$fresh/server.ts";
import manifest from "./fresh.gen.ts";
import config from "./fresh.config.ts";

/**
 * FreshPress - Modern static site generator based on Fresh framework
 *
 * Usage:
 * 1. Development: deno task start
 * 2. Build: deno task build
 */

await start(manifest, config);
```

确保这些文件与开发环境中使用的完全一致，避免构建过程与开发环境的差异。

### 3. 修复依赖映射

在`import_map.json`中添加缺失的`puppeteer`模块映射：

```json
"puppeteer": "https://deno.land/x/puppeteer@16.2.0/mod.ts",
```

这解决了简历下载功能中使用的`puppeteer`模块导入问题。

### 4. 构建流程修正

在构建过程中，确保删除旧的构建输出，防止文件混合：

```bash
rm -rf _site
deno task build
```

这样可以避免旧文件干扰新的构建过程。

## 技术要点

### Fresh框架的构建特性

Fresh框架的构建机制会生成静态HTML文件，但需要保持与开发环境一致的配置。在构建过程中，它会：

1. 生成路由对应的HTML文件
2. 处理CSS和其他静态资源
3. 优化客户端JavaScript

如果构建配置与开发环境不一致，可能导致生成的静态文件不完整或不正确。

### 环境变量处理

即使是假数据，也需要为某些API设置环境变量，确保构建过程不会因缺少配置而失败。这是因为某些服务可能在构建时尝试验证这些凭据，即使它们在静态站点中最终不会使用。

### import_map的重要性

在Deno项目中，正确配置import_map对解决模块导入问题至关重要。与Node.js不同，Deno要求更明确的模块导入路径。确保所有使用的模块都在import_map中正确映射。

### 静态资源管理

需要确保静态资源正确复制到构建目录，但不覆盖已生成的HTML文件。在构建脚本中，可以添加逻辑来区分处理不同类型的文件。

## 总结与建议

这个问题提醒我们在使用新框架时，要特别注意构建过程与开发环境的一致性，以及依赖管理的重要性。为了避免类似问题，建议：

1. **保持配置一致性**：确保开发和构建环境使用相同的配置和依赖版本
2. **理解构建流程**：了解框架的构建过程和输出结果
3. **定期清理构建目录**：在构建前删除旧的构建输出，避免文件混合
4. **检查静态资源**：确保所有CSS和其他资源都正确包含在构建输出中
5. **维护准确的import_map**：及时更新import_map，确保所有模块都能正确导入

通过这些措施，你可以确保FreshPress构建的静态网站在部署后与开发环境中表现一致，避免样式丢失等问题。 