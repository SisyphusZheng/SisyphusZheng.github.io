import { h } from "preact";
import { I18nPlugin, t, type Locale } from "../plugins/i18n/mod.ts";
import { getContent } from "../docs/content.ts";

// 创建i18n插件实例
const i18nPlugin = new I18nPlugin();

const Footer = ({ locale = "en-US" }: { locale?: Locale }) => {
  const copyright = `© ${new Date().getFullYear()} FreshPress`;
  const githubLink = getContent(["quickStart", "cta", "link"]);

  // 使用导入的翻译函数
  // const t = (key: string) => translateFunc(key, {}, locale);

  return (
    <footer class="relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-indigo-950 border-t border-gray-100 dark:border-gray-800 transition-colors theme-transition">
      {/* 背景装饰元素 - 更现代的风格 */}
      <div class="absolute inset-0 overflow-hidden opacity-30 dark:opacity-15 pointer-events-none">
        <div class="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-indigo-200 dark:bg-indigo-900 mix-blend-multiply dark:mix-blend-soft-light animate-pulse"></div>
        <div
          class="absolute -left-20 top-40 w-60 h-60 rounded-full bg-indigo-100 dark:bg-indigo-800 mix-blend-multiply dark:mix-blend-soft-light"
          style="animation: float 8s ease-in-out infinite;"
        ></div>
        <div
          class="absolute right-40 bottom-20 w-40 h-40 rounded-full bg-cyan-100 dark:bg-cyan-900 mix-blend-multiply dark:mix-blend-soft-light"
          style="animation: float 6s ease-in-out infinite 1s;"
        ></div>
      </div>

      <div class="container-custom mx-auto px-6 py-16 sm:px-8 lg:px-8 relative z-10">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* 品牌信息列 */}
          <div
            class="col-span-1 md:col-span-1 animated-element"
            style="animation-delay: 100ms;"
          >
            <div class="flex items-center mb-6">
              <img src="/lemon.svg" alt="柠檬" class="h-8 w-auto mr-3" />
              <span class="font-bold text-xl gradient-text">FreshPress</span>
            </div>
            <p class="paragraph mb-6 leading-relaxed">
              {locale === "zh-CN"
                ? "FreshPress是一个现代的网站生成器，让创建个人主页、博客或项目文档变得简单。"
                : "FreshPress is a modern website generator that makes it simple to create personal websites, blogs, or project documentation."}
            </p>
            <div class="flex space-x-5">
              <a
                href="https://github.com/denoland/fresh"
                target="_blank"
                rel="noopener noreferrer"
                class="text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors hover-lift p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                aria-label="GitHub"
              >
                <svg
                  class="h-5 w-5"
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
              <a
                href="https://twitter.com/deno_land"
                target="_blank"
                rel="noopener noreferrer"
                class="text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors hover-lift p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                aria-label="Twitter"
              >
                <svg
                  class="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
            </div>
          </div>

          {/* 链接列 */}
          <div
            class="col-span-1 md:col-span-1 animated-element"
            style="animation-delay: 200ms;"
          >
            <h3 class="heading-md text-lg font-bold mb-5 text-indigo-600 dark:text-indigo-400">
              {t("footer.links", {}, locale)}
            </h3>
            <ul class="space-y-4">
              <li>
                <a
                  href="/"
                  class="nav-link text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium flex items-center group"
                >
                  <div class="w-2 h-2 rounded-full bg-indigo-200 dark:bg-indigo-800 mr-3 transition-all duration-300 group-hover:bg-indigo-500 dark:group-hover:bg-indigo-400"></div>
                  {t("nav.home", {}, locale)}
                </a>
              </li>
              <li>
                <a
                  href="/blog"
                  class="nav-link text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium flex items-center group"
                >
                  <div class="w-2 h-2 rounded-full bg-indigo-200 dark:bg-indigo-800 mr-3 transition-all duration-300 group-hover:bg-indigo-500 dark:group-hover:bg-indigo-400"></div>
                  {t("nav.blog", {}, locale)}
                </a>
              </li>
              <li>
                <a
                  href="/projects"
                  class="nav-link text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium flex items-center group"
                >
                  <div class="w-2 h-2 rounded-full bg-indigo-200 dark:bg-indigo-800 mr-3 transition-all duration-300 group-hover:bg-indigo-500 dark:group-hover:bg-indigo-400"></div>
                  {t("nav.projects", {}, locale)}
                </a>
              </li>
              <li>
                <a
                  href="/about"
                  class="nav-link text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium flex items-center group"
                >
                  <div class="w-2 h-2 rounded-full bg-indigo-200 dark:bg-indigo-800 mr-3 transition-all duration-300 group-hover:bg-indigo-500 dark:group-hover:bg-indigo-400"></div>
                  {t("nav.about", {}, locale)}
                </a>
              </li>
            </ul>
          </div>

          {/* 资源列 */}
          <div
            class="col-span-1 md:col-span-1 animated-element"
            style="animation-delay: 300ms;"
          >
            <h3 class="heading-md text-lg font-bold mb-5 text-indigo-600 dark:text-indigo-400">
              {t("footer.resources", {}, locale)}
            </h3>
            <ul class="space-y-4">
              <li>
                <a
                  href="https://fresh.deno.dev/docs/introduction"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="nav-link text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium flex items-center group"
                >
                  <div class="w-2 h-2 rounded-full bg-indigo-200 dark:bg-indigo-800 mr-3 transition-all duration-300 group-hover:bg-indigo-500 dark:group-hover:bg-indigo-400"></div>
                  {locale === "zh-CN" ? "Fresh 文档" : "Fresh Docs"}
                </a>
              </li>
              <li>
                <a
                  href="https://deno.land/manual"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="nav-link text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium flex items-center group"
                >
                  <div class="w-2 h-2 rounded-full bg-indigo-200 dark:bg-indigo-800 mr-3 transition-all duration-300 group-hover:bg-indigo-500 dark:group-hover:bg-indigo-400"></div>
                  {locale === "zh-CN" ? "Deno 手册" : "Deno Manual"}
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/denoland/fresh"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="nav-link text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium flex items-center group"
                >
                  <div class="w-2 h-2 rounded-full bg-indigo-200 dark:bg-indigo-800 mr-3 transition-all duration-300 group-hover:bg-indigo-500 dark:group-hover:bg-indigo-400"></div>
                  {locale === "zh-CN" ? "GitHub 仓库" : "GitHub Repo"}
                </a>
              </li>
            </ul>
          </div>

          {/* 订阅列 */}
          <div
            class="col-span-1 md:col-span-1 animated-element"
            style="animation-delay: 400ms;"
          >
            <h3 class="heading-md text-lg font-bold mb-5 text-indigo-600 dark:text-indigo-400">
              {t("footer.subscribe", {}, locale)}
            </h3>
            <p class="paragraph mb-5 leading-relaxed">
              {locale === "zh-CN"
                ? "订阅我们的通讯，获取最新的产品更新和公告。"
                : "Subscribe to our newsletter for the latest updates and announcements."}
            </p>
            <form class="flex flex-col space-y-3">
              <input
                type="email"
                placeholder={t("footer.emailPlaceholder", {}, locale)}
                class="px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
              />
              <button
                type="submit"
                class="btn-primary relative px-4 py-3 overflow-hidden bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 group"
              >
                <span class="relative z-10">
                  {t("footer.subscribeCTA", {}, locale)}
                </span>
                <div class="absolute inset-0 h-full w-full scale-0 rounded-lg transition-all duration-300 group-hover:scale-100 group-hover:bg-indigo-500/30"></div>
              </button>
            </form>
          </div>
        </div>

        {/* 页脚底部 */}
        <div class="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div class="flex flex-col md:flex-row justify-between items-center">
            <p class="text-gray-600 dark:text-gray-400 mb-4 md:mb-0">
              {copyright}{" "}
              {t("footer.copyright", {}, locale).replace(
                "{year}",
                new Date().getFullYear().toString()
              )}
            </p>

            <a
              href="https://fresh.deno.dev"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center px-3 py-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-600 text-white text-xs font-medium shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
            >
              <img
                src="/lemon.svg"
                alt="FreshPress Logo"
                class="h-4 w-4 mr-1.5"
              />
              <span>
                {locale === "zh-CN"
                  ? "基于 FreshPress 构建"
                  : "Built with FreshPress"}
              </span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
