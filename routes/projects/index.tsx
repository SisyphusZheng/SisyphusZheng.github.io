import { Handlers } from "$fresh/server.ts";
import Layout from "../../components/Layout.tsx";
import { siteConfig } from "../../data/config.ts";
import { getAllProjects, Project } from "../../utils/projects.ts";
import { t, currentLocale, type Locale } from "../../utils/i18n.ts";

export const handler: Handlers<Project[]> = {
  async GET(req, ctx) {
    // 从URL获取语言参数
    const url = new URL(req.url);
    const langParam = url.searchParams.get("lang");
    const locale =
      langParam === "zh-CN" || langParam === "en-US" ? langParam : undefined;

    const projects = getAllProjects();
    return ctx.render(projects);
  },
};

export default function Projects({ data }: { data: Project[] }) {
  // 使用当前语言设置
  const locale = currentLocale.value;

  return (
    <Layout>
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 class="text-4xl font-bold mb-8 dark:text-white">
          {t("project.title", locale)}
        </h1>
        <p class="text-xl text-gray-600 dark:text-gray-300 mb-8">
          {t("project.description", locale)}
        </p>

        <div class="space-y-8">
          {data.map((project) => (
            <article class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100 dark:border-gray-700">
              <h2 class="text-2xl font-bold mb-2">
                <a
                  href={`/projects/${project.title
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`}
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
