import { Handlers } from "$fresh/server.ts";
import Layout from "../../components/Layout.tsx";
import { siteConfig } from "../../data/config.ts";
import { marked } from "marked";
import { getPostBySlug, Post } from "../../utils/blog.ts";

export const handler: Handlers<Post> = {
  async GET(_req, ctx) {
    const slug = ctx.params.slug;
    const post = await getPostBySlug(slug);

    if (!post) {
      return ctx.renderNotFound();
    }

    return ctx.render(post);
  },
};

export default function BlogPost({ data }: { data: Post }) {
  return (
    <Layout>
      <article class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 class="text-4xl font-bold mb-4 dark:text-white">{data.title}</h1>
        <div class="text-gray-500 dark:text-gray-300 mb-8">
          {new Date(data.date).toLocaleDateString()} ·{" "}
          {data.tags.map((tag) => (
            <span class="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 px-2 py-1 rounded-full text-sm mr-2">
              {tag}
            </span>
          ))}
        </div>
        <div
          class="prose max-w-none dark:prose-invert"
          dangerouslySetInnerHTML={{ __html: marked(data.content) }}
        />
      </article>
    </Layout>
  );
}
