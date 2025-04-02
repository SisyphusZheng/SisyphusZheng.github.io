// components/Projects.tsx
export default function Projects() {
  const projects = [
    {
      title: "组件库",
      description:
        "基于 StencilJS与 TailwindCSS 构建的现代化 Web Components 组件库，采用 Figma 进行UI/UX 设计，实现设计系统与组件开发的高度统一。通过 GitHub Actions 配置 CI/CD 自动化部署流程，集成 Jest 进行单元测试与组件快照测试。项目收录于 Stencil Community 官方生态，为开发者提供开箱即用的高质量 Web Components 解决方案。",
      link: "https://air.js.org",
      image: "/images/project-1.webp",
      tags: [
        "StencilJS",
        "TailwindCSS",
        "Web Components",
        "Figma",
        "GitHub Actions",
        "Jest",
      ],
      highlights: [
        "收录在Stencil Community",
        "CI/CD自动化部署",
        "组件快照测试",
      ],
    },
    {
      title: "实时聊天应用",
      description:
        "基于 MERN 技术栈开发的即时通讯系统，集成 GitHub OAuth 2.0 认证实现安全登录，采用 Socket.io 构建实时消息传输功能。实现亮/暗双主题切换、在线用户状态实时显示等核心功能，前端使用 Vite + daisyUI + Tailwind CSS 构建响应式界面，后端通过 JWT 进行身份验证，并部署于 Nginx 服务器。项目涵盖全栈开发全流程，包括环境变量配置、生产环境部署及性能优化。",
      link: "https://cchat.chat",
      image: "/images/project-2.webp",
      tags: [
        "React",
        "Socket.io",
        "MongoDB",
        "Express",
        "JWT",
        "OAuth",
        "TailwindCSS",
      ],
      highlights: ["实时消息传输", "双主题切换", "全栈开发"],
    },
  ];

  return (
    <section id="projects" className="py-20 bg-gray-100 dark:bg-gray-800/50">
      <div className="container mx-auto px-4 md:px-8">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-8 flex items-center gsap-section-title">
          <span className="w-8 h-8 rounded-lg bg-indigo-600 dark:bg-indigo-500 flex items-center justify-center text-white mr-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3.293 1.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L7.586 10 5.293 7.707a1 1 0 010-1.414zM11 12a1 1 0 100 2h3a1 1 0 100-2h-3z"
                clipRule="evenodd"
              />
            </svg>
          </span>
          我的项目
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <div
              key={index}
              className="gsap-project-card bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-all hover:shadow-xl"
            >
              <div className="h-52 bg-gray-200 dark:bg-gray-700 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/90 to-purple-600/90 flex items-center justify-center">
                  <h3 className="text-2xl font-bold text-white">
                    {project.title}
                  </h3>
                </div>
              </div>
              <div className="p-6">
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.slice(0, 5).map((tag, i) => (
                    <span
                      key={i}
                      className="text-xs px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-4">
                  {project.description}
                </p>
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                    亮点：
                  </h4>
                  <ul className="space-y-1">
                    {project.highlights.map((highlight, i) => (
                      <li key={i} className="flex items-start">
                        <svg
                          className="w-4 h-4 text-green-500 mt-1 mr-2"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                        <span className="text-gray-600 dark:text-gray-300 text-sm">
                          {highlight}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex justify-end">
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium flex items-center transition-colors"
                  >
                    访问项目
                    <svg
                      className="w-4 h-4 ml-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
