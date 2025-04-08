import { h } from "preact";
import { Handlers } from "$fresh/server.ts";
import Layout from "../components/Layout.tsx";
import Hero from "../components/Hero.tsx";
import { siteConfig } from "../docs/config.ts";
import { BlogPlugin } from "../plugins/blog/mod.ts";
import type { BlogPost } from "../core/content.ts";
import {
  getContent,
  getFeatures,
  getQuickStartSteps,
  getChangelogVersions,
  type Locale,
} from "../docs/content.ts";
import { I18nPlugin } from "../plugins/i18n/mod.ts";
import { ProjectsPlugin } from "../plugins/projects/mod.ts";
import { getProjects } from "../plugins/projects/mod.ts";

// Create blog plugin instance
const blogPlugin = new BlogPlugin();
// Create i18n plugin instance
const i18nPlugin = new I18nPlugin();
const projectsPlugin = new ProjectsPlugin();

// Manually set initialized to true, force activation
blogPlugin.initialized = true;
projectsPlugin.initialized = true;

export const handler: Handlers = {
  async GET(req: Request, ctx: any) {
    // Get language setting from URL query parameter
    const url = new URL(req.url);
    const langParam = url.searchParams.get("lang");
    const locale =
      langParam === "zh-CN" || langParam === "en-US"
        ? (langParam as Locale)
        : "en-US";

    // Set current language for i18n plugin
    i18nPlugin.setLocale(locale);

    // Prepare data object
    const data: any = {
      features: getFeatures(locale),
      quickStartSteps: getQuickStartSteps(locale),
      changelogVersions: getChangelogVersions(locale),
      locale,
    };

    // Load blog posts - no condition check, load without checking plugin status
    try {
      const posts = await blogPlugin.loadPosts();
      if (posts && posts.length > 0) {
        data.latestPost = posts[0];
      }
    } catch (error) {
      console.error("Failed to load blog posts:", error);
    }

    // Load projects - no condition check, load without checking plugin status
    try {
      // Use getProjects helper function to load projects
      const projects = await getProjects();
      if (projects && projects.length > 0) {
        data.latestProject = projects[0];
      } else if (
        siteConfig.projects?.items &&
        siteConfig.projects.items.length > 0
      ) {
        // Fallback to configured project
        data.latestProject = siteConfig.projects.items[0];
      }
    } catch (error) {
      console.error("Failed to load projects:", error);
    }

    return ctx.render(data);
  },
};

export default function Home({
  data,
}: {
  data: {
    latestPost?: BlogPost;
    latestProject?: any;
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

  // Use locale from server
  const effectiveLocale = locale || "en-US";

  return (
    <Layout>
      <Hero locale={effectiveLocale} />

      {/* Feature Showcase */}
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

      {/* Latest Updates */}
      <section class="py-16 bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 dark:text-white transition-colors">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 class="text-3xl font-bold text-center mb-12 animate-fade-in">
            {getContent(["news", "title"], effectiveLocale)}
          </h2>
          <div class="grid md:grid-cols-2 gap-8">
            {/* Latest blog post - always show, no condition check */}
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
                    {new Date(latestPost.date || new Date()).toLocaleDateString(
                      effectiveLocale === "zh-CN" ? "zh-CN" : "en-US",
                      { year: "numeric", month: "short", day: "numeric" }
                    )}
                    {latestPost.author && <> · {latestPost.author}</>}
                    {latestPost.readingTime && (
                      <> · {latestPost.readingTime} min read</>
                    )}
                  </p>
                  {latestPost.cover && (
                    <div class="mb-4">
                      <img
                        src={latestPost.cover}
                        alt={latestPost.title}
                        class="w-full h-48 object-cover rounded-md"
                      />
                    </div>
                  )}
                  <div class="text-gray-600 dark:text-gray-300 mb-4 prose dark:prose-dark max-w-none">
                    {latestPost.description ||
                      (latestPost.content && (
                        <p>
                          {latestPost.content
                            .split("\n")
                            .slice(0, 3)
                            .join(" ")
                            .substring(0, 300)}
                          {latestPost.content.length > 300 && "..."}
                        </p>
                      ))}
                  </div>
                  {latestPost.tags && latestPost.tags.length > 0 && (
                    <div class="flex flex-wrap gap-2 mb-4">
                      {latestPost.tags.map((tag) => (
                        <span class="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
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
                <p class="text-gray-600 dark:text-gray-300">
                  {effectiveLocale === "zh-CN"
                    ? "暂无博客文章"
                    : "No blog posts yet"}
                </p>
              )}
            </div>

            {/* Changelog */}
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

            {/* If there's a latest project, show project card */}
            {latestProject && (
              <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100 dark:border-gray-700 md:col-span-2">
                <h3 class="text-xl font-semibold mb-4">
                  <span class="text-blue-500">🚀</span>{" "}
                  {effectiveLocale === "zh-CN" ? "最新项目" : "Latest Project"}
                </h3>
                <div class="md:flex gap-6">
                  {latestProject.image && (
                    <div class="md:w-1/3 mb-4 md:mb-0">
                      <img
                        src={latestProject.image}
                        alt={latestProject.title || latestProject.name}
                        class="w-full h-48 md:h-full object-cover rounded-md"
                      />
                    </div>
                  )}
                  <div class={latestProject.image ? "md:w-2/3" : "w-full"}>
                    <h4 class="text-lg font-medium mb-2">
                      <a
                        href={`/projects/${
                          latestProject.slug || latestProject.id
                        }`}
                        class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                      >
                        {latestProject.title || latestProject.name}
                      </a>
                    </h4>
                    <p class="text-gray-600 dark:text-gray-300 mb-4">
                      {latestProject.description}
                    </p>

                    {latestProject.technologies &&
                      latestProject.technologies.length > 0 && (
                        <div class="mb-4">
                          <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">
                            {effectiveLocale === "zh-CN"
                              ? "技术栈："
                              : "Technologies:"}
                          </p>
                          <div class="flex flex-wrap gap-2">
                            {latestProject.technologies.map((tech: string) => (
                              <span class="text-xs bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-2 py-1 rounded-full">
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                    {latestProject.features &&
                      latestProject.features.length > 0 && (
                        <div class="mb-4">
                          <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">
                            {effectiveLocale === "zh-CN"
                              ? "主要功能："
                              : "Key Features:"}
                          </p>
                          <ul class="text-gray-600 dark:text-gray-300 text-sm list-disc pl-5 space-y-1">
                            {latestProject.features
                              .slice(0, 3)
                              .map((feature: string) => (
                                <li>{feature}</li>
                              ))}
                            {latestProject.features.length > 3 && (
                              <li class="text-gray-500 dark:text-gray-400">
                                {effectiveLocale === "zh-CN"
                                  ? `...还有 ${
                                      latestProject.features.length - 3
                                    } 项功能`
                                  : `...and ${
                                      latestProject.features.length - 3
                                    } more features`}
                              </li>
                            )}
                          </ul>
                        </div>
                      )}

                    <div class="flex gap-4">
                      <a
                        href={`/projects/${
                          latestProject.slug || latestProject.id
                        }`}
                        class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 inline-flex items-center"
                      >
                        {effectiveLocale === "zh-CN"
                          ? "查看详情"
                          : "View Details"}
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
                      {latestProject.demoUrl && (
                        <a
                          href={latestProject.demoUrl}
                          target="_blank"
                          class="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 inline-flex items-center"
                        >
                          {effectiveLocale === "zh-CN"
                            ? "在线演示"
                            : "Live Demo"}
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
                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            />
                          </svg>
                        </a>
                      )}
                      {latestProject.githubUrl && (
                        <a
                          href={latestProject.githubUrl}
                          target="_blank"
                          class="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300 inline-flex items-center"
                        >
                          {effectiveLocale === "zh-CN" ? "GitHub" : "GitHub"}
                          <svg
                            class="w-4 h-4 ml-1"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                          </svg>
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

      {/* Quick Start */}
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
