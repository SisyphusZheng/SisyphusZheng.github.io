export interface BlogPost {
  title: string;
  date: string;
  content: string;
  tags: string[];
  slug: string;
}

export const posts: BlogPost[] = [
  {
    title: "使用 Fresh 框架构建个人网站",
    date: "2024-03-20",
    content: `# 使用 Fresh 框架构建个人网站

Fresh 是 Deno 的一个现代化 Web 框架，它提供了许多强大的功能，让我们可以快速构建高性能的网站。

## 为什么选择 Fresh？

1. **零配置**：开箱即用，无需复杂的配置
2. **TypeScript 支持**：完整的类型支持
3. **岛屿架构**：部分水合，提高性能
4. **内置路由**：文件系统路由
5. **TailwindCSS 集成**：轻松构建美观的 UI

## 开始使用

首先，我们需要安装 Deno：

\`\`\`bash
curl -fsSL https://deno.land/x/install/install.sh | sh
\`\`\`

然后创建新的 Fresh 项目：

\`\`\`bash
deno run -A -r https://fresh.deno.dev my-website
\`\`\`

## 项目结构

Fresh 项目的基本结构如下：

- \`routes/\`: 页面路由
- \`components/\`: 可复用组件
- \`islands/\`: 交互式组件
- \`static/\`: 静态资源

## 总结

Fresh 是一个强大的框架，特别适合构建个人网站。它的简单性和性能使其成为一个很好的选择。`,
    tags: ["Deno", "Fresh", "Web Development"],
    slug: "building-personal-website-with-fresh",
  },
  {
    title: "TypeScript 类型系统进阶",
    date: "2024-03-15",
    content: `# TypeScript 类型系统进阶

TypeScript 的类型系统是其最强大的特性之一。让我们深入探讨一些高级类型特性。

## 泛型

泛型允许我们创建可重用的组件：

\`\`\`typescript
function identity<T>(arg: T): T {
  return arg;
}
\`\`\`

## 条件类型

条件类型让我们可以根据其他类型来定义类型：

\`\`\`typescript
type NonNullable<T> = T extends null | undefined ? never : T;
\`\`\`

## 类型推断

TypeScript 可以自动推断类型：

\`\`\`typescript
const numbers = [1, 2, 3]; // 推断为 number[]
\`\`\`

## 总结

掌握这些高级类型特性可以让我们写出更类型安全的代码。`,
    tags: ["TypeScript", "Programming"],
    slug: "typescript-type-system-advanced",
  },
  {
    title: "使用 TailwindCSS 构建现代化 UI",
    date: "2024-03-10",
    content: `# 使用 TailwindCSS 构建现代化 UI

TailwindCSS 是一个功能类优先的 CSS 框架，它让我们可以快速构建现代化的用户界面。

## 为什么选择 TailwindCSS？

1. **实用优先**：直接使用类名构建 UI
2. **响应式设计**：内置响应式工具类
3. **自定义主题**：轻松定制设计系统
4. **性能优化**：只生成使用的 CSS
5. **开发体验**：快速迭代和原型设计

## 开始使用

安装 TailwindCSS：

\`\`\`bash
npm install -D tailwindcss
npx tailwindcss init
\`\`\`

配置 TailwindCSS：

\`\`\`javascript
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
}
\`\`\`

## 实用技巧

1. 使用 @apply 提取重复的样式
2. 使用 JIT 模式提高开发效率
3. 使用插件扩展功能
4. 使用自定义配置统一设计系统

## 总结

TailwindCSS 是一个强大的工具，可以大大提高我们的开发效率。`,
    tags: ["CSS", "TailwindCSS", "Web Development"],
    slug: "building-modern-ui-with-tailwindcss",
  },
]; 