import { h } from "preact";
import { useState, useEffect } from "preact/hooks";
import { toggleLocale } from "../plugins/i18n/mod.ts";

interface Props {
  className?: string;
}

export default function LocaleSwitcher({ className = "" }: Props) {
  const [locale, setLocale] = useState<string>("en-US");

  // 初始化
  useEffect(() => {
    // 确保只在浏览器环境中执行
    if (typeof window === "undefined") return;

    // 从localStorage获取用户偏好语言
    const preferredLocale = localStorage.getItem("preferred_locale") || "en-US";
    setLocale(preferredLocale);

    // 添加语言更改事件监听器
    const handleLocaleChange = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail && customEvent.detail.locale) {
        setLocale(customEvent.detail.locale);
      }
    };

    window.addEventListener("fp:localeChange", handleLocaleChange);

    return () => {
      window.removeEventListener("fp:localeChange", handleLocaleChange);
    };
  }, []);

  // 切换语言并重新加载页面
  const handleToggleLocale = async () => {
    try {
      console.log("[LocaleSwitcher] 正在切换语言，当前语言:", locale);

      // 调用切换语言函数
      toggleLocale();
      console.log("[LocaleSwitcher] toggleLocale已调用");

      // 直接修改localStorage以确保语言切换
      const nextLocale = locale === "en-US" ? "zh-CN" : "en-US";
      localStorage.setItem("preferred_locale", nextLocale);
      console.log("[LocaleSwitcher] 已在localStorage中设置新语言:", nextLocale);

      // 更新DOM
      document.documentElement.lang = nextLocale;

      // 立即重新加载页面以应用新语言
      console.log("[LocaleSwitcher] 准备重新加载页面...");
      window.location.reload();
    } catch (error) {
      console.error("[LocaleSwitcher] 切换语言失败:", error);
      alert("切换语言失败，请查看控制台获取更多信息");
    }
  };

  // 渲染语言切换按钮
  return (
    <button
      onClick={handleToggleLocale}
      class={`language-switch ${className} text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white transition-colors focus:outline-none`}
      aria-label={`Switch language, current: ${locale}`}
      title={`Switch language (${locale})`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z" />
        <path d="M3.6 9h16.8" />
        <path d="M3.6 15h16.8" />
        <path d="M12 3a15 15 0 0 1 0 18" />
        <path d="M12 3a15 15 0 0 0 0 18" />
      </svg>
    </button>
  );
}
