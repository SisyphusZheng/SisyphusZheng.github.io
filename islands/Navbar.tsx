import { h } from "preact";
import { useState, useEffect } from "preact/hooks";
import {
  currentLocale,
  t,
  type Locale,
  toggleLocale as toggleLocaleGlobal,
} from "../utils/i18n.ts";
import Search from "./Search.tsx";
import ThemeToggle from "./ThemeToggle.tsx";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [locale, setLocale] = useState<Locale>("en-US");

  // Monitor language changes
  useEffect(() => {
    const updateLocale = () => {
      setLocale(currentLocale.value);
    };

    // 初始设置语言
    updateLocale();

    // 监听语言变化事件
    window.addEventListener("localeChange", updateLocale);

    return () => {
      window.removeEventListener("localeChange", updateLocale);
    };
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleSearch = () => {
    console.log("Toggle search", !showSearch);
    setShowSearch(!showSearch);
  };

  const toggleLocale = () => {
    console.log("切换语言");
    // 直接调用i18n.ts中的toggleLocale函数
    toggleLocaleGlobal();
  };

  // Close search when ESC is pressed
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && showSearch) {
        toggleSearch();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [showSearch]);

  return (
    <nav class="bg-white shadow-lg dark:bg-gray-800 transition-colors">
      <div class="max-w-6xl mx-auto px-4">
        <div class="flex justify-between">
          <div class="flex space-x-7">
            <div>
              <a href="/" class="flex items-center py-4">
                <img
                  src="/logo.svg"
                  alt="FreshPress Logo"
                  class="h-8 w-auto mr-2"
                />
                <span class="font-semibold text-gray-500 dark:text-gray-300 text-lg">
                  FreshPress
                </span>
              </a>
            </div>
          </div>

          <div class="hidden md:flex items-center space-x-6">
            {/* Search button */}
            <button
              onClick={toggleSearch}
              class="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white transition-colors"
              aria-label={t("search.placeholder")}
            >
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>

            {/* Navigation links */}
            <a
              href="/blog"
              class="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white transition-colors"
            >
              {t("nav.blog")}
            </a>
            <a
              href="/projects"
              class="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white transition-colors"
            >
              {t("nav.projects")}
            </a>
            <a
              href="/resume"
              class="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white transition-colors"
            >
              {t("nav.resume")}
            </a>

            {/* Theme toggle */}
            <ThemeToggle />

            {/* Language toggle */}
            <button
              onClick={toggleLocale}
              class="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white transition-colors"
            >
              {locale === "zh-CN" ? "EN" : "CN"}
            </button>
          </div>

          {/* Mobile menu button */}
          <div class="md:hidden flex items-center space-x-4">
            <a href="/" class="flex items-center">
              <img src="/logo.svg" alt="FreshPress Logo" class="h-6 w-auto" />
            </a>
            <ThemeToggle />
            <button class="outline-none" onClick={toggleMenu}>
              <svg
                class="w-6 h-6 text-gray-500 dark:text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isOpen ? (
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Search modal */}
        {showSearch && (
          <div class="fixed inset-0 z-50 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-start justify-center pt-20">
            <div class="w-full max-w-2xl mx-4">
              <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4">
                <div class="flex justify-between items-center mb-4">
                  <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    {t("search.placeholder")}
                  </h2>
                  <button
                    onClick={toggleSearch}
                    class="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                  >
                    <svg
                      class="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
                <Search />
              </div>
            </div>
          </div>
        )}

        {/* Mobile menu */}
        <div class={`md:hidden ${isOpen ? "block" : "hidden"}`}>
          <div class="flex flex-col space-y-4 pb-4">
            <a
              href="/blog"
              class="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white transition-colors"
            >
              {t("nav.blog")}
            </a>
            <a
              href="/projects"
              class="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white transition-colors"
            >
              {t("nav.projects")}
            </a>
            <a
              href="/resume"
              class="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white transition-colors"
            >
              {t("nav.resume")}
            </a>
            <button
              onClick={toggleSearch}
              class="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white transition-colors text-left"
            >
              {t("search.placeholder")}
            </button>
            <button
              onClick={toggleLocale}
              class="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white transition-colors text-left"
            >
              {locale === "zh-CN" ? "Switch to English" : "Switch to Chinese"}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
