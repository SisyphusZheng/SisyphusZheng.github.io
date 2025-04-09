---
title: FreshPress 国际化(i18n)完全指南
slug: i18n-guide
date: 2024-04-16
author: FreshPress 团队
excerpt: 学习如何使用 FreshPress 的国际化功能创建多语言静态网站，包含完整的配置和使用教程。
cover: /static/favicon.svg
tags:
  - 教程
  - 国际化
  - i18n
  - 多语言
---

# FreshPress 国际化(i18n)完全指南

FreshPress提供了简单易用的国际化(i18n)功能，让您能够轻松创建多语言网站。本指南将详细介绍如何设置和使用这些功能，帮助您构建适用于全球用户的网站。

## 快速入门

国际化对于面向不同语言用户的网站至关重要。FreshPress使这个过程变得简单：

1. 在项目根目录创建一个`translations`文件夹
2. 为每种语言创建一个JSON文件，例如`en-US.json`和`zh-CN.json`
3. 在组件中使用`t`函数来显示翻译文本

示例代码：

```jsx
import { t } from "../plugins/i18n/mod.ts";

export default function Header() {
  return (
    <header>
      <h1>{t("site.title")}</h1>
      <p>{t("site.description")}</p>
    </header>
  );
}
```

## 翻译文件结构

翻译文件是简单的JSON文件，使用嵌套对象来组织翻译内容：

```json
{
  "site": {
    "title": "My Website",
    "description": "A description of my website"
  },
  "nav": {
    "home": "Home",
    "about": "About"
  }
}
```

访问这些翻译使用点符号，如`t("site.title")`或`t("nav.home")`。这种结构使翻译内容组织有序，便于维护。

## 翻译文件位置

FreshPress会按以下顺序查找翻译文件：

1. 配置中指定的`translationsDir`目录（默认为`./translations`）
2. 项目根目录下的`translations`文件夹
3. `docs/translations`文件夹

系统会自动加载找到的所有`.json`翻译文件，无需额外配置。这种灵活性使您可以根据项目需求选择最合适的位置。

## 添加新语言

增加网站语言支持非常简单。只需在`translations`目录中添加新的语言文件，就会自动被检测并添加到可用语言列表中。例如，添加`fr-FR.json`文件会自动启用法语支持。

您可以根据需要添加任意数量的语言，FreshPress会自动处理加载和切换逻辑。

## 在组件中使用

### 基本用法

在React/Preact组件中使用翻译非常简单：

```jsx
import { t } from "../plugins/i18n/mod.ts";

// 简单翻译
<p>{t("common.hello")}</p>

// 带参数的翻译
<p>{t("common.welcome", { name: "John" })}</p>
```

参数替换让您的翻译更加灵活，特别是对于需要插入动态内容的句子。

### 切换语言

FreshPress提供了一个内置的语言切换功能：

```jsx
import { toggleLocale, currentLocale } from "../plugins/i18n/mod.ts";

// 显示当前语言
<span>{currentLocale.value}</span>

// 切换语言按钮
<button onClick={toggleLocale}>
  {currentLocale.value === "en-US" ? "中文" : "English"}
</button>
```

使用`currentLocale.value`可以响应式地获取当前语言，并在语言切换时自动更新UI。

### 格式化日期和数字

根据用户语言格式化日期和数字也是国际化的重要部分：

```jsx
import { formatDate } from "../plugins/i18n/mod.ts";

// 根据当前语言格式化日期
<span>{formatDate(new Date(), { dateStyle: "full" })}</span>
```

这确保日期、数字和货币按照当地习惯显示，提升用户体验。

## 高级配置

如果需要更多控制，可以创建自己的i18n插件实例：

```ts
import { I18nPlugin } from "../plugins/i18n/mod.ts";

const myI18n = new I18nPlugin({
  defaultLocale: "fr-FR",
  locales: ["fr-FR", "en-US", "de-DE"],
  translationsDir: "./my-translations",
  fallback: true,
  fallbackLocale: "en-US"
});

await myI18n.activate();
```

自定义配置适用于有特殊需求的项目，如需要从非标准位置加载翻译或使用不同的语言切换策略。

## 最佳实践

根据我们的经验，以下是一些有效的i18n最佳实践：

1. **组织良好的键名结构** - 使用有层次的键名，如`section.subsection.element`
2. **功能性分割** - 对于大型项目，按功能区域分割翻译文件
3. **保持一致性** - 确保所有语言文件包含相同的键，避免缺失翻译
4. **使用参数** - 使用参数而不是字符串拼接，便于根据语言调整词序
5. **格式化函数** - 为日期、数字和货币使用格式化函数，适应不同地区的显示习惯

## 故障排除

如果翻译未正确显示，请检查以下几点：

1. 浏览器控制台中是否有相关错误
2. 翻译文件格式是否正确（有效的JSON）
3. 使用的键名是否与翻译文件中的键名完全匹配
4. 翻译文件是否被正确加载（查看控制台日志）

## 结语

通过FreshPress的i18n功能，您可以轻松创建多语言网站，触及全球受众。此系统设计简单直观，同时又足够灵活，可以满足各种复杂的国际化需求。

开始使用FreshPress的i18n功能，让您的网站说世界语言！ 