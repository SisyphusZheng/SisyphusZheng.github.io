/** jsx h */
import { h } from "preact";
import { useState } from "preact/hooks";
import { currentLocale, t, type Locale } from "../utils/i18n.ts";
import Search from "./Search.tsx";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleSearch = () => {
    setShowSearch(!showSearch);
  };

  const toggleLocale = () => {
    currentLocale.value = currentLocale.value === "zh-CN" ? "en-US" : "zh-CN";
  };

  return (
    <nav class="bg-white shadow-lg">
      <div class="max-w-6xl mx-auto px-4">
        <div class="flex justify-between">
          <div class="flex space-x-7">
            <div>
              <a href="/" class="flex items-center py-4">
                <span class="font-semibold text-gray-500 text-lg">
                  {t("nav.home")}
                </span>
              </a>
            </div>
          </div>

          <div class="hidden md:flex items-center space-x-8">
            {/* 搜索按钮 */}
            <button
              onClick={toggleSearch}
              class="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* 导航链接 */}
            <a href="/blog" class="text-gray-500 hover:text-gray-700 transition-colors">
              {t("nav.blog")}
            </a>
            <a href="/projects" class="text-gray-500 hover:text-gray-700 transition-colors">
              {t("nav.projects")}
            </a>
            <a href="/resume" class="text-gray-500 hover:text-gray-700 transition-colors">
              {t("nav.resume")}
            </a>

            {/* 语言切换 */}
            <button
              onClick={toggleLocale}
              class="text-gray-500 hover:text-gray-700 transition-colors"
            >
              {currentLocale.value === "zh-CN" ? "EN" : "中"}
            </button>
          </div>

          {/* 移动端菜单按钮 */}
          <div class="md:hidden flex items-center">
            <button class="outline-none" onClick={toggleMenu}>
              <svg class="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isOpen ? (
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* 搜索组件 */}
        <div class={`${showSearch ? "block" : "hidden"} py-4`}>
          <Search />
        </div>

        {/* 移动端菜单 */}
        {showSearch && (
          <div class="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-start justify-center pt-20">
            <div class="w-full max-w-2xl mx-4">
              <div class="bg-white rounded-lg shadow-xl p-4">
                <div class="flex justify-between items-center mb-4">
                  <h2 class="text-xl font-semibold">{t("search.placeholder")}</h2>
                  <button
                    onClick={toggleSearch}
                    class="text-gray-500 hover:text-gray-700"
                  >
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <Search />
              </div>
            </div>
          </div>
        )}

        {/* 移动端菜单 */}
        <div class={`md:hidden ${isOpen ? "block" : "hidden"}`}>
          <div class="flex flex-col space-y-4 pb-4">
            <a href="/blog" class="text-gray-500 hover:text-gray-700 transition-colors">
              {t("nav.blog")}
            </a>
            <a href="/projects" class="text-gray-500 hover:text-gray-700 transition-colors">
              {t("nav.projects")}
            </a>
            <a href="/resume" class="text-gray-500 hover:text-gray-700 transition-colors">
              {t("nav.resume")}
            </a>
            <button
              onClick={toggleLocale}
              class="text-left text-gray-500 hover:text-gray-700 transition-colors"
            >
              {currentLocale.value === "zh-CN" ? "Switch to English" : "切换到中文"}
            </button>
            <button
              onClick={toggleSearch}
              class="text-left text-gray-500 hover:text-gray-700 transition-colors"
            >
              {t("search.placeholder")}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
} 