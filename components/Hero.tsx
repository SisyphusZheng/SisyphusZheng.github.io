import { t, currentLocale, type Locale } from "../utils/i18n.ts";

export default function Hero({ locale }: { locale?: Locale }) {
  // 使用传入的locale或当前locale
  const effectiveLocale = locale || currentLocale.value;

  return (
    <section class="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-20 overflow-hidden">
      {/* 背景动画效果 */}
      <div class="absolute inset-0 overflow-hidden">
        <div class="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent animate-pulse"></div>
        <div
          class="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-500/10 via-transparent to-transparent animate-pulse"
          style="animation-delay: 1s;"
        ></div>
      </div>

      {/* 内容 */}
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="text-center">
          <h1 class="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
            <span class="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              {t("hero.title", effectiveLocale)}
            </span>
          </h1>
          <p class="text-xl md:text-2xl text-gray-300 mb-8 animate-fade-in-up">
            {t("hero.subtitle", effectiveLocale)}
          </p>
          <div
            class="flex justify-center space-x-4 animate-fade-in-up"
            style="animation-delay: 0.2s;"
          >
            <a
              href="/blog"
              class="group relative px-6 py-3 font-medium text-white transition-all duration-300 ease-out hover:scale-105"
            >
              <span class="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg transition-all duration-300 group-hover:from-blue-500 group-hover:to-blue-600"></span>
              <span class="relative flex items-center">
                {t("hero.blog", effectiveLocale)}
                <svg
                  class="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 5l7 7-7 7"
                  ></path>
                </svg>
              </span>
            </a>
            <a
              href="/projects"
              class="group relative px-6 py-3 font-medium text-white transition-all duration-300 ease-out hover:scale-105"
            >
              <span class="absolute inset-0 w-full h-full bg-gradient-to-r from-gray-700 to-gray-800 rounded-lg transition-all duration-300 group-hover:from-gray-600 group-hover:to-gray-700"></span>
              <span class="relative flex items-center">
                {t("hero.projects", effectiveLocale)}
                <svg
                  class="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 5l7 7-7 7"
                  ></path>
                </svg>
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
