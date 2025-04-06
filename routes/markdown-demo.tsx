import Layout from "../components/Layout.tsx";
import Markdown from "../components/Markdown.tsx";
import { t } from "../utils/i18n.ts";

const DEMO_MARKDOWN = `
# FreshPress Markdown演示

这是一个用于展示 FreshPress 增强Markdown功能的页面。

## 基本语法

### 文本格式化

普通文本，**粗体文本**，*斜体文本*，~~删除线文本~~。

### 列表

无序列表:

- 项目 1
- 项目 2
  - 嵌套项目 2.1
  - 嵌套项目 2.2
- 项目 3

有序列表:

1. 第一项
2. 第二项
3. 第三项

### 引用

> 这是一个引用
> 可以跨多行
>
> 甚至可以包含多个段落

## 代码高亮

\`\`\`typescript
// TypeScript 代码示例
import { t } from "../utils/i18n.ts";

export function greeting(name: string): string {
  return \`Hello, \${name}!\`;
}

// 测试函数
console.log(greeting("FreshPress")); // 输出: Hello, FreshPress!
\`\`\`

\`\`\`css
/* CSS 示例 */
.markdown-container {
  max-width: 768px;
  margin: 0 auto;
  padding: 2rem;
}

.dark-mode .markdown-container {
  color: #f3f4f6;
  background-color: #1f2937;
}
\`\`\`

\`\`\`html
<!-- HTML 示例 -->
<div class="container">
  <h1>Hello FreshPress</h1>
  <p>This is a <strong>markdown</strong> demo.</p>
</div>
\`\`\`

## 表格

| 特性 | 描述 |
|------|------|
| 多语言支持 | 支持中文和英文界面 |
| 暗色模式 | 自动适应系统主题设置 |
| Markdown渲染 | 支持代码高亮和目录生成 |
| 静态生成 | 高性能的静态站点生成 |

## 链接和图片

[FreshPress GitHub](https://github.com/freshpress/freshpress)

![Fresh Logo](https://fresh.deno.dev/fresh-badge.svg)

## 任务列表

- [x] 创建基本项目结构
- [x] 实现多语言支持
- [x] 添加Markdown支持
- [x] 添加代码高亮
- [x] 实现暗色模式
- [ ] 完善文档
- [ ] 发布1.0版本

## 数学公式示例 (需额外支持)

行内公式: $E = mc^2$

块级公式:

$$
\\frac{\\partial f}{\\partial x} = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}
$$

## 图表示例 (需额外支持)

\`\`\`mermaid
graph TD;
    A[FreshPress] --> B[多语言支持];
    A --> C[暗色模式];
    A --> D[Markdown渲染];
    D --> E[代码高亮];
    D --> F[目录生成];
    A --> G[静态生成];
\`\`\`

感谢使用 FreshPress！
`;

export default function MarkdownDemo() {
  return (
    <Layout title="Markdown 演示">
      <div class="max-w-4xl mx-auto px-4 py-8">
        <h1 class="text-3xl font-bold mb-6">Markdown 渲染演示</h1>
        <p class="mb-8">
          这个页面展示了 FreshPress 的 Markdown
          渲染功能，包括目录生成和代码高亮等特性。
        </p>

        <Markdown
          content={DEMO_MARKDOWN}
          enableToc={true}
          enableHighlight={true}
        />
      </div>
    </Layout>
  );
}
