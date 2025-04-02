import { Handlers } from "$fresh/server.ts";
import { extract } from "$std/front_matter/yaml.ts";

export const handler: Handlers = {
  async GET(req, ctx) {
    const blogs: { title: string; date: string; slug: string }[] = [];

    for await (const entry of Deno.readDir("./blogs")) {
      if (entry.isFile && entry.name.endsWith(".md")) {
        const filePath = `./blogs/${entry.name}`;
        const rawMarkdown = await Deno.readTextFile(filePath);
        const { attrs } = extract(rawMarkdown);

        blogs.push({
          title: attrs.title || "未命名博客",
          date: attrs.date || "未知日期",
          slug: entry.name.replace(".md", ""),
        });
      }
    }

    blogs.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    ); // 按日期降序排序
    return new Response(JSON.stringify(blogs), {
      headers: { "Content-Type": "application/json" },
    });
  },
};
