import { Handlers, PageProps } from "$fresh/server.ts";
import Layout from "../../components/Layout.tsx";
import { type Project, getProjects } from "../../plugins/projects/mod.ts";
import {
  t,
  currentLocale,
  type Locale,
  i18nPlugin,
} from "../../plugins/i18n/mod.ts";

interface ProjectsPageData {
  projects: Project[];
  locale: string;
  translations: Record<string, Record<string, string>>;
}

export const handler: Handlers = {
  async GET(req: Request, ctx) {
    // 从URL获取语言参数
    const url = new URL(req.url);
    const langParam = url.searchParams.get("lang");
    const locale =
      langParam === "zh-CN" || langParam === "en-US"
        ? (langParam as Locale)
        : ("en-US" as Locale);

    // 设置当前语言
    currentLocale.value = locale;

    // 确保i18n插件激活并加载翻译
    if (!i18nPlugin.isActive) {
      await i18nPlugin.activate();
    }

    // 等待翻译加载完成
    await i18nPlugin.forceLoadLanguage(locale);

    // 获取项目列表
    const projects = await getProjects();

    // 获取当前语言的翻译数据
    const translations = i18nPlugin.getTranslations();

    // 返回带有翻译数据的上下文
    return ctx.render({
      projects,
      locale,
      translations,
    });
  },
};

export default function Projects({ data }: PageProps<ProjectsPageData>) {
  // 将翻译数据注入全局对象
  if (typeof window !== "undefined" && data.translations) {
    console.log(
      "Projects页面: 将翻译数据注入到全局对象",
      Object.keys(data.translations).length,
      "个语言"
    );
    window.__translations = data.translations;

    // 测试全局翻译功能
    setTimeout(() => {
      console.log(
        "Projects页面翻译测试:",
        t("nav.home", data.locale),
        t("nav.blog", data.locale),
        t("nav.projects", data.locale)
      );
    }, 100);
  }

  return (
    <Layout>
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 class="text-4xl font-bold mb-8 dark:text-white">
          {t("project.title", data.locale)}
        </h1>
        <p class="text-xl text-gray-600 dark:text-gray-300 mb-8">
          {t("project.description", data.locale)}
        </p>

        <div class="space-y-8">
          {data.projects.map((project) => (
            <article class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100 dark:border-gray-700">
              <h2 class="text-2xl font-bold mb-2">
                <a
                  href={`/projects/${project.slug}`}
                  class="text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  {project.title}
                </a>
              </h2>
              <p class="text-gray-600 dark:text-gray-300 mb-4">
                {project.description}
              </p>
              <div class="flex flex-wrap gap-2">
                {project.technologies.map((tag) => (
                  <span class="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-1 rounded-full text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </Layout>
  );
}
