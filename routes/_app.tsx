import { Head } from "$fresh/runtime.ts";
import { AppProps } from "$fresh/server.ts";
import { siteConfig } from "../docs/config.ts";
import { config } from "../freshpress.config.ts";

export default function App({ Component }: AppProps) {
  // 从根目录的配置文件获取配置信息
  const title = config.site.title || siteConfig.site.title || "FreshPress Site";
  const description =
    config.site.description ||
    siteConfig.site.description ||
    "A site built with FreshPress";
  const language =
    typeof config.site.language === "string"
      ? config.site.language
      : Array.isArray(siteConfig.site.language)
      ? siteConfig.site.language[0]
      : "en-US";

  // 获取启用的插件列表（优先使用根目录配置文件）
  const enabledPlugins =
    config.plugins.enabled || siteConfig.plugins.enabled || [];

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta charSet="utf-8" />
        <meta name="language" content={language} />
        <link rel="icon" href="/favicon.ico" />

        {/* 注入全局配置 */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
            // 设置初始语言
            window.__initialLocale = "${language}";
            
            // 设置已启用的插件列表
            window.__enabledPlugins = ${JSON.stringify(enabledPlugins)};
            
            // 设置主题（如果本地存储中存在）
            const theme = localStorage.getItem('theme');
            if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
              document.documentElement.classList.add('dark');
            }
            
            // 调试信息
            console.log("[App] 已启用的插件:", ${JSON.stringify(
              enabledPlugins
            )});
          `,
          }}
        ></script>
      </Head>
      <Component />
    </>
  );
}
