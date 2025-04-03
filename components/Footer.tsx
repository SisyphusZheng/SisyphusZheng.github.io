import { Head } from "$fresh/runtime.ts";

export default function Footer() {
  return (
    <footer class="bg-gray-900 text-white">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 关于我 */}
          <div>
            <h3 class="text-xl font-bold mb-4">关于我</h3>
            <p class="text-gray-400">
              热爱编程，专注于前端开发，致力于创造优秀的用户体验。
            </p>
          </div>

          {/* 快速链接 */}
          <div>
            <h3 class="text-xl font-bold mb-4">快速链接</h3>
            <ul class="space-y-2">
              <li>
                <a href="/" class="text-gray-400 hover:text-white transition-colors">
                  首页
                </a>
              </li>
              <li>
                <a href="/blog" class="text-gray-400 hover:text-white transition-colors">
                  博客
                </a>
              </li>
              <li>
                <a href="/projects" class="text-gray-400 hover:text-white transition-colors">
                  项目
                </a>
              </li>
            </ul>
          </div>

          {/* 联系方式 */}
          <div>
            <h3 class="text-xl font-bold mb-4">联系方式</h3>
            <ul class="space-y-2">
              <li class="flex items-center">
                <svg class="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href="mailto:zhizheng@z-js.dev" class="text-gray-400 hover:text-white transition-colors">
                  zhizheng@z-js.dev
                </a>
              </li>
              <li class="flex items-center">
                <svg class="w-5 h-5 text-gray-400 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                </svg>
                <a href="https://github.com/SisyphusZheng" target="_blank" rel="noopener noreferrer" class="text-gray-400 hover:text-white transition-colors">
                  GitHub
                </a>
              </li>
              <li class="flex items-center">
                <svg class="w-5 h-5 text-gray-400 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-.88-.06-1.601-1.12-1.601-1.16 0-1.35.91-1.35 1.66v5.545h-3v-11h3v1.765c.77-1.333 2.11-1.891 3.5-1.891 1.99 0 3.5 1.3 3.5 3.615v6.511z" />
                </svg>
                <a href="https://linkedin.com/in/SisyphusZheng" target="_blank" rel="noopener noreferrer" class="text-gray-400 hover:text-white transition-colors">
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* 版权信息 */}
        <div class="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} 郑治. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
} 