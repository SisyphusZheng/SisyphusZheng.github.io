import { Handlers } from "$fresh/server.ts";
import Layout from "../../components/Layout.tsx";
import { siteConfig } from "../../data/config.ts";

interface Post {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  content: string;
}

function parseFrontMatter(content: string): { attrs: Record<string, any>; body: string } {
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
  async GET(_req, ctx) {
    const posts = [];
    for await (const dirEntry of Deno.readDir("./blog")) {
      if (dirEntry.isFile && dirEntry.name.endsWith(".md")) {
        const file = await Deno.readTextFile(`./blog/${dirEntry.name}`);
        const { attrs, body } = parseFrontMatter(file);
        posts.push({
          slug: dirEntry.name.replace(".md", ""),
          title: attrs.title || "未命名文章",
          date: attrs.date || new Date().toISOString(),
          tags: attrs.tags ? attrs.tags.split(",").map((tag: string) => tag.trim()) : [],
          content: body,
        });
      }
    }
    return ctx.render(posts);
  },
};

export default function BlogIndex({ data }: { data: Post[] }) {
  return (
    <Layout>
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 class="text-4xl font-bold mb-8">{siteConfig.blog.title}</h1>
        <p class="text-xl text-gray-600 mb-8">{siteConfig.blog.description}</p>

        <div class="space-y-8">
          {data.map((post) => (
            <article class="bg-white p-6 rounded-lg shadow-md">
              <h2 class="text-2xl font-bold mb-2">
                <a
                  href={`/blog/${post.slug}`}
                  class="text-gray-900 hover:text-blue-600 transition-colors"
                >
                  {post.title}
                </a>
              </h2>
              <div class="text-gray-500 mb-4">
                {new Date(post.date).toLocaleDateString()} ·{" "}
                {post.tags.map((tag) => (
                  <span class="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-sm mr-2">
                    {tag}
                  </span>
                ))}
              </div>
              <p class="text-gray-600">
                {post.content.split("\n")[0]}
              </p>
              <a
                href={`/blog/${post.slug}`}
                class="inline-block mt-4 text-blue-600 hover:text-blue-800 transition-colors"
              >
                {siteConfig.blog.readMore}
              </a>
            </article>
          ))}
        </div>
      </div>
    </Layout>
  );
} 