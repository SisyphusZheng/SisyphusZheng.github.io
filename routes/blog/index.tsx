import { Handlers } from "$fresh/server.ts";
import Layout from "../../components/Layout.tsx";
import { siteConfig } from "../../data/config.ts";
import { getAllPosts, Post } from "../../utils/blog.ts";
import { t, currentLocale, type Locale, formatDate } from "../../utils/i18n.ts";

function parseFrontMatter(content: string): {
  attrs: Record<string, any>;
  body: string;
} {
  const lines = content.split("\n");
  const attrs: Record<string, any> = {};
  let body = content;
  let inFrontMatter = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line === "---") {
      if (!inFrontMatter) {
        inFrontMatter = true;
        continue;
      } else {
        body = lines.slice(i + 1).join("\n");
        break;
      }
    }

    if (inFrontMatter) {
      const [key, ...values] = line.split(":");
      if (key && values.length > 0) {
        const value = values.join(":").trim();
        attrs[key.trim()] = value.replace(/^['"]|['"]$/g, "");
      }
    }
  }

  return { attrs, body };
}

export const handler: Handlers<Post[]> = {
  async GET(req, ctx) {
    // 从URL获取语言参数
    const url = new URL(req.url);
    const langParam = url.searchParams.get("lang");

    const locale =
      langParam === "zh-CN" || langParam === "en-US" ? langParam : undefined;

    const posts = await getAllPosts(locale);
    return ctx.render(posts);
  },
};

export default function BlogIndex({ data }: { data: Post[] }) {
  // 使用当前语言设置
  const locale = currentLocale.value;

  return (
    <Layout>
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 class="text-4xl font-bold mb-8 dark:text-white">
          {t("blog.title", locale)}
        </h1>
        <p class="text-xl text-gray-600 dark:text-gray-300 mb-8">
          {t("blog.description", locale)}
        </p>

        <div class="space-y-8">
          {data.map((post) => (
            <article class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h2 class="text-2xl font-bold mb-2">
                <a
                  href={`/blog/${post.slug}`}
                  class="text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  {post.title}
                </a>
              </h2>
              <div class="text-gray-500 dark:text-gray-400 mb-4">
                {formatDate(post.date, locale)} ·{" "}
                {post.tags.map((tag) => (
                  <span class="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-2 py-1 rounded-full text-sm mr-2">
                    {tag}
                  </span>
                ))}
              </div>
              <p class="text-gray-600 dark:text-gray-300">{post.excerpt}</p>
              <a
                href={`/blog/${post.slug}`}
                class="inline-block mt-4 text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300"
              >
                {t("blog.readMore", locale)} →
              </a>
            </article>
          ))}
        </div>
      </div>
    </Layout>
  );
}
