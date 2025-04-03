 # FreshPress

基于 Fresh 框架的现代化静态站点生成器，专为个人博客和作品集设计。

## ✨ 特性

- 🚀 基于 Fresh 框架，支持静态站点生成（SSG）
- 🎨 使用 TailwindCSS 构建现代化 UI
- 🌐 内置国际化支持
- 🔍 全文搜索功能
- 📱 响应式设计
- 🎯 Islands 架构，支持客户端交互
- 📝 Markdown 支持
- 🚀 一键部署到 Deno Deploy

## 🚀 快速开始

### 前置要求

- [Deno](https://deno.land/) 1.40.0 或更高版本
- [Git](https://git-scm.com/)

### 安装

```bash
# 克隆仓库
git clone https://github.com/SisyphusZheng/freshpress.git
cd freshpress

# 安装依赖
deno task setup
```

### 开发

```bash
# 启动开发服务器
deno task start

# 构建静态文件
deno task build

# 预览构建结果
deno task preview
```

### 部署

1. 将代码推送到 GitHub
2. 访问 [Deno Deploy](https://dash.deno.com/)
3. 创建新项目并选择你的仓库
4. 配置部署选项：
   - Entrypoint: `main.ts`
   - Production Branch: `main`
   - Build Command: `deno task build`
   - Output Directory: `dist`

## 📁 项目结构

```
freshpress/
├── components/     # 可复用组件
├── islands/       # 客户端交互组件
├── routes/        # 页面路由
├── static/        # 静态资源
├── utils/         # 工具函数
├── blog/          # 博客文章
├── data/          # 数据文件
├── main.ts        # 入口文件
├── dev.ts         # 开发服务器
├── fresh.config.ts # Fresh 配置
├── deno.json      # Deno 配置
└── tailwind.config.ts # Tailwind 配置
```

## 🛠️ 配置

### 博客文章

在 `blog/` 目录下创建 Markdown 文件：

```markdown
---
title: 文章标题
date: 2024-03-21
tags: [标签1, 标签2]
---

文章内容...
```

### 国际化

在 `utils/i18n.ts` 中配置语言：

```typescript
export const messages = {
  "zh-CN": {
    // 中文翻译
  },
  "en": {
    // 英文翻译
  }
};
```

## 📝 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📞 联系方式

- GitHub: [@SisyphusZheng](https://github.com/SisyphusZheng)
- Email: sisyphuszheng@gmail.com