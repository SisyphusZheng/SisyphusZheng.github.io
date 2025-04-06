import { h } from "preact";
import { useEffect, useState } from "preact/hooks";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [isLoaded, setIsLoaded] = useState(false);

  // 网站加载时检查主题设置
  useEffect(() => {
    // 读取本地存储或系统偏好设置
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    // 设置初始主题
    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setTheme("dark");
      document.documentElement.classList.add("dark");
      document.body.classList.add("dark");
    } else {
      setTheme("light");
      document.documentElement.classList.remove("dark");
      document.body.classList.remove("dark");
    }

    // 加载后设置已加载状态
    setIsLoaded(true);

    // 记录当前主题状态
    console.log("初始主题:", savedTheme || (prefersDark ? "dark" : "light"));
  }, []);

  // 切换主题时触发
  useEffect(() => {
    if (!isLoaded) return;

    console.log("应用主题:", theme);

    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      document.body.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.body.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }

    // 触发一个事件通知应用主题已更改
    window.dispatchEvent(new CustomEvent("themeChange", { detail: { theme } }));
  }, [theme, isLoaded]);

  // 切换主题
  const toggleTheme = () => {
    console.log("切换主题", theme === "light" ? "dark" : "light");
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <button
      onClick={toggleTheme}
      class="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      aria-label={theme === "light" ? "切换到暗色模式" : "切换到亮色模式"}
      title={theme === "light" ? "切换到暗色模式" : "切换到亮色模式"}
    >
      {theme === "light" ? (
        <svg
          class="w-5 h-5 text-gray-700"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          ></path>
        </svg>
      ) : (
        <svg
          class="w-5 h-5 text-yellow-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          ></path>
        </svg>
      )}
    </button>
  );
}
