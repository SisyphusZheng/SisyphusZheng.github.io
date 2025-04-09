import { AppProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";
import { config as siteConfig } from "../config.ts";
import { config } from "../freshpress.config.ts";

export default function App({ Component, url, data }: AppProps) {
  // 从根目录的配置文件获取配置信息
  const title = config.site.title || siteConfig.site.title || "FreshPress Site";
  const description =
    config.site.description ||
    siteConfig.site.description ||
    "A static site generator for Deno";
  const enabledPlugins =
    config.plugins.enabled || siteConfig.plugins.enabled || [];

  // 获取URL参数中的语言设置
  const urlParams = new URL(url).searchParams;
  const lang = urlParams.get("lang") || "en-US";

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="/styles.css" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // 存储启用的插件列表到全局变量
              window.__enabledPlugins = ${JSON.stringify(enabledPlugins)};
              
              // 确保翻译对象存在
              window.__translations = window.__translations || ${JSON.stringify(
                data?.translations || {}
              )};
              
              // 设置当前语言
              window.__currentLocale = "${data?.locale || lang || "en-US"}";
              
              // 打印调试信息
              console.log("[Global] 当前语言:", window.__currentLocale);
              console.log("[Global] 可用翻译:", Object.keys(window.__translations || {}));
              
              // 添加全局翻译函数
              window.__t = function(key, params, locale) {
                if (!window.__translations) {
                  console.warn("[Global] 翻译对象不存在", key);
                  return key;
                }
                
                const targetLocale = locale || window.__currentLocale || "en-US";
                const dict = window.__translations[targetLocale];
                if (!dict) {
                  console.warn("[Global] 找不到语言字典", targetLocale, key);
                  return key;
                }
                
                // 分割点号路径
                const parts = key.split('.');
                let value = dict;
                
                // 遍历路径
                for (const part of parts) {
                  if (!value || typeof value !== 'object') {
                    console.warn("[Global] 翻译路径无效", key, "at", part);
                    return key;
                  }
                  value = value[part];
                }
                
                if (value === undefined) {
                  console.warn("[Global] 翻译键不存在", key);
                  return key;
                }
                
                console.log("[Global] 翻译成功", key, "=>", value);
                return String(value);
              };
              
              // 测试翻译
              if (window.__translations && window.__currentLocale) {
                console.log("测试首页翻译:", window.__t("nav.home"));
                console.log("测试博客翻译:", window.__t("nav.blog"));
              }
            `,
          }}
        ></script>
      </Head>
      <Component />
    </>
  );
}
