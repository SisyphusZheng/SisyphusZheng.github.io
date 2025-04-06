import { Handlers } from "$fresh/server.ts";
import Layout from "../components/Layout.tsx";
import Hero from "../components/Hero.tsx";
import { siteConfig } from "../data/config.ts";
import { getAllPosts, Post } from "../utils/blog.ts";
import {
  getContent,
  getFeatures,
  getQuickStartSteps,
  getChangelogVersions,
} from "../utils/content.ts";
import { currentLocale } from "../utils/i18n.ts";

export const handler: Handlers = {
  async GET(req, ctx) {
    // 从URL查询参数获取语言设置
    const url = new URL(req.url);
    const langParam = url.searchParams.get("lang");
    const locale =
      langParam === "zh-CN" || langParam === "en-US" ? langParam : undefined;

    // 读取最近的博客文章
    const posts = await getAllPosts();

    // 按日期排序，获取最新的文章
    const latestPost = posts[0]; // getAllPosts已经按日期排序了

    // 获取最新的项目
    const latestProject = siteConfig.projects.items[0];

    // 获取功能列表 - 传入语言参数
    const features = getFeatures(locale);

    // 获取快速开始步骤 - 传入语言参数
    const quickStartSteps = getQuickStartSteps(locale);

    // 获取更新日志 - 传入语言参数
    const changelogVersions = getChangelogVersions(locale);

    return ctx.render({
      latestPost,
      latestProject,
      features,
      quickStartSteps,
      changelogVersions,
      locale,
    });
  },
};

export default function Home({
  data,
}: {
  data: {
    latestPost: Post;
    latestProject: any;
    features: any[];
    quickStartSteps: any[];
    changelogVersions: any[];
    locale?: Locale;
  };
}) {
  const {
    latestPost,
    latestProject,
    features,
    quickStartSteps,
    changelogVersions,
    locale,
  } = data;

  // 使用从服务器传来的locale，如果存在的话
  const effectiveLocale = locale || currentLocale.value;

  return (
    <Layout>
      <Hero locale={effectiveLocale} />

      {/* 主要特性展示 */}
      <section class="py-16 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 dark:text-white transition-colors">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 class="text-3xl font-bold text-center mb-12 animate-fade-in">
            {getContent(["features", "title"], effectiveLocale)}
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

      {/* 最新动态 */}
      <section class="py-16 bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 dark:text-white transition-colors">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 class="text-3xl font-bold text-center mb-12 animate-fade-in">
            {getContent(["news", "title"], effectiveLocale)}
          </h2>
          <div class="grid md:grid-cols-2 gap-8">
            {/* 最新博客文章 */}
            <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100 dark:border-gray-700">
              <h3 class="text-xl font-semibold mb-4">
                <span class="text-blue-500">📰</span>{" "}
                {getContent(["news", "blog", "title"], effectiveLocale)}
              </h3>
              {latestPost ? (
                <>
                  <h4 class="text-lg font-medium mb-2">
                    <a
                      href={`/blog/${latestPost.slug}`}
                      class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                    >
                      {latestPost.title}
                    </a>
                  </h4>
                  <p class="text-gray-500 dark:text-gray-400 mb-2">
                    {new Date(latestPost.date).toLocaleDateString(
                      effectiveLocale === "zh-CN" ? "zh-CN" : "en-US",
                      { year: "numeric", month: "short", day: "numeric" }
                    )}
                  </p>
                  <p class="text-gray-600 dark:text-gray-300 mb-4">
                    {latestPost.description ||
                      latestPost.content.split("\n")[0]}
                  </p>
                  <a
                    href={`/blog/${latestPost.slug}`}
                    class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 inline-flex items-center"
                  >
                    {getContent(["news", "blog", "readMore"], effectiveLocale)}
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
                </>
              ) : (
                <p class="text-gray-600 dark:text-gray-300">暂无博客文章</p>
              )}
            </div>

            {/* 更新日志 */}
            <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100 dark:border-gray-700">
              <h3 class="text-xl font-semibold mb-4">
                <span class="text-blue-500">📋</span>{" "}
                {getContent(["news", "updates", "title"], effectiveLocale)}
              </h3>
              <div class="space-y-4">
                {changelogVersions.map((version) => (
                  <div>
                    <h4 class="text-lg font-medium mb-1">{version.version}</h4>
                    <p class="text-gray-500 dark:text-gray-400 text-sm mb-2">
                      {version.date}
                    </p>
                    <ul class="text-gray-600 dark:text-gray-300 text-sm list-disc pl-5 space-y-1">
                      {version.changes.map((change: string) => (
                        <li>{change}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 快速开始 */}
      <section class="py-16 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 dark:text-white transition-colors">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 class="text-3xl font-bold text-center mb-8 animate-fade-in">
            {getContent(["quickStart", "title"], effectiveLocale)}
          </h2>
          <p class="text-center text-lg mb-12 max-w-3xl mx-auto text-gray-600 dark:text-gray-300">
            {getContent(["quickStart", "subtitle"], effectiveLocale)}
          </p>

          {quickStartSteps.map((step) => (
            <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-100 dark:border-gray-700 mb-8">
              <h3 class="text-xl font-semibold mb-4">{step.title}</h3>
              <div class="overflow-x-auto">
                <code class="font-mono text-gray-800 dark:text-gray-200">
                  $ {step.code}
                </code>
              </div>
            </div>
          ))}

          <div class="text-center mt-12">
            <a
              href={getContent(["quickStart", "cta", "link"], effectiveLocale)}
              class="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10 transition-colors"
              target="_blank"
            >
              <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              {getContent(["quickStart", "cta", "text"], effectiveLocale)}
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
}
