/**
 * 文档站点布局组件
 */
import { JSX } from "preact";
import { Head } from "$fresh/runtime.ts";

interface DocsLayoutProps {
  children: JSX.Element | JSX.Element[];
  title?: string;
  description?: string;
  config: any;
}

export default function DocsLayout({
  children,
  title,
  description,
  config,
}: DocsLayoutProps) {
  const siteTitle = title ? `${title} | ${config.title}` : config.title;

  const siteDescription = description || config.description;

  // 从配置中获取导航和侧边栏
  const nav = config.themeConfig?.nav || [];
  const sidebar = config.themeConfig?.sidebar || {};

  // 当前路径（简化处理）
  const currentPath = "/";

  // 获取当前路径的侧边栏
  let currentSidebar: any[] = [];

  // 找到最匹配的侧边栏
  let bestMatch = "";
  for (const path in sidebar) {
    if (currentPath.startsWith(path) && path.length > bestMatch.length) {
      bestMatch = path;
      currentSidebar = sidebar[path];
    }
  }

  return (
    <>
      <Head>
        <title>{siteTitle}</title>
        <meta name="description" content={siteDescription} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="/public/docs.css" />
      </Head>

      <div class="flex flex-col min-h-screen">
        {/* 顶部导航 */}
        <header class="sticky top-0 z-40 w-full border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
          <div class="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            {/* 网站标题/Logo */}
            <div class="flex items-center">
              <a href="/" class="flex items-center gap-2">
                <span class="text-xl font-bold text-gray-900 dark:text-white">
                  {config.title}
                </span>
              </a>
            </div>

            {/* 导航菜单 */}
            <nav class="hidden md:flex space-x-8">
              {nav.map((item: any) => (
                <a
                  href={item.link}
                  class={`text-sm font-medium ${
                    currentPath.startsWith(item.link)
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                  }`}
                >
                  {item.text}
                </a>
              ))}
            </nav>

            {/* 移动端菜单按钮 */}
            <div class="flex md:hidden">
              <button
                type="button"
                class="text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
                aria-label="Toggle menu"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </header>

        <div class="container mx-auto flex-1 px-4 sm:px-6 lg:px-8">
          <div class="flex flex-col md:flex-row py-6">
            {/* 侧边栏 */}
            <aside class="hidden md:block w-64 shrink-0 pr-8">
              <nav class="sticky top-20">
                {currentSidebar.map((section: any) => (
                  <div class="mb-6">
                    <h3 class="font-semibold text-gray-900 dark:text-white mb-3">
                      {section.text}
                    </h3>
                    <ul class="space-y-2">
                      {section.items?.map((item: any) => (
                        <li>
                          <a
                            href={item.link}
                            class={`block text-sm ${
                              currentPath === item.link
                                ? "text-blue-600 dark:text-blue-400"
                                : "text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                            }`}
                          >
                            {item.text}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </nav>
            </aside>

            {/* 主要内容 */}
            <main class="flex-1 min-w-0">
              <div class="prose max-w-none dark:prose-invert">{children}</div>
            </main>
          </div>
        </div>

        {/* 页脚 */}
        <footer class="border-t border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
          <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div class="flex flex-col md:flex-row justify-between items-center">
              <div class="mb-4 md:mb-0">
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  © {new Date().getFullYear()} {config.title}. All rights
                  reserved.
                </p>
              </div>
              <div class="flex space-x-6">
                <a
                  href="https://github.com/freshpress/freshpress"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                >
                  <span class="sr-only">GitHub</span>
                  <svg
                    class="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
