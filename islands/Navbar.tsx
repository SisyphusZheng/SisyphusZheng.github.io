import { h } from "preact";
import { useState, useEffect } from "preact/hooks";
import Search from "./Search.tsx";
import ThemeToggle from "./ThemeToggle.tsx";
import LocaleSwitcher from "./LocaleSwitcher.tsx";

// 简单的翻译函数
function t(key: string): string {
  // 检查是否在浏览器环境
  if (typeof window === "undefined") {
    console.log(`[t] 服务器端渲染，返回键名: ${key}`);
    // 服务器端渲染时，返回键名
    return key;
  }

  // 浏览器环境下，从全局加载翻译
  const translations = window.__translations || {};
  console.log(`[t] 翻译键: ${key}, 当前翻译对象:`, translations);

  // 分割键路径 (例如 "nav.blog" => ["nav", "blog"])
  const parts = key.split(".");

  // 递归访问翻译对象
  let result = translations;
  for (const part of parts) {
    if (result && typeof result === "object" && part in result) {
      result = result[part];
    } else {
      console.log(`[t] 未找到翻译键: ${key}, 返回原键`);
      return key; // 如果找不到翻译，返回原键
    }
  }

  const translatedText = typeof result === "string" ? result : key;
  console.log(`[t] 翻译结果: ${key} -> ${translatedText}`);
  return translatedText;
}

// 为window添加__translations全局变量类型
declare global {
  interface Window {
    __translations: Record<string, any>;
    __enabledPlugins?: string[]; // 添加已启用插件列表
  }
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [translations, setTranslations] = useState<Record<string, any>>({});
  // 添加一个forceUpdate状态，用于强制刷新组件
  const [refreshKey, setRefreshKey] = useState(0);
  // 添加一个启用插件状态
  const [enabledPlugins, setEnabledPlugins] = useState<string[]>([]);

  // 初始化和监听语言变更
  useEffect(() => {
    // 确保只在浏览器环境中执行
    if (typeof window === "undefined") return;

    // 初始化全局翻译对象
    window.__translations = window.__translations || {};
    setTranslations(window.__translations);

    // 初始化已启用插件列表
    if (window.__enabledPlugins) {
      setEnabledPlugins(window.__enabledPlugins);
      console.log("[Navbar] 从全局获取已启用插件:", window.__enabledPlugins);
    } else {
      // 通过API获取
      console.log("[Navbar] 尝试从API获取插件列表");
      fetch("/api/plugins/enabled")
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
          throw new Error(`获取插件列表失败: ${response.status}`);
        })
        .then((data) => {
          console.log("[Navbar] API返回的插件列表:", data);
          window.__enabledPlugins = data;
          setEnabledPlugins(data);
        })
        .catch((error) => {
          console.error("[Navbar] 获取已启用插件失败:", error);
          // 直接读取localStorage中的配置作为最后手段
          try {
            const configStr = localStorage.getItem("fp_config");
            if (configStr) {
              const config = JSON.parse(configStr);
              if (config.plugins && Array.isArray(config.plugins.enabled)) {
                console.log(
                  "[Navbar] 从localStorage获取插件列表:",
                  config.plugins.enabled
                );
                setEnabledPlugins(config.plugins.enabled);
                return;
              }
            }
          } catch (e) {
            console.error("[Navbar] 从localStorage读取配置失败:", e);
          }
          // 默认启用所有功能
          console.log("[Navbar] 使用默认插件列表");
          setEnabledPlugins(["blog", "search", "projects", "resume", "i18n"]);
        });
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

    // 加载翻译文件
    const loadTranslations = async () => {
      try {
        // 从localStorage获取当前语言
        const locale = localStorage.getItem("preferred_locale") || "en-US";
        console.log(`[Navbar] 开始加载翻译文件，语言: ${locale}`);

        try {
          // 从API获取翻译文件
          console.log(
            `[Navbar] 尝试从API获取翻译: /api/translations/${locale}`
          );
          const response = await fetch(`/api/translations/${locale}`);

          if (response.ok) {
            const data = await response.json();
            console.log(
              `[Navbar] 成功获取翻译数据，键数量: ${
                Object.keys(data).length
              }，内容:`,
              JSON.stringify(data)
            );

            // 更新全局翻译对象并设置到状态
            window.__translations = data;
            setTranslations(data);
            console.log(
              `[Navbar] 已加载 ${locale} 翻译并更新状态，内容:`,
              window.__translations
            );

            // 更新HTML lang属性
            document.documentElement.lang = locale;

            // 强制DOM更新
            setRefreshKey((prevKey) => prevKey + 1);
          } else {
            console.error(
              `[Navbar] 无法加载翻译文件，状态码: ${response.status}，状态文本: ${response.statusText}`
            );

            // 尝试读取错误响应内容
            try {
              const errorText = await response.text();
              console.error(`[Navbar] 错误响应内容: ${errorText}`);
            } catch (textError) {
              console.error(`[Navbar] 无法读取错误响应: ${textError}`);
            }
          }
        } catch (error) {
          console.error("[Navbar] 加载翻译失败，错误详情:", error);
        }
      } catch (error) {
        console.error("[Navbar] 加载翻译流程错误:", error);
      }
    };

    loadTranslations();

    // 监听语言变更事件
    const handleLocaleChange = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail && customEvent.detail.locale) {
        loadTranslations();
      }
    };

    window.addEventListener("fp:localeChange", handleLocaleChange);

    return () => {
      window.removeEventListener("fp:localeChange", handleLocaleChange);
      window.removeEventListener("fp:configUpdate", handleConfigUpdate);
    };
  }, []);

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
            {/* Search button - 只在search插件启用时显示 */}
            {isPluginEnabled("search") && (
              <button
                onClick={toggleSearch}
                class="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white transition-colors focus:outline-none"
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
            )}

            {/* Navigation links - 根据插件启用状态显示 */}
            {isPluginEnabled("blog") && (
              <a
                href="/blog"
                class="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white transition-colors focus:outline-none"
              >
                {t("nav.blog")}
              </a>
            )}

            {isPluginEnabled("projects") && (
              <a
                href="/projects"
                class="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white transition-colors focus:outline-none"
              >
                {t("nav.projects")}
              </a>
            )}

            {isPluginEnabled("resume") && (
              <a
                href="/resume"
                class="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white transition-colors focus:outline-none"
              >
                {t("nav.resume")}
              </a>
            )}

            {/* Theme toggle */}
            <ThemeToggle />

            {/* Language toggle - 仅在i18n插件启用时显示 */}
            {isPluginEnabled("i18n") && <LocaleSwitcher />}
          </div>

          {/* Mobile menu button */}
          <div class="md:hidden flex items-center space-x-4">
            <a href="/" class="flex items-center focus:outline-none">
              <img src="/logo.svg" alt="FreshPress Logo" class="h-6 w-auto" />
            </a>
            <ThemeToggle />
            <button
              class="outline-none focus:outline-none"
              onClick={toggleMenu}
            >
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

        {/* Search modal - 只在search插件启用时显示 */}
        {showSearch && isPluginEnabled("search") && (
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
            {/* 移动端导航项 - 根据插件状态显示 */}
            {isPluginEnabled("blog") && (
              <a
                href="/blog"
                class="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white transition-colors focus:outline-none"
              >
                {t("nav.blog")}
              </a>
            )}

            {isPluginEnabled("projects") && (
              <a
                href="/projects"
                class="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white transition-colors focus:outline-none"
              >
                {t("nav.projects")}
              </a>
            )}

            {isPluginEnabled("resume") && (
              <a
                href="/resume"
                class="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white transition-colors focus:outline-none"
              >
                {t("nav.resume")}
              </a>
            )}

            {isPluginEnabled("search") && (
              <button
                onClick={toggleSearch}
                class="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white transition-colors text-left focus:outline-none"
              >
                {t("search.placeholder")}
              </button>
            )}

            {isPluginEnabled("i18n") && <LocaleSwitcher />}
          </div>
        </div>
      </div>
    </nav>
  );
}
