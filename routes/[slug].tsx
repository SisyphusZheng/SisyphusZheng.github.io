import { Handlers, PageProps } from "$fresh/server.ts";
import { extract } from "$std/front_matter/yaml.ts";
import { marked } from "https://deno.land/x/marked/mod.ts";
import { Head } from "$fresh/runtime.ts";
import Layout from "../components/Layout.tsx";

interface BlogPage {
  markdown: string;
  data: Record<string, unknown>;
}

export const handler: Handlers<BlogPage> = {
  async GET(_req, ctx) {
    const filePath = `blogs/${ctx.params.slug}.md`;
    try {
      const rawMarkdown = await Deno.readTextFile(filePath);
      const { attrs, body } = extract(rawMarkdown);
      return ctx.render({ markdown: body, data: attrs });
    } catch {
      return ctx.render(undefined);
    }
  },
};

export default function BlogPage({ data }: PageProps<BlogPage | null>) {
  if (!data) return <h1>博客未找到</h1>;

  return (
    <>
      <Layout>
        <main className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold">{data.data.title}</h1>
          <p className="text-gray-500">{data.data.date}</p>
          <div
            className="prose dark:prose-dark max-w-none"
            dangerouslySetInnerHTML={{ __html: marked(data.markdown) }}
          />
        </main>
      </Layout>
    </>
  );
}
