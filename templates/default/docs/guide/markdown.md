# Markdown 使用指南

FreshPress 使用 Markdown 作为内容创作的主要格式。Markdown 是一种轻量级标记语言，允许您使用纯文本格式编写文档，然后转换为结构良好的 HTML。

## 基本语法

### 标题

使用 `#` 符号创建标题，符号数量表示标题级别：

```markdown
# 一级标题
## 二级标题
### 三级标题
#### 四级标题
##### 五级标题
###### 六级标题
```

### 强调

```markdown
*斜体* 或 _斜体_
**粗体** 或 __粗体__
**_粗斜体_** 或 ***粗斜体***
~~删除线~~
```

### 列表

无序列表：

```markdown
- 项目 1
- 项目 2
  - 子项目 1
  - 子项目 2
```

有序列表：

```markdown
1. 第一项
2. 第二项
   1. 子项目 1
   2. 子项目 2
```

### 链接

```markdown
[链接文本](https://example.com)
[带标题的链接](https://example.com "链接标题")
```

### 图片

```markdown
![替代文本](/path/to/image.jpg)
![替代文本](/path/to/image.jpg "图片标题")
```

### 代码

行内代码：

```markdown
`code`
```

代码块：

````markdown
```javascript
function hello() {
  console.log("Hello, world!");
}
```
````

### 引用

```markdown
> 这是一个引用
> 
> 引用可以包含多个段落
```

### 水平线

```markdown
---
```

## 扩展语法

FreshPress 支持一些扩展的 Markdown 语法：

### 表格

```markdown
| 表头 1 | 表头 2 | 表头 3 |
|--------|--------|--------|
| 单元格 1 | 单元格 2 | 单元格 3 |
| 单元格 4 | 单元格 5 | 单元格 6 |
```

### 任务列表

```markdown
- [x] 已完成任务
- [ ] 未完成任务
- [ ] 另一个未完成任务
```

### 代码高亮

FreshPress 支持代码块语法高亮：

````markdown
```typescript
interface Person {
  name: string;
  age: number;
}

const person: Person = {
  name: "张三",
  age: 30
};
```
````

### 数学公式

FreshPress 支持 KaTeX 数学公式：

```markdown
行内公式: $E = mc^2$

块级公式:
$$
\frac{d}{dx}e^x = e^x
$$
```

### Front Matter

您可以在 Markdown 文件的顶部添加 YAML Front Matter 来定义元数据：

```markdown
---
title: 页面标题
description: 页面描述
date: 2024-04-10
tags: [markdown, tutorial]
---

# 实际内容从这里开始
```

## 文件组织

在 FreshPress 中，Markdown 文件应该放在 `docs` 目录下：

```
docs/
├── index.md          # 首页
├── guide/            # 指南目录
│   ├── markdown.md   # Markdown 指南
│   └── ...
├── api/              # API 文档目录
│   └── ...
└── blog/             # 博客文章目录
    └── ...
```

## 特殊页面

某些页面有特殊用途：

- `docs/index.md`: 网站首页
- `docs/404.md`: 自定义 404 页面

## 自定义组件

FreshPress 允许在 Markdown 中使用自定义组件：

```markdown
<Alert type="info">
  这是一个信息提示框。
</Alert>

<Tabs>
  <Tab label="TypeScript">
    ```typescript
    const greeting: string = "Hello";
    ```
  </Tab>
  <Tab label="JavaScript">
    ```javascript
    const greeting = "Hello";
    ```
  </Tab>
</Tabs>
```

要了解更多关于 Markdown 和 FreshPress 内容管理的信息，请参考 [FreshPress 文档](https://freshpress.dev)。 