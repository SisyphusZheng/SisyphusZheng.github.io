import { h } from "preact";
import { Handlers } from "$fresh/server.ts";
import Layout from "../../components/Layout.tsx";
import { siteConfig } from "../../docs/config.ts";
import { BlogPlugin } from "../../plugins/blog/mod.ts";
import type { BlogPost } from "../../core/content.ts";
import { I18nPlugin, i18nPlugin, t } from "../../plugins/i18n/mod.ts";
import { type Locale } from "../../docs/content.ts";

// 创建博客插件实例
const blogPlugin = new BlogPlugin({ postsDir: "docs/blog" });

// 日期格式化函数
const formatDate = (dateString: string, locale: string) => {
  try {
    return new Date(dateString).toLocaleDateString(
      locale === "zh-CN" ? "zh-CN" : "en-US",
      { year: "numeric", month: "long", day: "numeric" }
    );
  } catch (e) {
    return dateString;
  }
};

// 定义BlogPage的数据接口
interface BlogPageData {
  posts: BlogPost[];
  locale: string;
  translations: Record<string, any>;
}

export const handler: Handlers<BlogPageData> = {
  async GET(req: Request, ctx: any) {
    // 从URL获取语言参数
    const url = new URL(req.url);
    const langParam = url.searchParams.get("lang");

    const locale =
      langParam === "zh-CN" || langParam === "en-US"
        ? (langParam as Locale)
        : "en-US";

    // 确保i18n插件已激活
    if (!i18nPlugin.initialized) {
      await i18nPlugin.activate();
    }

    // 设置i18n插件的当前语言
    i18nPlugin.setLocale(locale);
    console.log(`[Blog] 当前语言已设置为: ${i18nPlugin.getLocale()}`);

    // 确保翻译已加载
    await i18nPlugin.waitForTranslations();
    console.log(`[Blog] 已加载翻译`);

    // 获取所有翻译
    const translations = i18nPlugin.getTranslations();
    console.log(`[Blog] 已加载翻译语言:`, Object.keys(translations));

    // 强制加载当前语言
    await i18nPlugin.forceLoadLanguage(locale);

    // 激活插件并获取博客文章
    await blogPlugin.activate();
    const posts = await blogPlugin.loadPosts();
    console.log(`[Blog] 加载了 ${posts.length} 篇博客文章`);

    // 返回数据包含博客文章和翻译
    return ctx.render({
      posts,
      locale,
      translations,
    });
  },
};

export default function BlogIndex({ data }: { data: BlogPageData }) {
  // 获取当前语言设置
  const locale = data.locale;
  const posts = data.posts;

  // 注入翻译数据到全局对象
  if (typeof window !== "undefined" && data.translations) {
    console.log(`[Blog] 向全局注入翻译数据，当前语言: ${locale}`);
    window.__translations = data.translations;
    window.__currentLocale = locale || "en-US";

    // 测试全局翻译
    setTimeout(() => {
      console.log(
        `[Blog] 导航翻译测试: 首页=`,
        window.__t ? window.__t("nav.home") : "全局翻译函数不存在"
      );
    }, 100);
  }

  // 硬编码翻译
  const translations = {
    "en-US": {
      title: "Blog",
      description: "Latest articles and updates",
      readMore: "Read more",
    },
    "zh-CN": {
      title: "博客",
      description: "最新文章和更新",
      readMore: "阅读更多",
    },
  };

  const lang = locale === "zh-CN" ? "zh-CN" : "en-US";

  return (
    <Layout locale={locale}>
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 class="text-4xl font-bold mb-8 dark:text-white">
          {translations[lang].title}
        </h1>
        <p class="text-xl text-gray-600 dark:text-gray-300 mb-8">
          {translations[lang].description}
        </p>

        <div class="space-y-8">
          {posts && posts.length > 0 ? (
            posts.map((post) => (
              <article class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h2 class="text-2xl font-bold mb-2">
                  <a
                    href={`/blog/${post.id}`}
                    class="text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    {post.title}
                  </a>
                </h2>
                <div class="text-gray-500 dark:text-gray-400 mb-4">
                  {formatDate(post.date || "", locale)} ·{" "}
                  {post.tags?.map((tag) => (
                    <span class="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-2 py-1 rounded-full text-sm mr-2">
                      {tag}
                    </span>
                  ))}
                </div>
                <p class="text-gray-600 dark:text-gray-300">
                  {post.description}
                </p>
                <a
                  href={`/blog/${post.id}`}
                  class="inline-block mt-4 text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300"
                >
                  {translations[lang].readMore} →
                </a>
              </article>
            ))
          ) : (
            <p class="text-gray-600 dark:text-gray-300">No blog posts found.</p>
          )}
        </div>
      </div>
    </Layout>
  );
}
