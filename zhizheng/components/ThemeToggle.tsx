import { useState, useEffect } from "preact/hooks";

export default function ThemeToggle() {
  // 初始化时从 localStorage 读取主题偏好
  const [isDark, setIsDark] = useState(() => {
    if (typeof localStorage !== "undefined") {
      return localStorage.theme === "dark";
    }
    return false;
  });

  // 监听系统主题偏好变化
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => setIsDark(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // 应用主题到 DOM 和 localStorage
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.theme = isDark ? "dark" : "light";
  }, [isDark]);

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      class="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      aria-label={isDark ? "切换到亮色模式" : "切换到暗黑模式"}
    >
      {isDark ? (
        <span class="text-yellow-300">☀️</span>
      ) : (
        <span class="text-gray-700">🌙</span>
      )}
    </button>
  );
}
