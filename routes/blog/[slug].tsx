import { h } from "preact";
import { Handlers, PageProps } from "$fresh/server.ts";
import Layout from "../../components/Layout.tsx";
import { siteConfig } from "../../docs/config.ts";
import { marked } from "marked";
import { BlogPlugin } from "../../plugins/blog/mod.ts";
import type { BlogPost } from "../../core/content.ts";

// 创建博客插件实例
const blogPlugin = new BlogPlugin({ postsDir: "docs/blog" });

export const handler: Handlers<BlogPost> = {
  async GET(req: Request, ctx: any) {
    const slug = ctx.params.slug;
    // 激活插件并获取文章
    await blogPlugin.activate();
    const posts = await blogPlugin.loadPosts();
    const post = posts.find((p) => p.id === slug);

    if (!post) {
      return ctx.renderNotFound();
    }

    return ctx.render(post);
  },
};

export default function BlogPostPage({ data }: PageProps<BlogPost>) {
  return (
    <Layout>
      <article class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border dark:border-gray-700 p-6">
          <h1 class="text-4xl font-bold mb-4 dark:text-white">{data.title}</h1>
          <div class="text-gray-500 dark:text-gray-300 mb-8">
            {new Date(data.date || "").toLocaleDateString()} ·{" "}
            {data.tags?.map((tag) => (
              <span class="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-2 py-1 rounded-full text-sm mr-2">
                {tag}
              </span>
            ))}
          </div>
          <div
            class="prose max-w-none dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: marked(data.content) }}
          />
        </div>
      </article>
    </Layout>
  );
}
