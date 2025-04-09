import { h } from "preact";
import { Handlers, PageProps } from "$fresh/server.ts";
import Layout from "../components/Layout.tsx";
import Hero from "../components/Hero.tsx";
import { BlogPlugin } from "../plugins/blog/mod.ts";
import type { BlogPost } from "../core/content.ts";
import { i18nPlugin, t } from "../plugins/i18n/mod.ts";
import { ProjectsPlugin } from "../plugins/projects/mod.ts";
import { getProjects } from "../plugins/projects/mod.ts";
import { initPlugins } from "../plugins/mod.ts";

// 创建插件实例
const blogPlugin = new BlogPlugin({
  postsDir: "docs/blog",
});
const projectsPlugin = new ProjectsPlugin();

// 首页Props类型定义
export interface HomeProps {
  latestPost?: BlogPost;
  latestProject?: any;
  features: Array<{ title: string; description: string }>;
  quickStart: Array<{ title: string; description: string }>;
  locale?: string;
  translations?: Record<string, any>;
  error?: string;
}

// 初始化函数，在handler中调用
async function initPlugins() {
  if (!i18nPlugin.initialized) {
    await i18nPlugin.activate();
  }
  if (!blogPlugin.initialized) {
    await blogPlugin.activate();
  }
  if (!projectsPlugin.initialized) {
    await projectsPlugin.activate();
  }
}

export const handler: Handlers = {
  async GET(req, ctx) {
    try {
      // 初始化插件
      await initPlugins();

      // 获取语言设置
      const url = new URL(req.url);
      const lang = url.searchParams.get("lang") || "en-US";
      console.log(`[Home] 当前语言参数: ${lang}`);

      // 设置当前语言
      i18nPlugin.setLocale(lang);
      console.log(`[Home] 当前语言已设置为: ${i18nPlugin.getLocale()}`);

      // 确保翻译已加载
      await i18nPlugin.waitForTranslations();

      // 强制加载所有语言
      for (const locale of i18nPlugin.getLocales()) {
        await i18nPlugin.forceLoadLanguage(locale);
      }

      // 获取所有翻译
      const translations = i18nPlugin.getTranslations();
      console.log(`[Home] 已加载翻译:`, Object.keys(translations));

      // 测试当前语言的翻译
      console.log(
        `[Home] 测试翻译:`,
        t("nav.home", {}, lang),
        t("nav.blog", {}, lang),
        t("nav.projects", {}, lang),
        t("nav.resume", {}, lang)
      );

      // 准备数据
      const data = {
        features: [
          {
            title: t("features.performance.title"),
            description: t("features.performance.description"),
            icon: "⚡",
          },
          {
            title: t("features.security.title"),
            description: t("features.security.description"),
            icon: "🔒",
          },
          {
            title: t("features.development.title"),
            description: t("features.development.description"),
            icon: "🚀",
          },
        ],
        quickStart: [
          {
            title: t("quickStart.install.title"),
            description: t("quickStart.install.description"),
          },
          {
            title: t("quickStart.configure.title"),
            description: t("quickStart.configure.description"),
          },
          {
            title: t("quickStart.deploy.title"),
            description: t("quickStart.deploy.description"),
          },
        ],
        locale: lang,
        translations: translations, // 传递翻译给客户端
      };

      // 加载博客文章
      try {
        const posts = await blogPlugin.loadPosts();
        if (posts && posts.length > 0) {
          data.latestPost = posts[0];
        }
      } catch (error) {
        console.error("加载博客文章失败:", error);
      }

      // 加载项目
      try {
        const projects = await getProjects();
        if (projects && Array.isArray(projects) && projects.length > 0) {
          data.latestProject = projects[0];
        }
      } catch (error) {
        console.error("加载项目失败:", error);
      }

      return ctx.render(data);
    } catch (error) {
      console.error("[Home] 初始化错误:", error);
      return new Response("Internal Server Error", { status: 500 });
    }
  },
};

export default function Home(props: PageProps<HomeProps>) {
  // 提取数据
  const { features, quickStart, locale, translations, error } = props.data;

  // 处理错误页面
  if (error) {
    return (
      <div class="text-center p-10">
        <h1 class="text-red-500 text-2xl">错误</h1>
        <p>{error}</p>
        <a href="/" class="text-blue-500 underline">
          返回首页
        </a>
      </div>
    );
  }

  // 注入翻译数据到全局对象
  if (typeof window !== "undefined" && translations) {
    console.log(`[Home] 向全局注入翻译数据，当前语言: ${locale}`);
    window.__translations = translations;
    window.__currentLocale = locale || "en-US";

    // 测试全局翻译
    setTimeout(() => {
      const items = ["nav.home", "nav.blog", "nav.projects", "nav.resume"];
      for (const key of items) {
        console.log(
          `[Home] 全局翻译测试 - ${key}:`,
          window.__t ? window.__t(key) : "全局翻译函数不存在"
        );
      }

      // 输出全局翻译对象内容
      if (window.__translations && window.__currentLocale) {
        const dict = window.__translations[window.__currentLocale];
        if (dict && dict.nav) {
          console.log("[Home] 导航翻译字典：", dict.nav);
        } else {
          console.warn("[Home] 找不到导航翻译字典！");
        }
      }
    }, 100);
  }

  // 使用服务器传递的语言
  const lang = locale || "en-US";

  return (
    <Layout locale={lang}>
      <Hero
        title={t("hero.title")}
        subtitle={t("hero.subtitle")}
        buttons={[
          {
            text: t("hero.blog"),
            href: "/blog",
            isPrimary: true,
          },
          {
            text: t("hero.projects"),
            href: "/projects",
            isPrimary: false,
          },
        ]}
      />

      {/* 1. 特性展示 */}
      <section class="py-16 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 dark:text-white transition-colors">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 class="text-3xl font-bold text-center mb-12 animate-fade-in">
            {t("features.title")}
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100 dark:border-gray-700">
                <div class="text-4xl mb-4 text-blue-500">{feature.icon}</div>
                <h3 class="text-xl font-semibold mb-3">{feature.title}</h3>
                <p class="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. 快速开始 */}
      <section class="py-16 bg-white dark:bg-gray-800 dark:text-white transition-colors">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 class="text-3xl font-bold text-center mb-12 animate-fade-in">
            {t("quickStart.title")}
          </h2>
          <div class="max-w-3xl mx-auto">
            <div class="space-y-6">
              {quickStart.map((step, index) => (
                <div class="flex items-start">
                  <div class="flex-shrink-0 h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-lg">
                    {index + 1}
                  </div>
                  <div class="ml-4">
                    <h3 class="text-xl font-semibold mb-2">{step.title}</h3>
                    <p class="text-gray-600 dark:text-gray-300">
                      {step.description}
                    </p>
                    {step.code && (
                      <div class="mt-2 p-3 bg-gray-800 text-gray-200 rounded-md overflow-x-auto">
                        <code>{step.code}</code>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. 最新博客 */}
      {props.data.latestPost && (
        <section class="py-16 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 dark:text-white transition-colors">
          <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 class="text-3xl font-bold text-center mb-12 animate-fade-in">
              {t("latestBlog.title")}
            </h2>
            <div class="max-w-3xl mx-auto">
              <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100 dark:border-gray-700">
                <h3 class="text-2xl font-bold mb-3">
                  <a
                    href={`/blog/${props.data.latestPost.id}`}
                    class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                  >
                    {props.data.latestPost.title}
                  </a>
                </h3>
                <p class="text-gray-500 dark:text-gray-400 mb-3">
                  {new Date(
                    props.data.latestPost.date || new Date()
                  ).toLocaleDateString(lang === "zh-CN" ? "zh-CN" : "en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                  {props.data.latestPost.author && (
                    <> · {props.data.latestPost.author}</>
                  )}
                  {props.data.latestPost.readingTime && (
                    <> · {props.data.latestPost.readingTime} min read</>
                  )}
                </p>
                {props.data.latestPost.cover &&
                  props.data.latestPost.cover.trim() && (
                    <div class="mb-4">
                      <img
                        src={
                          props.data.latestPost.cover.startsWith("/")
                            ? props.data.latestPost.cover
                            : `/${props.data.latestPost.cover}`
                        }
                        alt={props.data.latestPost.title}
                        class="w-full h-64 object-cover rounded-md"
                        onerror="this.style.display='none'"
                      />
                    </div>
                  )}
                <div class="text-gray-600 dark:text-gray-300 mb-4">
                  {props.data.latestPost.description ||
                    (props.data.latestPost.content && (
                      <p>
                        {props.data.latestPost.content
                          .split("\n")
                          .slice(0, 3)
                          .join(" ")
                          .substring(0, 300)}
                        {props.data.latestPost.content.length > 300 && "..."}
                      </p>
                    ))}
                </div>
                <a
                  href={`/blog/${props.data.latestPost.id}`}
                  class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 inline-flex items-center"
                >
                  {t("latestBlog.readMore")}
                  <svg
                    class="w-4 h-4 ml-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 4. 项目展示 */}
      <section class="py-16 bg-white dark:bg-gray-800 dark:text-white transition-colors">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 class="text-3xl font-bold text-center mb-12 animate-fade-in">
            {t("projectShowcase.title")}
          </h2>
          <div class="grid md:grid-cols-2 gap-8">
            {projectsPlugin.initialized && props.data.latestProject && (
              <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100 dark:border-gray-700 md:col-span-2">
                <div class="md:flex gap-6">
                  {props.data.latestProject.demoUrl && (
                    <div class="md:w-1/2 mb-4 md:mb-0">
                      <div class="relative w-full h-64 md:h-80 rounded-md overflow-hidden border border-gray-200 dark:border-gray-700">
                        <iframe
                          src={props.data.latestProject.demoUrl}
                          class="absolute top-0 left-0 w-full h-full"
                          title={
                            props.data.latestProject.title ||
                            props.data.latestProject.name
                          }
                          loading="lazy"
                          sandbox="allow-scripts allow-same-origin"
                        ></iframe>
                      </div>
                    </div>
                  )}
                  <div
                    class={
                      props.data.latestProject.demoUrl ? "md:w-1/2" : "w-full"
                    }
                  >
                    <h3 class="text-2xl font-bold mb-4">
                      {props.data.latestProject.title ||
                        props.data.latestProject.name}
                    </h3>
                    <p class="text-gray-600 dark:text-gray-300 mb-4">
                      {props.data.latestProject.description}
                    </p>
                    {props.data.latestProject.technologies &&
                      props.data.latestProject.technologies.length > 0 && (
                        <div class="mb-4">
                          <h4 class="text-lg font-medium mb-2">
                            {t("projectShowcase.technologies")}
                          </h4>
                          <div class="flex flex-wrap gap-2">
                            {props.data.latestProject.technologies.map(
                              (tech) => (
                                <span class="text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full">
                                  {tech}
                                </span>
                              )
                            )}
                          </div>
                        </div>
                      )}
                    <div class="flex gap-4 mt-6">
                      {props.data.latestProject.demoUrl && (
                        <a
                          href={props.data.latestProject.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                        >
                          {t("projectShowcase.viewDemo")}
                        </a>
                      )}
                      {props.data.latestProject.githubUrl && (
                        <a
                          href={props.data.latestProject.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          class="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md transition-colors"
                        >
                          {t("projectShowcase.githubRepo")}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
}
