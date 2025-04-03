import Layout from "../../components/Layout.tsx";
import Markdown from "../../components/Markdown.tsx";

interface Project {
  title: string;
  description: string;
  longDescription: string;
  image: string;
  technologies: string[];
  features: string[];
  githubUrl?: string;
  demoUrl?: string;
}

// 模拟项目数据
const projects: Record<string, Project> = {
  "personal-website": {
    title: "个人网站",
    description: "使用 Fresh 框架构建的现代化个人网站",
    longDescription: `
这是一个使用 Deno 的 Fresh 框架构建的个人网站。网站包含博客系统和项目展示功能，
采用了现代化的设计和技术栈。

## 主要特点

- 响应式设计，适配各种设备
- 博客系统支持 Markdown
- 项目展示页面
- 现代化的 UI 设计
- 高性能的静态生成

## 技术实现

网站使用 Fresh 框架构建，这是一个基于 Deno 的现代化 Web 框架。它提供了许多强大的功能，
如文件系统路由、岛屿架构和内置的 TailwindCSS 支持。
    `,
    image: "/images/projects/personal-website.png",
    technologies: ["Deno", "Fresh", "TypeScript", "TailwindCSS"],
    features: [
      "响应式设计",
      "博客系统",
      "项目展示",
      "现代化 UI",
      "高性能",
    ],
    githubUrl: "https://github.com/SisyphusZheng/personal-website",
    demoUrl: "https://z-js.dev",
  },
  "online-code-editor": {
    title: "在线代码编辑器",
    description: "基于 Monaco Editor 的在线代码编辑器",
    longDescription: `
这是一个基于 Monaco Editor 的在线代码编辑器，支持多种编程语言和主题。
编辑器提供了代码高亮、自动补全、错误提示等功能。

## 主要特点

- 支持多种编程语言
- 代码高亮和自动补全
- 多主题支持
- 实时错误提示
- 代码格式化

## 技术实现

编辑器使用 Monaco Editor 作为核心，这是一个由 VS Code 团队开发的代码编辑器。
前端使用 React 和 TypeScript 构建，提供了良好的开发体验。
    `,
    image: "/images/projects/code-editor.png",
    technologies: ["React", "TypeScript", "Monaco Editor"],
    features: [
      "多语言支持",
      "代码高亮",
      "自动补全",
      "多主题",
      "错误提示",
    ],
    githubUrl: "https://github.com/SisyphusZheng/online-code-editor",
  },
};

export default function ProjectDetail({ params }: { params: { slug: string } }) {
  const project = projects[params.slug];

  if (!project) {
    return (
      <Layout>
        <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 class="text-4xl font-bold mb-8">项目未找到</h1>
          <p class="text-gray-600">抱歉，您访问的项目不存在。</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="bg-white rounded-lg shadow-md overflow-hidden">
          <div class="md:flex">
            <div class="md:flex-shrink-0">
              <img
                class="h-48 w-full md:w-96 object-cover"
                src={project.image}
                alt={project.title}
              />
            </div>
            <div class="p-6">
              <h1 class="text-3xl font-bold mb-4">{project.title}</h1>
              <p class="text-gray-600 mb-6">{project.description}</p>
              
              <div class="flex flex-wrap gap-2 mb-6">
                {project.technologies.map((tech) => (
                  <span class="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                    {tech}
                  </span>
                ))}
              </div>
              
              <div class="flex space-x-4 mb-6">
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800 transition-colors"
                  >
                    <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                    </svg>
                    查看源码
                  </a>
                )}
                {project.demoUrl && (
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                  >
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    在线演示
                  </a>
                )}
              </div>
            </div>
          </div>
          
          <div class="p-6 border-t border-gray-200">
            <h2 class="text-2xl font-bold mb-4">项目特点</h2>
            <ul class="list-disc list-inside mb-6">
              {project.features.map((feature) => (
                <li class="text-gray-600 mb-2">{feature}</li>
              ))}
            </ul>
            
            <h2 class="text-2xl font-bold mb-4">项目详情</h2>
            <Markdown content={project.longDescription} />
          </div>
        </div>
      </div>
    </Layout>
  );
} 