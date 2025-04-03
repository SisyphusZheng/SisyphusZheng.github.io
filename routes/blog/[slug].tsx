import { Handlers } from "$fresh/server.ts";
import Layout from "../../components/Layout.tsx";
import { siteConfig } from "../../data/config.ts";
import { marked } from "marked";

interface Post {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  content: string;
}

function parseFrontMatter(content: string): { attrs: Record<string, any>; body: string } {
  const lines = content.split("\n");
  if (lines[0] !== "---") {
    return { attrs: {}, body: content };
  }

  const attrs: Record<string, any> = {};
  let i = 1;
  for (; i < lines.length; i++) {
    if (lines[i] === "---") {
      i++;
      break;
    }
    const [key, ...values] = lines[i].split(":");
    attrs[key.trim()] = values.join(":").trim().replace(/^['"]|['"]$/g, "");
  }

  return {
    attrs,
    body: lines.slice(i).join("\n"),
  };
}

export const handler: Handlers<Post> = {
  async GET(_req, ctx) {
    const slug = ctx.params.slug;
    try {
      const file = await Deno.readTextFile(`./blog/${slug}.md`);
      const { attrs, body } = parseFrontMatter(file);
      return ctx.render({
        slug,
        title: attrs.title as string,
        date: attrs.date as string,
        tags: (attrs.tags as string).split(",").map((tag) => tag.trim()),
        content: body,
      });
    } catch {
      return ctx.renderNotFound();
    }
  },
};

export default function BlogPost({ data }: { data: Post }) {
  return (
    <Layout>
      <article class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 class="text-4xl font-bold mb-4">{data.title}</h1>
        <div class="text-gray-500 mb-8">
          {new Date(data.date).toLocaleDateString()} ·{" "}
          {data.tags.map((tag) => (
            <span class="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-sm mr-2">
              {tag}
            </span>
          ))}
        </div>
        <div
          class="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: marked(data.content) }}
        />
      </article>
    </Layout>
  );
} 