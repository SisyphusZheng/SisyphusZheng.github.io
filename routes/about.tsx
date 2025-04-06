import Layout from "../components/Layout.tsx";
import { t } from "../utils/i18n.ts";
import { siteConfig } from "../data/config.ts";

export default function About() {
  return (
    <Layout title={t("nav.about")}>
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="bg-white shadow-lg rounded-lg overflow-hidden">
          <div class="p-6">
            <div class="flex items-center justify-center mb-6">
              <span class="text-4xl mr-3">🍋</span>
              <h1 class="text-3xl font-bold">FreshPress</h1>
            </div>

            <div class="text-center mb-8">
              <p class="text-xl text-gray-600 mb-4">
                {siteConfig.site.description}
              </p>
              <div class="flex justify-center space-x-4">
                <a
                  href={siteConfig.social.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                  </svg>
                </a>
                <a
                  href={siteConfig.social.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.03 10.03 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.937 4.937 0 004.604 3.417 9.868 9.868 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.9 13.9 0 007.548 2.209c9.054 0 14-7.497 14-13.986 0-.21 0-.42-.015-.63a9.936 9.936 0 002.46-2.548l-.047-.02z" />
                  </svg>
                </a>
                <a
                  href={siteConfig.social.discord}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.317 4.492c-1.53-.69-3.17-1.2-4.885-1.49-1.714-.29-3.48-.39-5.272-.39s-3.558.1-5.272.3c-1.715.2-3.355.8-4.885 1.49C.003 10.092 0 15.512 0 15.512s.003 5.42 0 11.02c1.53.69 3.17 1.2 4.885 1.49 1.714.29 3.48.39 5.272.39s3.558-.1 5.272-.3c1.715-.29 3.355-.8 4.885-1.49C24 20.932 24 15.512 24 15.512s-.003-5.42 0-11.02zm-3.2 5.65l-2.075 1.235-1.342-2.32-1.342 2.32-2.075-1.235 1.342 2.32-2.684.025h3.374l-1.342 2.322 2.075-1.235 1.342 2.32 1.342-2.32 2.075 1.235-1.342-2.32 3.374-.028h-3.374l1.342-2.32z" />
                  </svg>
                </a>
              </div>
            </div>

            <div class="mb-8">
              <h2 class="text-2xl font-bold mb-4">关于 FreshPress</h2>
              <p class="text-gray-700 mb-4">
                FreshPress 是一个基于 Fresh
                框架的现代静态站点生成器（SSG），专为个人博客和作品集设计。它结合了
                Fresh
                框架的强大功能和现代前端开发的最佳实践，使创建高性能、SEO友好的静态网站变得简单高效。
              </p>
              <p class="text-gray-700 mb-4">
                我们的目标是为开发者提供一个现代化、高效的静态站点生成解决方案。无论你是想创建个人博客、作品集还是项目文档，FreshPress
                都能满足你的需求。
              </p>
            </div>

            <div class="mb-8">
              <h2 class="text-2xl font-bold mb-4">核心技术</h2>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                {siteConfig.skills.items.map((skill) => (
                  <div class="bg-gray-50 p-4 rounded-lg text-center">
                    <div class="text-2xl mb-2">{skill.icon}</div>
                    <div class="font-medium">{skill.name}</div>
                  </div>
                ))}
              </div>
            </div>

            <div class="mb-8">
              <h2 class="text-2xl font-bold mb-4">主要功能</h2>
              <div class="space-y-4">
                <div class="bg-gray-50 p-4 rounded-lg">
                  <h3 class="font-bold text-blue-600">多语言支持</h3>
                  <p class="text-gray-700">
                    内置中英文国际化支持，轻松添加更多语言，让你的网站面向全球受众。
                  </p>
                </div>
                <div class="bg-gray-50 p-4 rounded-lg">
                  <h3 class="font-bold text-blue-600">智能搜索</h3>
                  <p class="text-gray-700">
                    全文搜索功能支持多语言内容检索，让用户快速找到所需信息。
                  </p>
                </div>
                <div class="bg-gray-50 p-4 rounded-lg">
                  <h3 class="font-bold text-blue-600">响应式设计</h3>
                  <p class="text-gray-700">
                    基于 TailwindCSS
                    构建的响应式设计，确保你的网站在任何设备上都能完美展示。
                  </p>
                </div>
                <div class="bg-gray-50 p-4 rounded-lg">
                  <h3 class="font-bold text-blue-600">Markdown 支持</h3>
                  <p class="text-gray-700">
                    使用 Markdown
                    轻松撰写博客文章和项目描述，专注于内容创作而非格式设置。
                  </p>
                </div>
                <div class="bg-gray-50 p-4 rounded-lg">
                  <h3 class="font-bold text-blue-600">Islands 架构</h3>
                  <p class="text-gray-700">
                    只在需要交互的组件上使用客户端
                    JavaScript，大幅提升页面加载速度和性能。
                  </p>
                </div>
              </div>
            </div>

            <div class="mb-8">
              <h2 class="text-2xl font-bold mb-4">团队成员</h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="bg-gray-50 p-4 rounded-lg flex items-center">
                  <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-2xl font-bold mr-4">
                    FP
                  </div>
                  <div>
                    <h3 class="font-bold text-lg">FreshPress 团队</h3>
                    <p class="text-gray-600">项目创始人</p>
                  </div>
                </div>
                <div class="bg-gray-50 p-4 rounded-lg flex items-center">
                  <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-2xl font-bold mr-4">
                    🦕
                  </div>
                  <div>
                    <h3 class="font-bold text-lg">Deno 社区</h3>
                    <p class="text-gray-600">技术支持</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="text-center">
              <a
                href={siteConfig.social.github}
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                <svg
                  class="w-5 h-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                </svg>
                访问 GitHub 仓库
              </a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
