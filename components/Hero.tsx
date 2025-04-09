import { t, type Locale, i18nPlugin } from "../plugins/i18n/mod.ts";

export default function Hero({ locale }: { locale?: Locale }) {
  // 使用传入的locale或当前locale
  const effectiveLocale = locale || i18nPlugin.getLocale();

  return (
    <section class="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-16 md:py-20 overflow-hidden">
      {/* 背景动画效果 */}
      <div class="absolute inset-0 overflow-hidden">
        <div class="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent animate-pulse"></div>
        <div
          class="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-500/10 via-transparent to-transparent animate-pulse"
          style="animation-delay: 1s;"
        ></div>
      </div>

      {/* 内容 - 改为左右布局 */}
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="flex flex-col md:flex-row items-center">
          {/* 左侧文本内容 */}
          <div class="w-full md:w-3/5 mb-10 md:mb-0 md:pr-10">
            <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in text-left">
              <span class="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                {t("hero.title")}
              </span>
            </h1>
            <p class="text-xl md:text-2xl text-gray-300 mb-8 animate-fade-in-up text-left">
              {t("hero.subtitle")}
            </p>
            <div
              class="flex space-x-4 animate-fade-in-up justify-start"
              style="animation-delay: 0.2s;"
            >
              <a
                href="/blog"
                class="group relative px-6 py-3 font-medium text-white transition-all duration-300 ease-out hover:scale-105"
              >
                <span class="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg transition-all duration-300 group-hover:from-blue-500 group-hover:to-blue-600"></span>
                <span class="relative flex items-center">
                  {t("hero.blog")}
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
                  {t("hero.projects")}
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

          {/* 右侧头像区域 - 修改为圆形 */}
          <div class="w-full md:w-2/5 flex justify-center md:justify-end relative">
            <div class="relative group">
              {/* 主头像 - 圆形显示 */}
              <div class="w-48 h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 rounded-full overflow-hidden relative hover-lift bg-gradient-to-r from-blue-500 to-purple-600 p-1.5">
                <img
                  src="/home/user.png"
                  alt={t("hero.avatarAlt")}
                  class="w-full h-full object-cover rounded-full"
                  onError={(e) => {
                    // 头像加载失败时使用占位图
                    const target = e.target as HTMLImageElement;
                    target.src =
                      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 24 24' fill='none' stroke='%23818cf8' stroke-width='1' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='3' width='18' height='18' rx='2' ry='2'%3E%3C/rect%3E%3Ccircle cx='12' cy='10' r='3'%3E%3C/circle%3E%3Cpath d='M12 15c-2.67 0-8 1.34-8 4v3h16v-3c0-2.66-5.33-4-8-4z'%3E%3C/path%3E%3C/svg%3E";
                  }}
                />

                {/* 光效 */}
                <div class="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
              </div>

              {/* 右下角标签 - 更引人注目的样式 */}
              <div class="absolute -bottom-4 -right-4 bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-1.5 rounded-full shadow-lg transform transition-transform duration-300 group-hover:scale-110 animate-pulse-slow">
                <span class="text-xs font-bold text-white flex items-center">
                  <svg
                    class="w-4 h-4 mr-1.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M2 16.1A5 5 0 0 1 5.9 20M2 12.05A9 9 0 0 1 9.95 20M2 8V6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-6"></path>
                    <line x1="2" y1="20" x2="2.01" y2="20"></line>
                  </svg>
                  {t("hero.badgeText")}
                </span>
              </div>

              {/* 左上角新标签 */}
              <div class="absolute -top-3 -left-3 bg-gradient-to-r from-green-500 to-emerald-600 px-3 py-1.5 rounded-full shadow-lg transform rotate-12 transition-transform duration-300 group-hover:rotate-0">
                <span class="text-xs font-bold text-white">
                  {t("hero.newBadgeText")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
