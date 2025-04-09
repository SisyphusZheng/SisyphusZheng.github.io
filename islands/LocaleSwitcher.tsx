import { h } from "preact";
import { useState, useEffect } from "preact/hooks";

interface Props {
  className?: string;
}

// 全局翻译辅助函数
function globalT(key: string, params?: any, locale?: string): string {
  // 客户端环境下使用全局翻译函数
  if (typeof window !== "undefined" && window.__t) {
    return window.__t(key, params, locale);
  }
  // 服务器环境下或全局函数不可用时返回键名
  return key;
}

export default function LocaleSwitcher({ className = "" }: Props) {
  const [locale, setLocale] = useState<string>("en-US");

  // 初始化
  useEffect(() => {
    // 确保只在浏览器环境中执行
    if (typeof window === "undefined") return;

    // 从全局获取当前语言
    if (window.__currentLocale) {
      console.log(
        `[LocaleSwitcher] 从全局获取当前语言: ${window.__currentLocale}`
      );
      setLocale(window.__currentLocale);
    } else {
      // 从localStorage获取用户偏好语言
      const preferredLocale =
        localStorage.getItem("preferred_locale") || "en-US";
      console.log(
        `[LocaleSwitcher] 从localStorage获取当前语言: ${preferredLocale}`
      );
      setLocale(preferredLocale);
      // 设置全局语言
      window.__currentLocale = preferredLocale;
    }

    // 添加语言更改事件监听器
    const handleLocaleChange = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail && customEvent.detail.locale) {
        console.log(
          `[LocaleSwitcher] 收到语言更改事件: ${customEvent.detail.locale}`
        );
        setLocale(customEvent.detail.locale);
      }
    };

    window.addEventListener("localechange", handleLocaleChange);

    return () => {
      window.removeEventListener("localechange", handleLocaleChange);
    };
  }, []);

  // 切换语言
  const handleToggleLocale = () => {
    console.log(`[LocaleSwitcher] 切换语言，当前语言: ${locale}`);

    // 确定新语言
    const newLocale = locale === "en-US" ? "zh-CN" : "en-US";
    console.log(`[LocaleSwitcher] 语言将切换至: ${newLocale}`);

    // 设置全局当前语言
    if (typeof window !== "undefined") {
      window.__currentLocale = newLocale;
    }

    // 触发语言切换事件
    const event = new CustomEvent("localechange", {
      detail: { locale: newLocale },
    });
    window.dispatchEvent(event);

    // 更新localStorage
    localStorage.setItem("preferred_locale", newLocale);

    // 更新组件状态
    setLocale(newLocale);

    // 设置文档标题（根据当前语言）
    document.title = newLocale === "zh-CN" ? "FreshPress - 中文" : "FreshPress";

    // 在SSG模式下，需要导航到新语言页面
    // 获取当前路径（不包括语言部分）
    const pathname = window.location.pathname;

    // 移除可能存在的当前语言前缀
    let cleanPath = pathname.replace(/^\/(zh-CN|en-US)\//, "/");

    // 对于根路径特殊处理
    if (cleanPath === "/" || cleanPath === "") {
      window.location.href = `/${newLocale}`;
    } else {
      // 对于子路径
      window.location.href = `/${newLocale}${cleanPath}`;
    }
  };

  // 渲染语言切换按钮
  return (
    <button
      onClick={handleToggleLocale}
      class={`language-switch ${className} text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white transition-colors focus:outline-none`}
      aria-label={`当前语言: ${locale === "en-US" ? "English" : "中文"}`}
      title={`切换语言 (${
        locale === "en-US" ? "English → 中文" : "中文 → English"
      })`}
    >
      <div class="flex items-center">
        <span class="mr-1 font-medium">{locale === "en-US" ? "EN" : "中"}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
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
      </div>
    </button>
  );
}
