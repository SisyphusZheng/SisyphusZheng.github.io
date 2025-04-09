import { h } from "preact";
import { useState, useEffect } from "preact/hooks";
import Search from "./Search.tsx";
import ThemeToggle from "./ThemeToggle.tsx";
import LocaleSwitcher from "./LocaleSwitcher.tsx";

// 为window添加__translations全局变量类型
declare global {
  interface Window {
    __translations: Record<string, any>;
    __currentLocale?: string;
    __enabledPlugins?: string[]; // 添加已启用插件列表
    __t?: (key: string, params?: any, locale?: string) => string; // 全局翻译函数
  }
}

// 全局翻译辅助函数
function globalT(key: string, params?: any, locale?: string): string {
  // 客户端环境下使用全局翻译函数
  if (typeof window !== "undefined") {
    console.log(
      `[GlobalT] 翻译键: ${key}, 当前语言: ${
        window.__currentLocale || "未设置"
      }`
    );

    if (window.__translations) {
      const targetLocale = locale || window.__currentLocale || "en-US";
      if (window.__translations[targetLocale]) {
        // 尝试手动查找键值
        try {
          const parts = key.split(".");
          let value = window.__translations[targetLocale];

          for (const part of parts) {
            value = value[part];
            if (value === undefined) {
              console.warn(
                `[GlobalT] 未找到翻译键: ${key} - 在部分 ${part} 处中断`
              );
              break;
            }
          }

          if (value !== undefined && typeof value === "string") {
            console.log(`[GlobalT] 成功找到翻译: ${key} => ${value}`);
            return value;
          }
        } catch (e) {
          console.error(`[GlobalT] 查找翻译出错: ${e.message}`);
        }
      } else {
        console.warn(`[GlobalT] 未找到语言: ${targetLocale}`);
      }
    } else {
      console.warn(`[GlobalT] 全局翻译对象不存在`);
    }

    if (window.__t) {
      return window.__t(key, params, locale);
    } else {
      console.warn(`[GlobalT] 全局翻译函数不存在, 返回键名: ${key}`);
    }
  }

  // 服务器环境下或全局函数不可用时返回键名
  return key;
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  // 添加一个forceUpdate状态，用于强制刷新组件
  const [refreshKey, setRefreshKey] = useState(0);
  // 添加一个启用插件状态
  const [enabledPlugins, setEnabledPlugins] = useState<string[]>([]);
  // 添加语言状态
  const [currentLocale, setCurrentLocale] = useState<string>("en-US");

  // 初始化和监听语言变更
  useEffect(() => {
    // 确保只在浏览器环境中执行
    if (typeof window === "undefined") return;

    // 获取当前语言
    if (window.__currentLocale) {
      setCurrentLocale(window.__currentLocale);
      console.log(`[Navbar] 当前语言: ${window.__currentLocale}`);
    }

    // 初始化已启用插件列表
    if (window.__enabledPlugins) {
      setEnabledPlugins(window.__enabledPlugins);
      console.log("[Navbar] 从全局获取已启用插件:", window.__enabledPlugins);
    } else {
      // 默认启用所有功能
      console.log("[Navbar] 使用默认插件列表");
      setEnabledPlugins(["blog", "search", "projects", "resume", "i18n"]);
    }

    // 监听配置更新事件
    const handleConfigUpdate = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail && customEvent.detail.enabledPlugins) {
        console.log(
          "[Navbar] 接收到配置更新事件，更新插件列表:",
          customEvent.detail.enabledPlugins
        );
        setEnabledPlugins(customEvent.detail.enabledPlugins);
      }
    };

    window.addEventListener("fp:configUpdate", handleConfigUpdate);

    // 监听语言变更事件
    const handleLocaleChange = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail && customEvent.detail.locale) {
        const newLocale = customEvent.detail.locale;
        console.log(`[Navbar] 收到语言变更事件: ${newLocale}`);
        setCurrentLocale(newLocale);
        // 强制刷新
        setRefreshKey((prev) => prev + 1);
      }
    };

    window.addEventListener("localechange", handleLocaleChange);

    return () => {
      window.removeEventListener("localechange", handleLocaleChange);
      window.removeEventListener("fp:configUpdate", handleConfigUpdate);
    };
  }, []);

  // 打印当前全局翻译对象信息
  useEffect(() => {
    if (typeof window === "undefined") return;
    console.log(`[Navbar] 刷新组件，当前语言: ${currentLocale}`);

    if (window.__translations) {
      console.log(`[Navbar] 可用翻译语言:`, Object.keys(window.__translations));
      // 测试翻译
      console.log(`[Navbar] 翻译测试 - 首页:`, globalT("nav.home"));
      console.log(`[Navbar] 翻译测试 - 博客:`, globalT("nav.blog"));
    } else {
      console.warn("[Navbar] 全局翻译对象不存在!");
    }
  }, [refreshKey, currentLocale]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleSearch = () => {
    setShowSearch(!showSearch);
  };

  // Close search when ESC is pressed
  useEffect(() => {
    if (typeof window === "undefined") return;

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

  // 检查插件是否启用
  const isPluginEnabled = (pluginName: string): boolean => {
    return enabledPlugins.includes(pluginName);
  };

  return (
    <nav class="bg-white backdrop-blur-md bg-opacity-90 dark:bg-gray-900 dark:bg-opacity-90 border-b border-gray-100 dark:border-gray-800 transition-all sticky top-0 z-40 shadow-sm">
      <div class="container mx-auto px-4">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <a href="/" class="flex items-center group">
              <img
                src="/lemon.svg"
                alt="柠檬"
                class="h-8 w-auto mr-3 transform transition-transform duration-500 group-hover:rotate-12"
              />
              <span class="font-bold text-xl text-gradient">FreshPress</span>
            </a>
          </div>

          {/* 汉堡菜单按钮 - 移动端显示 */}
          <div class="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              class="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 focus:outline-none rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
              aria-label="打开菜单"
            >
              <svg
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
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
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>

          <div class="hidden md:flex items-center space-x-1">
            {isPluginEnabled("i18n") && (
              <div class="ml-2">
                <LocaleSwitcher className="mx-2 font-medium text-base" />
              </div>
            )}
            <a
              href="/"
              class="px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl font-medium transition-all duration-200 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-indigo-600 dark:after:bg-indigo-400 after:transition-all"
            >
              {globalT("nav.home")}
            </a>
            {isPluginEnabled("blog") && (
              <a
                href="/blog"
                class="px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl font-medium transition-all duration-200 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-indigo-600 dark:after:bg-indigo-400 after:transition-all"
              >
                {globalT("nav.blog")}
              </a>
            )}
            {isPluginEnabled("projects") && (
              <a
                href="/projects"
                class="px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl font-medium transition-all duration-200 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-indigo-600 dark:after:bg-indigo-400 after:transition-all"
              >
                {globalT("nav.projects")}
              </a>
            )}
            {isPluginEnabled("resume") && (
              <a
                href="/resume"
                class="px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl font-medium transition-all duration-200 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-indigo-600 dark:after:bg-indigo-400 after:transition-all"
              >
                {globalT("nav.resume")}
              </a>
            )}

            {/* 右侧功能按钮组 */}
            <div class="flex items-center ml-6 space-x-3">
              {/* Search button - 只在search插件启用时显示 */}
              {isPluginEnabled("search") && (
                <button
                  onClick={toggleSearch}
                  class="p-2 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-full transition-all duration-200"
                  aria-label={globalT("search.placeholder")}
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
              )}
              {/* Theme toggle */}
              <div class="p-1">
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>

        {/* Search modal - 只在search插件启用时显示 */}
        {showSearch && isPluginEnabled("search") && (
          <div class="fixed inset-0 z-50 bg-black bg-opacity-50 backdrop-blur-sm dark:bg-opacity-70 flex items-start justify-center pt-20 animate-fade-in">
            <div
              class="w-full max-w-2xl mx-4 animate-fade-in"
              style="animation-delay: 150ms"
            >
              <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-5 border border-gray-100 dark:border-gray-700">
                <div class="flex justify-between items-center mb-4">
                  <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    {globalT("search.placeholder")}
                  </h2>
                  <button
                    onClick={toggleSearch}
                    class="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
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
        <div
          class={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
            isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div class="px-2 pt-2 pb-4 space-y-1 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 rounded-b-xl">
            {/* 移动端导航项 - 根据插件状态显示 */}
            <a
              href="/"
              class="block px-4 py-3 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-xl font-medium transition-all duration-200"
            >
              {globalT("nav.home")}
            </a>
            {isPluginEnabled("blog") && (
              <a
                href="/blog"
                class="block px-4 py-3 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-xl font-medium transition-all duration-200"
              >
                {globalT("nav.blog")}
              </a>
            )}

            {isPluginEnabled("projects") && (
              <a
                href="/projects"
                class="block px-4 py-3 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-xl font-medium transition-all duration-200"
              >
                {globalT("nav.projects")}
              </a>
            )}

            {isPluginEnabled("resume") && (
              <a
                href="/resume"
                class="block px-4 py-3 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-xl font-medium transition-all duration-200"
              >
                {globalT("nav.resume")}
              </a>
            )}

            {isPluginEnabled("search") && (
              <button
                onClick={toggleSearch}
                class="w-full text-left px-4 py-3 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-xl font-medium transition-all duration-200 flex items-center"
              >
                <svg
                  class="w-5 h-5 mr-2"
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
                {globalT("search.placeholder")}
              </button>
            )}

            {isPluginEnabled("i18n") && (
              <div class="px-3 py-2">
                <LocaleSwitcher />
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
